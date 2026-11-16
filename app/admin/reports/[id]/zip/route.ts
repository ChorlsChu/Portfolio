import { adminGate } from "@/lib/inbox/admin-auth";
import { gunzipBase64 } from "@/lib/inbox/gzip";
import { noStore, notFoundResponse } from "@/lib/inbox/http";
import { safeZipName, splitLogSections, uniqueZipName } from "@/lib/inbox/log-split";
import { getReport, reportAsText } from "@/lib/inbox/queries";
import { zipStore, type ZipEntry } from "@/lib/inbox/zip";

/**
 * One download containing everything: the readable report plus each log file as its
 * own entry.
 *
 * The app sends its logs as a single text field with `----- <file> -----` separators
 * (the server stores one gzipped blob, capped at 256K characters), so the files are
 * recovered by splitting on those markers rather than by changing the wire format.
 */

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const denied = await adminGate();
  if (denied) return denied;

  const { id } = await params;
  const report = await getReport(id);
  if (!report) return notFoundResponse();

  const log = await gunzipBase64(report.log_gz);
  const entries: ZipEntry[] = [{ name: "report.txt", text: reportAsText(report, log) }];

  if (log) {
    const used = new Set<string>(["report.txt"]);
    for (const section of splitLogSections(log)) {
      entries.push({ name: uniqueZipName(`logs/${safeZipName(section.name)}`, used), text: section.text });
    }
  }

  return new Response(zipStore(entries), {
    headers: noStore({
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="sifu-report-${report.id}.zip"`,
      "x-content-type-options": "nosniff",
    }),
  });
}
