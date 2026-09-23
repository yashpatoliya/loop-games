import { notFound } from "next/navigation";
import { getGame, getGames } from "@/lib/games";
import { getRequestOrigin } from "@/lib/request";
import GamePlayerPage from "@/components/GamePlayerPage";

// No generateStaticParams here on purpose — pre-rendering a static page per
// game doesn't scale to a 21k-game catalog. Pages render on-demand instead
// (dynamicParams defaults to true).

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) notFound();

  const { host, proto } = await getRequestOrigin();
  const others = getGames().filter((g) => g.slug !== game.slug);
  const sameCategory = others.filter((g) =>
    g.categories.some((c) => game.categories.includes(c)),
  );
  const more = [
    ...sameCategory,
    ...others.filter((g) => !sameCategory.includes(g)),
  ].slice(0, 8);

  return (
    <GamePlayerPage game={game} host={host} proto={proto} more={more} />
  );
}
