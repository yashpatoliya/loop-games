import { notFound } from "next/navigation";
import GameRow from "@/components/GameRow";
import InfiniteGameGrid from "@/components/InfiniteGameGrid";
import { categorySlug } from "@/lib/gameHelpers";
import {
  getCategories,
  getCategoryBySlug,
  getGames,
  getGamesPage,
} from "@/lib/games";

const ROW_SIZE = 20;

export function generateStaticParams() {
  return getCategories().map((category) => ({
    category: categorySlug(category),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const games = getGames();
  const { games: firstPage, page, totalPages, total } = getGamesPage({
    page: 1,
    category,
  });
  const otherCategories = getCategories()
    .filter((c) => c !== category)
    .slice(0, 8);

  return (
    <div className="pb-12 pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
          {category}
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          {total} game{total === 1 ? "" : "s"} in this category
        </p>
      </div>

      <InfiniteGameGrid
        initialGames={firstPage}
        initialPage={page}
        initialTotalPages={totalPages}
        category={category}
      />

      <div className="mt-10">
        {otherCategories.map((c) => (
          <GameRow
            key={c}
            heading={`Because you enjoy ${c} games`}
            games={games
              .filter((g) => g.categories.includes(c))
              .slice(0, ROW_SIZE)}
          />
        ))}
      </div>
    </div>
  );
}
