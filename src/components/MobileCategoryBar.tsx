"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categorySlug } from "@/lib/gameHelpers";
import { CATEGORY_ICON } from "@/lib/categoryIcons";

export default function MobileCategoryBar({
  categories,
}: {
  categories: string[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
      <Chip href="/" label="All Games" icon="🎮" active={pathname === "/"} />
      {categories.map((category) => {
        const href = `/category/${categorySlug(category)}`;
        return (
          <Chip
            key={category}
            href={href}
            label={category}
            icon={CATEGORY_ICON[category] ?? "🎮"}
            active={pathname === href}
          />
        );
      })}
    </div>
  );
}

function Chip({
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
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-teal-500/50 bg-teal-500/10 text-teal-600 dark:border-teal-400/50 dark:bg-teal-400/10 dark:text-teal-300"
          : "border-black/10 text-neutral-500 hover:text-neutral-900 dark:border-white/10 dark:text-neutral-400 dark:hover:text-white"
      }`}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
