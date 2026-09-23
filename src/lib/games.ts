import gamesData from "@/data/games.json";

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
  color: string;
  thumbnail?: string;
};

export type PlayGame = GameBase & {
  type: "play";
  playUrl: string;
};

export type EmbedGame = GameBase & {
  type: "embed";
  provider: "gamedistribution";
  gdId: string;
};

export type DownloadGame = GameBase & {
  type: "download";
  version: string;
  releases: Release[];
};

export type Game = PlayGame | EmbedGame | DownloadGame;

export function getGames(): Game[] {
  return gamesData as Game[];
}

export function getGame(slug: string): Game | undefined {
  return getGames().find((game) => game.slug === slug);
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategories(): string[] {
  const categories: string[] = [];
  for (const g of getGames()) {
    if (!categories.includes(g.category)) categories.push(g.category);
  }
  return categories;
}

export function getCategoryBySlug(slug: string): string | undefined {
  return getCategories().find((c) => categorySlug(c) === slug);
}

export function getEmbedSrc(
  game: EmbedGame,
  host: string,
  proto: string,
): string {
  const pageUrl = `${proto}://${host}/games/${game.slug}`;
  return `https://html5.gamedistribution.com/${game.gdId}/?gd_sdk_referrer_url=${encodeURIComponent(pageUrl)}`;
}
