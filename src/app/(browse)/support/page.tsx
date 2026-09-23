import Link from "next/link";

const SECTIONS = [
  {
    heading: "Account",
    links: [
      { label: "Manage Account", href: "#manage-account" },
      { label: "Sign in & Security", href: "#sign-in-security" },
    ],
  },
  {
    heading: "Terms & Privacy",
    links: [
      { label: "Privacy & Cookies", href: "#privacy" },
      { label: "Terms of Use", href: "#terms" },
    ],
  },
  {
    heading: "Other",
    links: [
      { label: "For Developers", href: "#developers" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

const FAQ = [
  {
    id: "manage-account",
    q: "How do I manage my account?",
    a: "Click your avatar in the top-right corner of the site to see your account and sign out. Account management (name, photo) currently follows whatever you set on your Google account, or the email you signed up with.",
  },
  {
    id: "sign-in-security",
    q: "How do I sign in, and is it safe?",
    a: "Click \"Sign in\" in the header or on any game page. You can sign in with Google, or create an account with an email and password. Sign-in is handled by Firebase Authentication — we never see or store your password.",
  },
  {
    id: "privacy",
    q: "What data do you collect?",
    a: "We store your account info (email, display name) if you sign in, and which games you've liked. We don't sell your data. Embedded games from GameDistribution may show ads and track play statistics under their own privacy policy.",
  },
  {
    id: "terms",
    q: "Terms of Use",
    a: "Loop Games is a hobby project. Games are provided by their original creators/publishers via GameDistribution or hosted directly; all trademarks and game content belong to their respective owners.",
  },
  {
    id: "developers",
    q: "I'm a developer — can I submit a game?",
    a: "Not yet — game submissions aren't open. Reach out via Contact below if you'd like to get in touch.",
  },
  {
    id: "faq",
    q: "A game won't load or is stuck loading — what do I do?",
    a: "Try refreshing the page. Some games take a few seconds to load ads before starting. If a game consistently fails to load, use Contact below to let us know which one.",
  },
  {
    id: "faq-2",
    q: "How do I play a game fullscreen?",
    a: "Open any game and click the expand icon (⛶) in the top-right of the toolbar. Click it again, or press Esc, to exit fullscreen.",
  },
  {
    id: "faq-3",
    q: "Can I install Loop Games as an app?",
    a: "Yes — on desktop Chrome/Edge, click the install icon in the address bar. On mobile, use \"Add to Home Screen\" from your browser's menu. Loop Games works offline as a installed app for pages you've already visited.",
  },
  {
    id: "contact",
    q: "How do I contact support?",
    a: "Use the Feedback button in the bottom-right corner of any page to send us a message.",
  },
];

export default function SupportPage() {
  return (
    <div className="pb-16 pt-8">
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-neutral-900 to-neutral-950 px-6 py-10 sm:px-10 sm:py-14">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Help and Support
          </h1>
          <p className="mt-2 text-neutral-300">
            Everything you need to know about your account, privacy, and
            more.
          </p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 rotate-12 rounded-3xl bg-white/5 sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 hidden h-56 w-56 -translate-y-1/2 -rotate-6 rounded-3xl bg-white/5 md:block"
        />
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
              {section.heading}
            </h2>
            <div className="flex flex-wrap gap-2">
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600 ring-1 ring-black/5 transition hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-white/10 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-black/5 rounded-2xl bg-neutral-50 ring-1 ring-black/5 dark:divide-white/5 dark:bg-neutral-900 dark:ring-white/10">
          {FAQ.map((item) => (
            <details key={item.id} id={item.id} className="group p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 marker:content-none dark:text-white">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="shrink-0 text-neutral-400 transition group-open:rotate-45 dark:text-neutral-500">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        Still need help?{" "}
        <Link href="/" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
          Head back to all games
        </Link>{" "}
        or use the Feedback button to reach us.
      </p>
    </div>
  );
}
