"use client";

import { useEffect, useRef, useState } from "react";

export default function GameFrame({
  src,
  title,
  sandbox,
  allow,
}: {
  src: string;
  title: string;
  sandbox: string;
  allow?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [barWidth, setBarWidth] = useState("6%");
  const [barVisible, setBarVisible] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function finish() {
      setLoaded(true);
      setBarWidth("100%");
      setTimeout(() => setBarVisible(false), 350);
    }

    const startBar = setTimeout(() => setBarWidth("85%"), 60);

    // iframe `load` can fire before React attaches the onLoad listener
    // (common for fast same-origin loads) — check readyState as a fallback,
    // deferred so setState doesn't run synchronously inside the effect body.
    const checkReady = setTimeout(() => {
      const iframe = iframeRef.current;
      try {
        if (iframe?.contentDocument?.readyState === "complete") {
          finish();
        }
      } catch {
        // cross-origin: can't read readyState, rely on onLoad / the timeout below.
      }
    }, 0);

    // Absolute safety net so the spinner never gets stuck forever.
    const timeout = setTimeout(finish, 20000);

    iframeRef.current?.addEventListener("load", finish);
    const iframeEl = iframeRef.current;

    return () => {
      clearTimeout(startBar);
      clearTimeout(checkReady);
      clearTimeout(timeout);
      iframeEl?.removeEventListener("load", finish);
    };
  }, [src]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-900">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm text-white/70">Loading {title}…</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        allow={allow}
        sandbox={sandbox}
        className={`h-full w-full transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {barVisible && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all ease-out"
            style={{
              width: barWidth,
              transitionDuration: loaded ? "300ms" : "6000ms",
            }}
          />
        </div>
      )}
    </div>
  );
}
