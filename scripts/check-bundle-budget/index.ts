import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const html = await readFile(
  resolve("dist/learn/day-01-variables-types/index.html"),
  "utf8",
);
const assetPaths = new Set(
  [...html.matchAll(/(\/_astro\/[^"'<>\s?#]+\.(?:js|css))/g)].map(
    (match) => match[1]!,
  ),
);
let jsGzip = 0;
let cssGzip = 0;
for (const assetPath of assetPaths) {
  const gzip = gzipSync(
    await readFile(resolve("dist", assetPath.slice(1))),
  ).byteLength;
  if (assetPath.endsWith(".js")) jsGzip += gzip;
  if (assetPath.endsWith(".css")) cssGzip += gzip;
}
const failures = [];
if (jsGzip > 120 * 1024)
  failures.push(
    `lesson initial JS ${Math.round(jsGzip / 1024)}KB gzip exceeds 120KB target`,
  );
if (cssGzip > 40 * 1024)
  failures.push(`CSS ${Math.round(cssGzip / 1024)}KB gzip exceeds 40KB target`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Lesson initial budget OK: JS ${Math.round(jsGzip / 1024)}KB gzip, CSS ${Math.round(cssGzip / 1024)}KB gzip.`,
);
