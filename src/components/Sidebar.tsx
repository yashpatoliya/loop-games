"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { categorySlug } from "@/lib/gameHelpers";
import { CATEGORY_ICON } from "@/lib/categoryIcons";

const SCROLL_STEP = 140;

export default function Sidebar({ categories }: { categories: string[] }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 2);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    window.addEventListener("resize", updateScrollState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories]);

  function scrollUp() {
    listRef.current?.scrollBy({ top: -SCROLL_STEP, behavior: "smooth" });
  }

  function scrollDown() {
    listRef.current?.scrollBy({ top: SCROLL_STEP, behavior: "smooth" });
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-16 shrink-0 flex-col items-center py-4 sm:flex 2xl:w-52 2xl:items-stretch 2xl:px-1">
      <div className="flex w-full shrink-0 flex-col items-center gap-1 2xl:items-stretch">
        <button
          type="button"
          aria-label="Search"
          className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-neutral-100 text-neutral-500 transition hover:text-neutral-900 dark:border-white/10 dark:bg-neutral-900 dark:hover:text-white 2xl:hidden"
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
            className="w-full rounded-lg border border-black/10 bg-neutral-100 py-2 pl-9 pr-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-teal-400 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
          />
        </div>

        <SidebarLink
          href="/"
          label="All Games"
          icon="🎮"
          active={pathname === "/"}
        />

        <div className="my-1 w-full border-t border-black/5 dark:border-white/5" />

        {canScrollUp && (
          <button
            type="button"
            onClick={scrollUp}
            aria-label="Scroll categories up"
            className="flex h-6 w-full shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-black/5 hover:text-neutral-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <span>⌃</span>
          </button>
        )}
      </div>

      <div
        ref={listRef}
        onScroll={updateScrollState}
        className="flex w-full min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden 2xl:items-stretch"
      >
        {categories.map((category) => {
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
      </div>

      <div className="flex w-full shrink-0 flex-col items-center gap-1 2xl:items-stretch">
        {canScrollDown && (
          <button
            type="button"
            onClick={scrollDown}
            aria-label="Scroll categories down"
            className="flex h-6 w-full shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-black/5 hover:text-neutral-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <span>⌄</span>
          </button>
        )}

        <div className="my-1 w-full border-t border-black/5 dark:border-white/5" />

        <SidebarLink
          href="/support"
          label="Support"
          icon="❔"
          active={pathname === "/support"}
        />
      </div>
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
          ? "bg-black/5 text-teal-600 dark:bg-white/10 dark:text-teal-400"
          : "text-neutral-500 hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden truncate 2xl:inline">{label}</span>
    </Link>
  );
}
