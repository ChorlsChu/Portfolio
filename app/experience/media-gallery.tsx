"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ExperienceMedia } from "./data";

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function MediaGallery({ items }: { items: ExperienceMedia[] }) {
  const [active, setActive] = useState<ExperienceMedia | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  return (
    <>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.src}
            className="toggle-card cursor-zoom-in"
            role="button"
            tabIndex={0}
            aria-label={`Open ${item.alt}`}
            onClick={() => setActive(item)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActive(item);
              }
            }}
          >
            <Image
              className="toggle-media"
              src={item.src}
              alt={item.alt}
              width={960}
              height={540}
              unoptimized
            />
            {item.caption ? (
              <figcaption className="p-4 text-sm leading-6 text-[var(--soft)]">{item.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {active
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={active.alt}
              onClick={() => setActive(null)}
            >
              <button
                type="button"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
              <Image
                className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                src={active.src}
                alt={active.alt}
                width={960}
                height={540}
                unoptimized
                onClick={(event) => event.stopPropagation()}
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
