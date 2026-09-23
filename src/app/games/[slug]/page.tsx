import { notFound } from "next/navigation";
import { getGame, getGames } from "@/lib/games";
import { getRequestOrigin } from "@/lib/request";
import GamePlayerPage from "@/components/GamePlayerPage";

export function generateStaticParams() {
  return getGames().map((game) => ({ slug: game.slug }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) notFound();

  const { host, proto } = await getRequestOrigin();
  const more = getGames()
    .filter((g) => g.slug !== game.slug)
    .slice(0, 8);

  return (
    <GamePlayerPage game={game} host={host} proto={proto} more={more} />
  );
}
