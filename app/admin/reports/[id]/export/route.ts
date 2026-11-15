import { adminGate } from "@/lib/inbox/admin-auth";
import { gunzipBase64 } from "@/lib/inbox/gzip";
import { noStore, notFoundResponse } from "@/lib/inbox/http";
import { getReport, reportAsText } from "@/lib/inbox/queries";

/** The whole report (metadata + text + log) as one text file. */
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
  return new Response(reportAsText(report, log), {
    headers: noStore({
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="sifu-report-${report.id}.txt"`,
      "x-content-type-options": "nosniff",
    }),
  });
}
