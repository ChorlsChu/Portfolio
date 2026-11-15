/**
 * gzip helpers for the log payload.
 *
 * The log is stored compressed because a single report carries up to 256 KB of
 * text: uncompressed that is ~9 GB at the 200/day ceiling over the 180-day
 * retention window, compressed it stays under 1 GB, i.e. comfortably inside D1's
 * free tier.
 */

export async function gzipBase64(text: string): Promise<string> {
  if (!text) return "";
  const input = new TextEncoder().encode(text);
  const compressed = new CompressionStream("gzip");
  const writer = compressed.writable.getWriter();
  await writer.write(input);
  await writer.close();
  const buffer = await new Response(compressed.readable).arrayBuffer();
  return Buffer.from(new Uint8Array(buffer)).toString("base64");
}

export async function gunzipBase64(base64: string): Promise<string> {
  if (!base64) return "";
  const input = Buffer.from(base64, "base64");
  const decompressed = new DecompressionStream("gzip");
  const writer = decompressed.writable.getWriter();
  await writer.write(new Uint8Array(input));
  await writer.close();
  const buffer = await new Response(decompressed.readable).arrayBuffer();
  return new TextDecoder().decode(buffer);
}
