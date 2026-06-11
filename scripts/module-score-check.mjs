import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = readFileSync(join(root, "src/lib/demo-backend/module-score-evidence.ts"), "utf8");
const scores = [...source.matchAll(/score:\s*(\d+)/g)].map((match) => Number(match[1]));

if (scores.length < 14) {
  console.error(`Expected at least 14 module scores, found ${scores.length}.`);
  process.exit(1);
}

const belowTarget = scores.filter((score) => score < 95);
if (belowTarget.length > 0) {
  console.error(`Module score check failed. Scores below 95: ${belowTarget.join(", ")}`);
  process.exit(1);
}

const min = Math.min(...scores);
const avg = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
console.log(`Module score check passed. Minimum=${min}/100 Average=${avg}/100.`);
