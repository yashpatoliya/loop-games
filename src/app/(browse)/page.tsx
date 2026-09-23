import GameRow from "@/components/GameRow";
import AllGamesGrid from "@/components/AllGamesGrid";
import { getCategories, getGames } from "@/lib/games";

export default function Home() {
  const games = getGames();
  const categories = getCategories();

  return (
    <div className="pb-12 pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Need a quick break?
        </h1>
        <p className="mt-2 text-neutral-400">
          Jump into our most popular games
        </p>
      </div>

      <GameRow heading="Popular right now" games={games} featured />

      {categories.map((category) => (
        <GameRow
          key={category}
          heading={`Because you enjoy ${category} games`}
          games={games.filter((g) => g.category === category)}
        />
      ))}

      <AllGamesGrid games={games} />
    </div>
  );
}
