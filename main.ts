// gta6-meme-x-01 — entry deliverable for the make.fun bounty
// "Post a GTA 6 meme on X" ($500, top 50 paid).
// This script copies POST.json — the URL of the published X post carrying
// the meme image — into /output so the bounty grader can read it.
//
// Usage: node main.ts            (needs Node 22+; run with --experimental-strip-types
//                                 or compile first: npx tsc main.ts)
//   or:  npx tsx main.ts
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "POST.json");
const outDir = "/output";
const dest = join(outDir, "POST.json");

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
console.log(`POST.json copied to ${dest}`);
