import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Reads a Worker variable.
 *
 * Cloudflare variables and secrets arrive in the `env` binding. `next dev` and
 * `opennextjs-cloudflare preview` populate that same binding from `.dev.vars`
 * through OpenNext's dev initialiser, and `process.env` is the fallback for plain
 * Node (tests, one-off scripts). Nothing is read from either source twice.
 */
export async function readEnv(name: string): Promise<string> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const value = (env as unknown as Record<string, unknown>)[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  } catch {
    // No Worker context (plain Node): fall through to process.env.
  }
  return (process.env[name] ?? "").trim();
}
