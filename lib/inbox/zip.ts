/**
 * A tiny ZIP writer: every entry stored, nothing compressed.
 *
 * A log bundle is a few hundred kilobytes of already terse text, so a compression
 * dependency (or Worker CPU time) buys little here. Stored entries open in Windows
 * Explorer, macOS Archive Utility and every command-line unzip, which is the whole
 * requirement.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** MS-DOS timestamp, which is what a ZIP header carries. */
function dosStamp(now: Date): { time: number; date: number } {
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  return { time, date };
}

export type ZipEntry = { name: string; text: string };

/**
 * Builds a ZIP archive. Entry names must already be sanitised by the caller: this
 * writer takes them literally, separators included.
 *
 * The return type is `Uint8Array<ArrayBuffer>` rather than plain `Uint8Array`: since
 * TypeScript 5.7 the buffer is a type argument, and only a plain `ArrayBuffer` is
 * accepted as a fetch/Response body.
 */
export function zipStore(entries: ZipEntry[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const { time, date } = dosStamp(new Date());
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const data = encoder.encode(entry.text);
    const checksum = crc32(data);

    const header = new Uint8Array(30 + name.length);
    const hv = new DataView(header.buffer);
    hv.setUint32(0, 0x04034b50, true); // local file header
    hv.setUint16(4, 20, true); // version needed
    hv.setUint16(6, 0x0800, true); // UTF-8 file name
    hv.setUint16(8, 0, true); // stored
    hv.setUint16(10, time, true);
    hv.setUint16(12, date, true);
    hv.setUint32(14, checksum, true);
    hv.setUint32(18, data.length, true);
    hv.setUint32(22, data.length, true);
    hv.setUint16(26, name.length, true);
    hv.setUint16(28, 0, true); // extra field length
    header.set(name, 30);

    local.push(header, data);

    const record = new Uint8Array(46 + name.length);
    const rv = new DataView(record.buffer);
    rv.setUint32(0, 0x02014b50, true); // central directory header
    rv.setUint16(4, 20, true); // version made by
    rv.setUint16(6, 20, true); // version needed
    rv.setUint16(8, 0x0800, true);
    rv.setUint16(10, 0, true);
    rv.setUint16(12, time, true);
    rv.setUint16(14, date, true);
    rv.setUint32(16, checksum, true);
    rv.setUint32(20, data.length, true);
    rv.setUint32(24, data.length, true);
    rv.setUint16(28, name.length, true);
    rv.setUint16(30, 0, true); // extra
    rv.setUint16(32, 0, true); // comment
    rv.setUint16(34, 0, true); // disk number
    rv.setUint16(36, 0, true); // internal attributes
    rv.setUint32(38, 0, true); // external attributes
    rv.setUint32(42, offset, true);
    record.set(name, 46);
    central.push(record);

    offset += header.length + data.length;
  }

  const centralSize = central.reduce((sum, record) => sum + record.length, 0);

  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); // end of central directory
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true); // comment length

  const out = new Uint8Array(offset + centralSize + end.length);
  let at = 0;
  for (const chunk of local) {
    out.set(chunk, at);
    at += chunk.length;
  }
  for (const record of central) {
    out.set(record, at);
    at += record.length;
  }
  out.set(end, at);
  return out;
}
