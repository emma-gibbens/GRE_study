// A small interactive command-line tool for managing src/cards.json
// without scrolling through the raw file by hand.
//
// Run with: npm run cards
//
// Every add/edit/delete writes straight back to src/cards.json and
// re-sorts the file, so it stays in the same tidy, readable order
// whether you edit through this tool or by hand later.

import { readFileSync, writeFileSync } from "fs";
import { createInterface } from "node:readline/promises";

const CARDS_PATH = "src/cards.json";
const rl = createInterface({ input: process.stdin, output: process.stdout });

function loadCards() {
  return JSON.parse(readFileSync(CARDS_PATH, "utf-8"));
}

function saveCards(cards) {
  cards.sort((a, b) => {
    if (a.deck !== b.deck) return a.deck.localeCompare(b.deck);
    if (a.tag !== b.tag) return a.tag.localeCompare(b.tag);
    return a.front.toLowerCase().localeCompare(b.front.toLowerCase());
  });
  writeFileSync(CARDS_PATH, JSON.stringify(cards, null, 2) + "\n");
}

function nextId(cards, deck) {
  const prefix = deck === "vocab" ? "v" : "m";
  const pattern = new RegExp(`^${prefix}(\\d+)$`);
  let max = -1;
  for (const c of cards) {
    const m = pattern.exec(c.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `${prefix}${max + 1}`;
}

function existingTags(cards, deck) {
  return [...new Set(cards.filter((c) => c.deck === deck).map((c) => c.tag))].sort();
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function matches(card, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    card.front.toLowerCase().includes(q) ||
    card.back.toLowerCase().includes(q) ||
    card.tag.toLowerCase().includes(q) ||
    card.id.toLowerCase().includes(q)
  );
}

// Prints results and returns the list actually shown, in display order,
// so the caller can let the user pick one by its printed number.
function printResults(cards, query) {
  const found = cards.filter((c) => matches(c, query));
  if (found.length === 0) {
    console.log("  No matches.");
    return [];
  }
  found.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.front}  [${c.deck} / ${c.tag}]  id:${c.id}`);
    console.log(`     ${truncate(c.back, 74)}`);
  });
  console.log(`  (${found.length} card${found.length === 1 ? "" : "s"})`);
  return found;
}

async function ask(question, fallback = "") {
  const answer = (await rl.question(question)).trim();
  return answer === "" ? fallback : answer;
}

async function askRequired(question) {
  let answer = "";
  while (answer === "") {
    answer = (await rl.question(question)).trim();
    if (answer === "") console.log("  This field can't be blank.");
  }
  return answer;
}

async function askDeck(promptLabel = "Deck (vocab/math): ") {
  let deck = "";
  while (deck !== "vocab" && deck !== "math") {
    deck = (await rl.question(promptLabel)).trim().toLowerCase();
    if (deck !== "vocab" && deck !== "math") console.log('  Please type "vocab" or "math".');
  }
  return deck;
}

async function pickOne(found, actionWord) {
  if (found.length === 0) return null;
  const raw = await rl.question(`Which number do you want to ${actionWord}? (blank to cancel): `);
  if (raw.trim() === "") return null;
  const idx = parseInt(raw, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= found.length) {
    console.log("  Not a valid number, cancelled.");
    return null;
  }
  return found[idx];
}

async function listOrSearch(cards) {
  const query = await rl.question("Search text (blank = list everything): ");
  console.log("");
  printResults(cards, query);
}

async function addCard(cards) {
  console.log("\n--- Add a new card ---");
  const deck = await askDeck();
  const tags = existingTags(cards, deck);
  if (tags.length > 0) console.log("Existing tags for this deck: " + tags.join(", "));
  const tag = await askRequired("Tag/category: ");
  const front = await askRequired(deck === "vocab" ? "Word: " : "Concept / rule name: ");
  let pos = "";
  if (deck === "vocab") pos = await ask("Part of speech (n, v, adj, adv...), optional: ");
  const back = await askRequired(deck === "vocab" ? "Definition: " : "Rule / explanation: ");
  const example = await ask("Example sentence, optional: ");

  const card = { id: nextId(cards, deck), deck, tag, front, back };
  if (pos) card.pos = pos;
  if (example) card.example = example;

  cards.push(card);
  saveCards(cards);
  console.log(`\nAdded "${front}" as id ${card.id}. ${cards.length} cards total.\n`);
}

async function editCard(cards) {
  console.log("\n--- Edit a card ---");
  const query = await rl.question("Search for the card to edit (blank = list everything): ");
  console.log("");
  const found = printResults(cards, query);
  const card = await pickOne(found, "edit");
  if (!card) return;

  console.log(`\nEditing "${card.front}" (id: ${card.id}). Press enter to keep the current value.\n`);
  card.tag = await ask(`Tag [${card.tag}]: `, card.tag);
  card.front = await ask(`Front [${card.front}]: `, card.front);
  if (card.deck === "vocab") {
    card.pos = await ask(`Part of speech [${card.pos || ""}]: `, card.pos || "");
    if (!card.pos) delete card.pos;
  }
  card.back = await ask(`Back [${truncate(card.back, 60)}]: `, card.back);
  const example = await ask(`Example [${truncate(card.example || "", 60)}]: `, card.example || "");
  if (example) card.example = example;
  else delete card.example;

  saveCards(cards);
  console.log(`\nSaved changes to "${card.front}".\n`);
}

async function deleteCard(cards) {
  console.log("\n--- Delete a card ---");
  const query = await rl.question("Search for the card to delete (blank = list everything): ");
  console.log("");
  const found = printResults(cards, query);
  const card = await pickOne(found, "delete");
  if (!card) return;

  const confirm = await rl.question(`Delete "${card.front}" (id: ${card.id})? Type "yes" to confirm: `);
  if (confirm.trim().toLowerCase() !== "yes") {
    console.log("  Cancelled, nothing deleted.\n");
    return;
  }
  const idx = cards.findIndex((c) => c.id === card.id);
  cards.splice(idx, 1);
  saveCards(cards);
  console.log(`\nDeleted "${card.front}". ${cards.length} cards remaining.\n`);
}

async function main() {
  let cards = loadCards();
  console.log(`\nGRE_study flashcard manager — ${cards.length} cards loaded\n`);

  while (true) {
    console.log(
      "  1) List / search cards\n" +
        "  2) Add a card\n" +
        "  3) Edit a card\n" +
        "  4) Delete a card\n" +
        "  5) Quit"
    );
    const choice = (await rl.question("> ")).trim();
    console.log("");

    if (choice === "1") await listOrSearch(cards);
    else if (choice === "2") await addCard(cards);
    else if (choice === "3") await editCard(cards);
    else if (choice === "4") await deleteCard(cards);
    else if (choice === "5" || choice.toLowerCase() === "q") break;
    else console.log('  Type a number from 1-5.\n');

    // reload from disk so counts/results reflect the latest saved state
    cards = loadCards();
  }

  console.log("\nDone. Don't forget to git add / commit / push to publish the changes.\n");
  rl.close();
}

main().catch((e) => {
  console.error("Something went wrong:", e.message);
  rl.close();
  process.exit(1);
});
