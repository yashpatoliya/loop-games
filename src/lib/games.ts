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

export function getGames(): Game[] {
  if (!cache) {
    const filePath = join(process.cwd(), "src", "data", "games.json");
    const raw = readFileSync(filePath, "utf8");
    cache = JSON.parse(raw) as Game[];
  }
  return cache;
}

// GamePix's catalog is kept separate from the main GameDistribution-backed
// catalog — it's only used to feature a curated row, not mixed into
// category browsing.
export function getGamepixGames(): EmbedGame[] {
  if (!gamepixCache) {
    const filePath = join(process.cwd(), "src", "data", "gamepix.json");
    const raw = readFileSync(filePath, "utf8");
    gamepixCache = JSON.parse(raw) as EmbedGame[];
  }
  return gamepixCache;
}

export function getGame(slug: string): Game | undefined {
  return (
    getGames().find((game) => game.slug === slug) ??
    getGamepixGames().find((game) => game.slug === slug)
  );
}

export function getCategories(): string[] {
  const categories: string[] = [];
  for (const g of getGames()) {
    for (const c of g.categories) {
      if (!categories.includes(c)) categories.push(c);
    }
  }
  return categories;
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
