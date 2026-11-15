"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealTag = "div" | "section" | "article" | "li" | "figure";

type RevealProps = {
  children: ReactNode;
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

  // eslint-config-next 16 (React Compiler rules) flags passing a ref object into
  // `createElement`: it cannot prove the value is not read during render. A
  // capitalised element variable renders identically and keeps the ref in JSX.
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
