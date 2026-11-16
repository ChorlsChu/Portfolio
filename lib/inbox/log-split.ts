/**
 * Splits the merged log back into the files it came from.
 *
 * The app sends one text field per report, not one JSON field per file: each file is
 * prefixed with `----- name -----` and the parts are concatenated. That keeps the wire
 * format small and the D1 schema free of an extra table, at the cost of this parser.
 *
 * Reports sent before the markers existed (or with a log the app trimmed) have text
 * before the first marker; that becomes one unnamed file rather than being dropped.
 */

const MARKER = /^----- (.+?) -----$/;

export type LogSection = { name: string; text: string };

export function splitLogSections(log: string): LogSection[] {
  const sections: { name: string; lines: string[] }[] = [];
  let current: { name: string; lines: string[] } | null = null;

  for (const line of log.split("\n")) {
    const match = MARKER.exec(line.trimEnd());
    if (match) {
      current = { name: match[1].trim(), lines: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      if (!line.trim()) continue;
      current = { name: "error.log", lines: [] };
      sections.push(current);
    }
    current.lines.push(line);
  }

  return sections
    .filter((section) => section.lines.length > 0)
    .map((section) => ({
      name: section.name.toLowerCase().endsWith(".log") ? section.name : `${section.name}.txt`,
      text: section.lines.join("\n"),
    }));
}

/** No separators, no traversal, nothing a Windows extractor would reject. */
export function safeZipName(raw: string): string {
  const cleaned = raw
    .replace(/[\\/]+/g, "-")
    .replace(/[<>:"|?*\u0000-\u001f]+/g, "_")
    .replace(/^\.+/, "")
    .trim();
  return cleaned.length > 0 ? cleaned.slice(0, 96) : "log.txt";
}

/** Appends `-2`, `-3`, ... until the name is free. Case-sensitive, as ZIP is. */
export function uniqueZipName(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let n = 2;
  while (used.has(`${stem}-${n}${ext}`)) n += 1;
  const result = `${stem}-${n}${ext}`;
  used.add(result);
  return result;
}
