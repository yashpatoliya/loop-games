export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm"
    >
      <defs>
        <linearGradient id="loopLogoBg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="loopLogoRing" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#loopLogoBg)" />
      <path
        d="M16 8a8 8 0 1 1-6.93 4"
        stroke="url(#loopLogoRing)"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M6 8.5 9.5 12 6 13.8Z" fill="#ffffff" />
      <circle cx="16" cy="16" r="2.6" fill="#ffffff" />
    </svg>
  );
}
