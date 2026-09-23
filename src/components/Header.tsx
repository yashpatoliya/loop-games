"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/components/Logo";
import { BellIcon, GearIcon, UserIcon } from "@/components/icons";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, openSignIn, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-extrabold tracking-tight text-white">
            Loop<span className="text-teal-400">Games</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Settings"
            className="hidden text-neutral-400 transition hover:text-white sm:block"
          >
            <GearIcon />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="hidden text-neutral-400 transition hover:text-white sm:block"
          >
            <BellIcon />
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-teal-500 text-sm font-bold text-neutral-950 ring-2 ring-white/10 transition hover:ring-white/20"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? "Account"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.displayName ?? user.email ?? "?")[0].toUpperCase()
                )}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-11 w-48 rounded-lg bg-neutral-900 p-2 text-sm shadow-xl ring-1 ring-white/10"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <p className="truncate px-2 py-1.5 text-neutral-400">
                    {user.displayName ?? user.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-md px-2 py-1.5 text-left font-medium text-white transition hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              aria-label="Sign in"
              onClick={openSignIn}
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 sm:px-3.5"
            >
              <UserIcon />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
