"use client";

import Image from "next/image";
import { useState } from "react";

type WallpaperState = "video" | "image" | "none";

export default function CaseStudyWallpaper({ basePath }: { basePath: string }) {
  const [wallpaperState, setWallpaperState] = useState<WallpaperState>("video");

  if (wallpaperState === "none") {
    return null;
  }

  return (
    <div className="case-study-wallpaper pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {wallpaperState === "video" ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setWallpaperState("image")}
        >
          <source src={`${basePath}/wallpaper.mp4`} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={`${basePath}/wallpaper.gif`}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          onError={() => setWallpaperState("none")}
        />
      )}
    </div>
  );
}
