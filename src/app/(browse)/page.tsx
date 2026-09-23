import GameRow from "@/components/GameRow";
import InfiniteGameGrid from "@/components/InfiniteGameGrid";
import {
  getCategories,
  getGamepixGames,
  getGames,
  getGamesPage,
} from "@/lib/games";

const ROW_SIZE = 20;

export default function Home() {
  const games = getGames();
  const gamepixGames = getGamepixGames();
  const categories = getCategories();
  const { games: firstPage, page, totalPages } = getGamesPage({ page: 1 });

  return (
    <div className="pb-12 pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
          Need a quick break?
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Jump into our most popular games
        </p>
      </div>

      <GameRow
        heading="Popular right now"
        games={gamepixGames.slice(0, ROW_SIZE)}
        featured
      />

      {categories.slice(0, 12).map((category) => (
        <GameRow
          key={category}
          heading={`Because you enjoy ${category} games`}
          games={games
            .filter((g) => g.categories.includes(category))
            .slice(0, ROW_SIZE)}
        />
      ))}

      <InfiniteGameGrid
        initialGames={firstPage}
        initialPage={page}
        initialTotalPages={totalPages}
      />
    </div>
  );
}
