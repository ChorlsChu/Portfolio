import fs from "node:fs";
import path from "node:path";
import type { ExperienceMedia } from "./data";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"];

function altFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  const alt = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (alt.length === 0) {
    return filename;
  }
  return alt.charAt(0).toUpperCase() + alt.slice(1);
}

export function discoverMedia(slug: string): ExperienceMedia[] {
  const dir = path.join(process.cwd(), "public", "experience", slug);
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .sort();

  return files.map((file) => ({
    src: `/experience/${slug}/${file}`,
    alt: altFromFilename(file),
    caption: "",
  }));
}
