// Bulk-imports GameDistribution's full catalog via their public GraphQL API
// (no auth required — the same endpoint their own catalog page calls).
//
// Their search backend caps deep pagination at ~10,000 results per query
// (page * perPage), even though the full catalog is ~21k games. To get past
// that, we query per-category (each category's own result count is well
// under 10k) and, for any category that still exceeds the cap, further
// split it by a single-character title search prefix.
//
// Run: node scripts/import-games.mjs

import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "src", "data", "games.json");
const ENDPOINT = "https://gd-website-api.gamedistribution.com/graphql";
const PER_PAGE = 400;
const PAGE_WINDOW_CAP = 9500; // stay safely under the ~10k window limit
const REQUEST_DELAY_MS = 200;
const SPLIT_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

const QUERY = `
fragment CoreGame on SearchHit {
  objectID
  title
  company
  visible
  exclusiveGame
  assets { name __typename }
  __typename
}

query GetGamesSearched($id: String! = "", $perPage: Int! = 0, $page: Int! = 0, $search: String! = "", $UIfilter: UIFilterInput! = {}, $filters: GameSearchFiltersFlat! = {}) {
  gamesSearched(
    input: {collectionObjectId: $id, hitsPerPage: $perPage, page: $page, search: $search, UIfilter: $UIfilter, filters: $filters}
  ) {
    hitsPerPage
    nbHits
    nbPages
    page
    hits { ...CoreGame __typename }
    filters { title key type values __typename }
    __typename
  }
}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function gqlFetch(variables, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationName: "GetGamesSearched",
          variables,
          query: QUERY,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(JSON.stringify(json.errors));
      return json.data.gamesSearched;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  retry ${attempt} after error: ${err.message}`);
      await sleep(500 * attempt);
    }
  }
}

const baseVars = { id: "", search: "", UIfilter: {} };

// master map: objectID -> { title, company, assets, categories: Set }
const master = new Map();

function mergeHit(hit, category) {
  if (!hit.visible) return;
  if (!hit.title || !hit.title.trim()) return; // skip untitled/broken entries
  let entry = master.get(hit.objectID);
  if (!entry) {
    entry = {
      objectID: hit.objectID,
      title: hit.title,
      company: hit.company,
      assets: hit.assets?.map((a) => a.name) ?? [],
      categories: new Set(),
    };
    master.set(hit.objectID, entry);
  }
  if (category) entry.categories.add(category);
}

function loadExisting() {
  try {
    const existing = JSON.parse(readFileSync(OUT_PATH, "utf8"));
    for (const g of existing) {
      master.set(g.gdId, {
        objectID: g.gdId,
        title: g.title,
        company: g.company,
        assets: g.thumbnail ? [g.thumbnail.replace("https://img.gamedistribution.com/", "")] : [],
        categories: new Set(g.categories ?? [g.category].filter(Boolean)),
      });
    }
    console.log(`Resumed with ${master.size} games already imported.`);
  } catch {
    // no existing file — starting fresh
  }
}

async function main() {
  loadExisting();
  const resuming = master.size > 0;

  if (!resuming) {
    console.log("Fetching category list...");
    const probe = await gqlFetch({ ...baseVars, perPage: 1, page: 1, filters: {} });
    const categoryFacet = probe.filters.find((f) => f.key === "genres");
    const categories = categoryFacet.values;
    console.log(`Found ${categories.length} categories:`, categories);

    for (const category of categories) {
      console.log(`Category: ${category} (running total: ${master.size})`);
      await fetchAllPagesForCategory(category);
      writeOutput(); // checkpoint after every category
    }
  } else {
    console.log("Resumed from existing data — skipping category pass, going straight to catch-all.");
  }

  console.log(`\nAfter category pass: ${master.size} unique games.`);
  console.log("Catch-all pass (unfiltered, split by search prefix) for any ungenred games...");
  for (const ch of SPLIT_CHARS) {
    const before = master.size;
    await fetchAllPagesUnfiltered(ch);
    console.log(`  "${ch}": total now ${master.size} (+${master.size - before})`);
    writeOutput();
  }

  console.log(`\nTotal unique games collected: ${master.size}`);
  writeOutput();
  console.log("Done.");
}

async function fetchAllPagesUnfiltered(search) {
  const filters = {};
  const probe = await gqlFetch({ ...baseVars, search, perPage: 1, page: 1, filters });
  if (probe.nbHits === 0) return;
  const totalPages = Math.ceil(Math.min(probe.nbHits, PAGE_WINDOW_CAP) / PER_PAGE);
  for (let page = 1; page <= totalPages; page++) {
    const data = await gqlFetch({ ...baseVars, search, perPage: PER_PAGE, page, filters });
    for (const hit of data.hits) mergeHit(hit, null);
    await sleep(REQUEST_DELAY_MS);
  }
}

async function fetchAllPagesForCategory(category) {
  const filters = { categories: [category] };
  const first = await gqlFetch({ ...baseVars, perPage: 1, page: 1, filters });
  const nbHits = first.nbHits;
  console.log(`  nbHits=${nbHits}`);
  if (nbHits === 0) return;

  if (nbHits <= PAGE_WINDOW_CAP) {
    const totalPages = Math.ceil(nbHits / PER_PAGE);
    for (let page = 1; page <= totalPages; page++) {
      const data = await gqlFetch({ ...baseVars, perPage: PER_PAGE, page, filters });
      for (const hit of data.hits) mergeHit(hit, category);
      await sleep(REQUEST_DELAY_MS);
    }
    return;
  }

  console.log(`  over window cap (${nbHits}), splitting by search prefix`);
  for (const ch of SPLIT_CHARS) {
    const searchVars = { ...baseVars, search: ch, perPage: 1, page: 1, filters };
    const probe = await gqlFetch(searchVars);
    if (probe.nbHits === 0) {
      await sleep(REQUEST_DELAY_MS);
      continue;
    }
    const totalPages = Math.ceil(Math.min(probe.nbHits, PAGE_WINDOW_CAP) / PER_PAGE);
    for (let page = 1; page <= totalPages; page++) {
      const data = await gqlFetch({
        ...baseVars,
        search: ch,
        perPage: PER_PAGE,
        page,
        filters,
      });
      for (const hit of data.hits) mergeHit(hit, category);
      await sleep(REQUEST_DELAY_MS);
    }
    console.log(`    "${ch}": +${probe.nbHits}`);
  }
}

function slugify(title, id) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base}-${id.slice(0, 6)}`;
}

function pickThumbnail(id, assetNames) {
  const preferred = ["-512x384", "-512x512", "-200x120", "-1280x720", "-1280x550"];
  for (const suffix of preferred) {
    const hit = assetNames.find((a) => a.includes(suffix));
    if (hit) return `https://img.gamedistribution.com/${hit}`;
  }
  if (assetNames.length > 0) {
    return `https://img.gamedistribution.com/${assetNames[0]}`;
  }
  return undefined;
}

function hashColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return hslToHex(hue, 65, 45);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function writeOutput() {
  const games = [...master.values()]
    .filter((entry) => entry.title && entry.title.trim())
    .map((entry) => {
    const categories = [...entry.categories];
    return {
      slug: slugify(entry.title, entry.objectID),
      title: entry.title,
      description: `${entry.title} — play free online, no download required.`,
      category: categories[0] ?? "Casual",
      categories: categories.length > 0 ? categories : ["Casual"],
      color: hashColor(entry.objectID),
      thumbnail: pickThumbnail(entry.objectID, entry.assets),
      type: "embed",
      provider: "gamedistribution",
      gdId: entry.objectID,
    };
  });

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(games, null, 2) + "\n");
  console.log(`Wrote ${games.length} games to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
