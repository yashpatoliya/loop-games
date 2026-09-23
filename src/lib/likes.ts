// Deterministic per-game "baseline" like count so every game starts around
// 10K+ likes (varied, but stable — not fabricated fresh on every render).
// Real likes from signed-in users are tracked separately in Firestore and
// added on top of this baseline.
export function baselineLikes(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  // Spread into a "10K+" range: 10,000 – 98,999.
  return 10000 + (hash % 89000);
}

export function formatLikeCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
