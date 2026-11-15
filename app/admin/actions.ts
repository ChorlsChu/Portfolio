"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/inbox/admin-auth";
import { addNote, deleteReport, purgeOldReports, setStatus } from "@/lib/inbox/queries";

/**
 * Mutations behind plain HTML forms. Each one re-checks the session: server
 * actions are HTTP endpoints, so they need the same guard as a page.
 */

export async function updateStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) return;

  await setStatus(id, status);
  revalidatePath(`/admin/reports/${id}`);
  revalidatePath("/admin/reports");
}

export async function saveNote(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id || !body) return;

  await addNote(id, body);
  revalidatePath(`/admin/reports/${id}`);
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
