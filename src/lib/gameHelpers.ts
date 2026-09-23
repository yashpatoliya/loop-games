// Pure helpers with zero data dependency — safe to import from client
// components. Never import the game dataset (lib/games.ts) from a client
// component; at catalog scale that would ship megabytes to the browser.
import type { EmbedGame } from "@/lib/games";

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getEmbedSrc(
  game: EmbedGame,
  host: string,
  proto: string,
): string {
  if (game.provider === "gamepix") return game.embedUrl;
  const pageUrl = `${proto}://${host}/games/${game.slug}`;
  return `https://html5.gamedistribution.com/${game.gdId}/?gd_sdk_referrer_url=${encodeURIComponent(pageUrl)}`;
}
