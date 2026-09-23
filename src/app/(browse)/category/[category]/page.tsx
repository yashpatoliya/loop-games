import { notFound } from "next/navigation";
import GameRow from "@/components/GameRow";
import AllGamesGrid from "@/components/AllGamesGrid";
import {
  categorySlug,
  getCategories,
  getCategoryBySlug,
  getGames,
} from "@/lib/games";

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
  const inCategory = games.filter((g) => g.category === category);
  const otherCategories = getCategories().filter((c) => c !== category);

  return (
    <div className="pb-12 pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          {category}
        </h1>
        <p className="mt-2 text-neutral-400">
          {inCategory.length} game{inCategory.length === 1 ? "" : "s"} in this
          category
        </p>
      </div>

      <AllGamesGrid games={inCategory} />

      <div className="mt-10">
        {otherCategories.map((c) => (
          <GameRow
            key={c}
            heading={`Because you enjoy ${c} games`}
            games={games.filter((g) => g.category === c)}
          />
        ))}
      </div>
    </div>
  );
}
