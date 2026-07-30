// Quick sanity check for src/cards.json, catches the mistakes that are
// easy to make when hand-editing: broken JSON syntax, missing fields,
// duplicate ids, or a typo'd deck name.
//
// Run with: npm run check-cards

import { readFileSync } from "fs";

const path = "src/cards.json";
let raw;
try {
  raw = readFileSync(path, "utf-8");
} catch (e) {
  console.error(`Could not read ${path}: ${e.message}`);
  process.exit(1);
}

let cards;
try {
  cards = JSON.parse(raw);
} catch (e) {
  console.error("cards.json is not valid JSON. Common causes: a missing");
  console.error("comma between cards, a trailing comma after the last");
  console.error("card, or an unescaped quote inside a definition.");
  console.error("");
  console.error("Parser error: " + e.message);
  process.exit(1);
}

if (!Array.isArray(cards)) {
  console.error("cards.json should contain a single [ ... ] array of cards.");
  process.exit(1);
}

const seenIds = new Set();
const problems = [];

cards.forEach((card, i) => {
  const where = `card #${i} (front: "${card.front || "?"}")`;
  if (!card.id) problems.push(`${where} is missing an "id"`);
  else if (seenIds.has(card.id)) problems.push(`${where} reuses id "${card.id}", ids must be unique`);
  else seenIds.add(card.id);

  if (card.deck !== "vocab" && card.deck !== "math") {
    problems.push(`${where} has deck "${card.deck}", expected "vocab" or "math"`);
  }
  if (!card.tag) problems.push(`${where} is missing a "tag"`);
  if (!card.front) problems.push(`${where} is missing a "front"`);
  if (!card.back) problems.push(`${where} is missing a "back"`);
});

if (problems.length > 0) {
  console.error(`Found ${problems.length} problem(s) in cards.json:\n`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}

console.log(`cards.json looks good: ${cards.length} cards, no duplicate ids, all required fields present.`);
