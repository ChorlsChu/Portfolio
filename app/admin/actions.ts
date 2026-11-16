"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/inbox/admin-auth";
import { REPORT_STATUSES } from "@/lib/inbox/db";
import { addNote, deleteReport, purgeOldReports, setStatus } from "@/lib/inbox/queries";

/**
 * Mutations behind plain HTML forms. Each one re-checks the session: server
 * actions are HTTP endpoints, so they need the same guard as a page.
 *
 * Every mutation ends in a redirect rather than a revalidate. Inside the OpenNext
 * Worker, a revalidated server action can answer with the payload that was rendered
 * before the write, so the page keeps showing the old row even though D1 already has
 * the new value. A redirect forces the router to fetch the page again, which is the
 * same shape as removeReport - the one that always worked.
 */

export async function updateStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) return;

  // Reject anything outside the known set instead of letting setStatus coerce it to
  // "new": a tampered request should not be able to relabel a report silently.
  if (!(REPORT_STATUSES as readonly string[]).includes(status)) return;

  await setStatus(id, status);
  revalidatePath("/admin/reports");
  redirect(`/admin/reports/${id}?updated=${encodeURIComponent(status)}#status`);
}

export async function saveNote(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id || !body) return;

  await addNote(id, body);
  redirect(`/admin/reports/${id}#notes`);
}

export async function removeReport(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteReport(id);
  revalidatePath("/admin/reports");
  redirect("/admin/reports?deleted=1");
}

export async function purgeNow(): Promise<void> {
  await requireAdmin();
  const removed = await purgeOldReports();
  revalidatePath("/admin/reports");
  redirect(`/admin/reports?purged=${removed}`);
}
