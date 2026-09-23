import type { Metadata, Viewport } from "next";
import "./globals.css";
import FeedbackButton from "@/components/FeedbackButton";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Loop Games",
  description: "Play free browser games or download native builds.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Loop Games",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
        <AuthProvider>
          {children}
          <FeedbackButton />
          <RegisterServiceWorker />
        </AuthProvider>
      </body>
    </html>
  );
}
