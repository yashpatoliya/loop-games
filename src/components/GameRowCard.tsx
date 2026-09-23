import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/games";
import { baselineLikes, formatLikeCount } from "@/lib/likes";
import { CATEGORY_ICON } from "@/lib/categoryIcons";

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export default function GameRowCard({
  game,
  wide = false,
  fluid = false,
}: {
  game: Game;
  wide?: boolean;
  fluid?: boolean;
}) {
  const icon = CATEGORY_ICON[game.category] ?? "🎮";
  const widthClass = fluid
    ? "w-full"
    : wide
      ? "w-64 sm:w-80"
      : "w-36 sm:w-40";

  return (
    <Link
      href={`/games/${game.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block shrink-0 snap-start ${widthClass}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-200 shadow-md ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover:scale-[1.03] dark:bg-neutral-800 dark:ring-white/5">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            sizes={wide ? "320px" : "160px"}
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(135deg, ${game.color}, ${shade(game.color, -40)})`,
            }}
          >
            <span className="text-4xl drop-shadow-md">{icon}</span>
          </div>
        )}
        {wide && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100">
              Play now
            </span>
          </div>
        )}
        {game.type === "download" && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
            GET
          </span>
        )}
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold text-neutral-900 dark:text-white">
        {game.title}
      </p>
      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
        {game.category} · 👍 {formatLikeCount(baselineLikes(game.slug))}
      </p>
    </Link>
  );
}
