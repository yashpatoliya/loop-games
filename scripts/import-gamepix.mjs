// Imports the full quality-ranked catalog of games from GamePix's public
// feed (https://feeds.gamepix.com/v2/json) using our publisher sid (M3635,
// same account declared in public/ads.txt). Merged with src/data/games.json
// (the GameDistribution catalog) at runtime by src/lib/games.ts.
//
// Run: node scripts/import-gamepix.mjs

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "src", "data", "gamepix.json");
const SID = "M3635";
const PAGE_SIZE = 96; // feed only accepts specific values: 12, 24, 48, 96
const REQUEST_DELAY_MS = 150;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(page, retries = 3) {
  const url = `https://feeds.gamepix.com/v2/json?sid=${SID}&pagination=${PAGE_SIZE}&page=${page}&order=quality`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  retry ${attempt} after error: ${err.message}`);
      await sleep(500 * attempt);
    }
  }
}

function humanizeCategory(slug) {
  if (!slug) return "Casual";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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

function mapItem(item) {
  const category = humanizeCategory(item.category);
  return {
    slug: `gpx-${item.namespace}`,
    title: item.title,
    description:
      item.description ??
      `${item.title} — play free online, no download required.`,
    category,
    categories: [category],
    color: hashColor(item.id),
    thumbnail: item.banner_image,
    type: "embed",
    provider: "gamepix",
    embedUrl: item.url,
  };
}

async function main() {
  const seen = new Map();
  let page = 1;
  let lastPage = null;

  while (true) {
    console.log(`Fetching page ${page}/${lastPage ?? "?"} (have ${seen.size})...`);
    const data = await fetchPage(page);
    if (!data.items || data.items.length === 0) {
      console.log("No more items — feed exhausted.");
      break;
    }
    for (const item of data.items) {
      if (!item.title || !item.namespace) continue;
      seen.set(item.namespace, mapItem(item));
    }
    if (data.last_page_url) {
      lastPage = Number(new URL(data.last_page_url).searchParams.get("page"));
    }
    if (!data.next_url || (lastPage && page >= lastPage)) break;
    page += 1;
    await sleep(REQUEST_DELAY_MS);
  }

  const games = [...seen.values()];
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(games, null, 2) + "\n");
  console.log(`Wrote ${games.length} GamePix games to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
