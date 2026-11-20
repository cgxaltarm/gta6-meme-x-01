// gta6-meme-x-01 — entry deliverable for the make.fun bounty
// "Post a GTA 6 meme on X" ($500, top 50 paid).
// This script copies POST.json — the URL of the published X post carrying
// the meme image — into /output so the bounty grader can read it.
//
// Safety: the URL is validated before copying. A malformed URL (not an
// x.com/<handle>/status/<numeric-id> link) aborts with a non-zero exit so a
// broken entry can never be submitted silently. A placeholder URL (status id
// all zeros) is copied but flagged loudly on stderr — replace POST.json with
// the real post URL before submitting.
//
// Usage: node main.ts            (Node 22+; run with --experimental-strip-types
//                                 or compile first: npx tsc main.ts)
//   or:  npx tsx main.ts
// Env:   OUTPUT_DIR overrides the default /output destination.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const X_POST_URL = /^https:\/\/x\.com\/[^/\s]+\/status\/\d+$/;

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "POST.json");
const outDir = process.env.OUTPUT_DIR ?? "/output";
const dest = join(outDir, "POST.json");

const post = JSON.parse(readFileSync(src, "utf8")) as { url?: unknown };
if (typeof post.url !== "string" || !X_POST_URL.test(post.url)) {
  console.error(`ERROR: POST.json url is not a valid X post URL: ${String(post.url)}`);
  console.error("Expected shape: https://x.com/<handle>/status/<numeric-id>");
  process.exit(1);
}
if (/\/status\/0+$/.test(post.url)) {
  console.error("WARNING: POST.json still holds a PLACEHOLDER URL (status id is all zeros).");
  console.error("Replace it with the real published post URL before submitting.");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);

// Byte-for-byte check that the copy actually landed intact.
if (!readFileSync(dest).equals(readFileSync(src))) {
  console.error(`ERROR: copied file ${dest} differs from ${src}`);
  process.exit(1);
}
console.log(`POST.json copied to ${dest} — url: ${post.url}`);
