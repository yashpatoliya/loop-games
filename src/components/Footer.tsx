const LINKS = [
  { label: "Privacy and Cookies", href: "/support#privacy" },
  { label: "Terms of Use", href: "/support#terms" },
  { label: "Advertise", href: "#" },
  { label: "...", href: "/support" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/5 dark:bg-neutral-950">
      <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-neutral-500 dark:text-neutral-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© {new Date().getFullYear()} Loop Games</span>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-neutral-900 dark:hover:text-neutral-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
