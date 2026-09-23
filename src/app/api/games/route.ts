import { NextRequest, NextResponse } from "next/server";
import { getGamesPage } from "@/lib/games";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const category = searchParams.get("category") ?? undefined;

  const { games, totalPages, total } = getGamesPage({
    page,
    pageSize: 60,
    category,
  });

  return NextResponse.json({
    games,
    page,
    totalPages,
    total,
    hasMore: page < totalPages,
  });
}
