import { readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";

const assetsDirectory = new URL("../dist/assets/", import.meta.url);
const entries = await readdir(assetsDirectory);
const files = [];

for (const entry of entries) {
  if (!entry.endsWith(".js")) continue;
  const fileUrl = new URL(entry, assetsDirectory);
  const fileStats = await stat(fileUrl);
  const contents = await readFile(fileUrl);
  files.push({ name: entry, bytes: fileStats.size, gzipBytes: gzipSync(contents).length });
}

for (const file of files.sort((a, b) => b.gzipBytes - a.gzipBytes)) {
  console.log(`${(file.gzipBytes / 1024).toFixed(2)} kB gzip\t${(file.bytes / 1024).toFixed(2)} kB\t${file.name}`);
}
