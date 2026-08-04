"use client";

import { createElement, useEffect, useRef, useState } from "react";

type RevealTag = "div" | "section" | "article" | "li" | "figure";

type RevealProps = {
  children: React.ReactNode;
  as?: RevealTag;
  delay?: number;
  onLoad?: boolean;
  className?: string;
};

export default function Reveal({
  children,
  as = "div",
  delay = 0,
  onLoad = true,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (onLoad) {
      const timer = window.setTimeout(() => setVisible(true), delay || 150);
      return () => window.clearTimeout(timer);
    }

    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoad, delay]);

  return createElement(
    as,
    {
      ref,
      className: `reveal${visible ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`,
    },
    children
  );
}
