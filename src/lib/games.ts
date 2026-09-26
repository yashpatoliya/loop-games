import { readFileSync } from "fs";
import { join } from "path";
import { categorySlug } from "@/lib/gameHelpers";

export type Release = {
  platform: "windows" | "linux" | "mac" | "android";
  label: string;
  filename: string;
  size: string;
  date: string;
  url: string;
};

type GameBase = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categories: string[];
  color: string;
  thumbnail?: string;
};

export type PlayGame = GameBase & {
  type: "play";
  playUrl: string;
};

export type EmbedGame = GameBase &
  (
    | { type: "embed"; provider: "gamedistribution"; gdId: string }
    | { type: "embed"; provider: "gamepix"; embedUrl: string }
  );

export type DownloadGame = GameBase & {
  type: "download";
  version: string;
  releases: Release[];
};

export type Game = PlayGame | EmbedGame | DownloadGame;

// Loaded lazily from disk (not a static `import`) so a large catalog never
// gets inlined into the webpack/Turbopack bundle graph. Cached after first
// read within the same server process.
let cache: Game[] | null = null;
let gamepixCache: EmbedGame[] | null = null;
let allCache: Game[] | null = null;
let categoriesCache: string[] | null = null;

function getGameDistributionGames(): Game[] {
  // if (!cache) {
  //   const filePath = join(process.cwd(), "src", "data", "games.json");
  //   const raw = readFileSync(filePath, "utf8");
  //   cache = JSON.parse(raw) as Game[];
  // }
  // return cache;
  return [];
}

// Full browsable catalog: GamePix (quality-ranked) first, then
// GameDistribution.
export function getGames(): Game[] {
  if (!allCache) {
    allCache = [...getGamepixGames(), ...getGameDistributionGames()];
  }
  return allCache;
}

export function getGamepixGames(): EmbedGame[] {
  if (!gamepixCache) {
    const filePath = join(process.cwd(), "src", "data", "gamepix.json");
    const raw = readFileSync(filePath, "utf8");
    gamepixCache = JSON.parse(raw) as EmbedGame[];
  }
  return gamepixCache;
}

export function getGame(slug: string): Game | undefined {
  return getGames().find((game) => game.slug === slug);
}

// Ordered by number of games, largest first, so the sidebar and homepage
// rows lead with the well-stocked categories.
export function getCategories(): string[] {
  if (!categoriesCache) {
    const counts = new Map<string, number>();
    for (const g of getGames()) {
      for (const c of g.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    categoriesCache = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([c]) => c);
  }
  return categoriesCache;
}

export function getCategoryBySlug(slug: string): string | undefined {
  return getCategories().find((c) => categorySlug(c) === slug);
}

export function getGamesPage({
  page = 1,
  pageSize = 60,
  category,
}: {
  page?: number;
  pageSize?: number;
  category?: string;
}): { games: Game[]; total: number; totalPages: number; page: number } {
  const all = category
    ? getGames().filter((g) => g.categories.includes(category))
    : getGames();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    games: all.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  };
}
