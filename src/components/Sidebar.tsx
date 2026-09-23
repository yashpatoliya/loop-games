"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categorySlug } from "@/lib/games";
import { CATEGORY_ICON } from "@/lib/categoryIcons";

const VISIBLE_COUNT = 6;

export default function Sidebar({ categories }: { categories: string[] }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const visibleCategories =
    expanded || categories.length <= VISIBLE_COUNT
      ? categories
      : categories.slice(0, VISIBLE_COUNT);

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-16 shrink-0 flex-col items-center gap-1 overflow-y-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex 2xl:w-52 2xl:items-stretch 2xl:px-1">
      <button
        type="button"
        aria-label="Search"
        className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 text-neutral-500 transition hover:text-white 2xl:hidden"
      >
        <SearchIcon />
      </button>
      <div className="relative mb-2 hidden w-full 2xl:block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-lg border border-white/10 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-teal-400"
        />
      </div>

      <SidebarLink
        href="/"
        label="All Games"
        icon="🎮"
        active={pathname === "/"}
      />

      <div className="my-2 w-full border-t border-white/5" />

      {visibleCategories.map((category) => {
        const href = `/category/${categorySlug(category)}`;
        return (
          <SidebarLink
            key={category}
            href={href}
            label={category}
            icon={CATEGORY_ICON[category] ?? "🎮"}
            active={pathname === href}
          />
        );
      })}

      {categories.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Show fewer categories" : "Show more categories"}
          className="flex h-8 w-full shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/5 hover:text-white"
        >
          <span
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            ⌄
          </span>
        </button>
      )}

      <div className="my-2 w-full border-t border-white/5" />

      <SidebarLink
        href="/support"
        label="Support"
        icon="❔"
        active={pathname === "/support"}
      />
    </aside>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition 2xl:h-auto 2xl:w-full 2xl:justify-start 2xl:gap-3 2xl:rounded-lg 2xl:px-3 2xl:py-2 ${
        active
          ? "bg-white/10 text-teal-400"
          : "text-neutral-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden truncate 2xl:inline">{label}</span>
    </Link>
  );
}
