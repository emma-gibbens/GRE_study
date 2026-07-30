import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BookOpen, Calculator, Flame, Settings, X, Check, RotateCcw, Plus, ArrowLeft, Layers, Trash2 } from "lucide-react";
import CARDS_DATA from "./cards.json";


const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 16]; // index = box (1..5)
const DAY_MS = 24 * 60 * 60 * 1000;
const SESSION_CAP = 20;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getCardProg(progress, id) {
  return progress[id] || { box: 1, nextReview: 0, seen: 0, correct: 0 };
}

function isDue(prog) {
  return !prog || prog.nextReview <= Date.now();
}

function nextReviewTime(box) {
  const days = BOX_INTERVAL_DAYS[box] ?? 16;
  return Date.now() + days * DAY_MS;
}

async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem("studyDrawer:" + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    localStorage.setItem("studyDrawer:" + key, JSON.stringify(value));
  } catch (e) {
    // best effort, ignore
  }
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.sd-root {
  --paper: #F2ECDD;
  --card: #FDFBF3;
  --rule-blue: #C3D2E7;
  --rule-red: #B5473F;
  --ink: #23273A;
  --ink-soft: #666C82;
  --navy: #24466B;
  --burgundy: #7D2E38;
  --teal: #276458;
  --mustard: #B8862E;
  --good: #3E7D56;
  --good-soft: #E7F1EA;
  --hard: #A1483A;
  --hard-soft: #F5E7E2;
  --border: #DED2AF;
  --shadow: rgba(35, 39, 58, 0.18);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 16px 48px;
  background-image:
    radial-gradient(ellipse at top left, rgba(184,134,46,0.06), transparent 55%),
    radial-gradient(ellipse at bottom right, rgba(39,100,88,0.05), transparent 55%);
}
.sd-root * { box-sizing: border-box; }
.sd-serif { font-family: 'Fraunces', Georgia, serif; }
.sd-mono { font-family: 'IBM Plex Mono', monospace; }

.sd-wrap { max-width: 720px; margin: 0 auto; }

.sd-topbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 22px;
}
.sd-brand { display: flex; align-items: baseline; gap: 8px; }
.sd-brand-title {
  font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: var(--navy);
}
.sd-brand-sub { font-size: 12px; color: var(--ink-soft); font-style: italic; }
.sd-topbar-right { display: flex; align-items: center; gap: 10px; }
.sd-pill {
  display: flex; align-items: center; gap: 5px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 999px; padding: 5px 11px; font-size: 12.5px;
  font-family: 'IBM Plex Mono', monospace; color: var(--ink);
  box-shadow: 0 1px 2px var(--shadow);
}
.sd-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 999px;
  background: var(--card); border: 1px solid var(--border);
  color: var(--ink-soft); cursor: pointer;
}
.sd-icon-btn:hover { color: var(--ink); }

.sd-heading { font-size: 30px; font-weight: 600; margin: 6px 0 4px; color: var(--ink); }
.sd-subtext { font-size: 14.5px; color: var(--ink-soft); margin-bottom: 22px; }

.sd-decks { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
.sd-deck-card {
  flex: 1 1 220px; background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 18px; cursor: pointer;
  box-shadow: 0 2px 6px var(--shadow); transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative; overflow: hidden;
}
.sd-deck-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px var(--shadow); }
.sd-deck-card.active { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent) inset, 0 6px 14px var(--shadow); }
.sd-deck-card.vocab { --accent: var(--burgundy); }
.sd-deck-card.math { --accent: var(--teal); }
.sd-deck-card.all { --accent: var(--mustard); }
.sd-deck-icon {
  width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: #fff; margin-bottom: 10px;
}
.sd-deck-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 19px; margin-bottom: 2px; }
.sd-deck-meta { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 10px; }
.sd-deck-stats { display: flex; gap: 8px; flex-wrap: wrap; }
.sd-stat-chip {
  font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 3px 8px;
  border-radius: 999px; background: rgba(0,0,0,0.04); color: var(--ink-soft);
}
.sd-stat-chip.due { background: var(--accent); color: #fff; }

.sd-panel {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 18px 18px 20px; margin-bottom: 16px; box-shadow: 0 2px 6px var(--shadow);
}
.sd-panel-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 10px; font-weight: 600; }
.sd-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
.sd-tag-chip {
  font-size: 12.5px; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border);
  background: #fff; color: var(--ink-soft); cursor: pointer; user-select: none;
}
.sd-tag-chip.selected { background: var(--ink); color: #fff; border-color: var(--ink); }

.sd-start-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.sd-btn {
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14.5px;
  padding: 11px 20px; border-radius: 10px; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
}
.sd-btn-primary { background: var(--ink); color: #fff; }
.sd-btn-primary:hover { background: #000; }
.sd-btn-secondary { background: transparent; color: var(--ink-soft); border: 1px solid var(--border); }
.sd-btn-secondary:hover { color: var(--ink); }
.sd-btn-good { background: var(--good); color: #fff; }
.sd-btn-hard { background: #fff; color: var(--hard); border: 1.5px solid var(--hard); }
.sd-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.sd-btn-sm { padding: 7px 13px; font-size: 13px; }

.sd-link-btn { background: none; border: none; color: var(--ink-soft); font-size: 13.5px; cursor: pointer; text-decoration: underline; padding: 0; }
.sd-link-btn:hover { color: var(--ink); }

.sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.sd-field { display: flex; flex-direction: column; gap: 4px; }
.sd-field label { font-size: 12px; color: var(--ink-soft); font-weight: 600; }
.sd-field input, .sd-field select, .sd-field textarea {
  font-family: 'Inter', sans-serif; font-size: 14px; padding: 8px 10px;
  border: 1px solid var(--border); border-radius: 8px; background: #fff; color: var(--ink);
}
.sd-field textarea { resize: vertical; min-height: 44px; }
.sd-field.full { grid-column: 1 / -1; }

.sd-custom-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
.sd-custom-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; padding: 7px 10px; background: #fff; border: 1px solid var(--border); border-radius: 8px;
}
.sd-custom-row-text { color: var(--ink); }
.sd-custom-row-text b { font-family: 'Fraunces', serif; }
.sd-del-btn { background: none; border: none; color: var(--ink-soft); cursor: pointer; display: flex; }
.sd-del-btn:hover { color: var(--hard); }

/* Study screen */
.sd-study-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.sd-progress-track { flex: 1; height: 6px; background: rgba(0,0,0,0.08); border-radius: 999px; margin: 0 14px; overflow: hidden; }
.sd-progress-fill { height: 100%; background: var(--ink); border-radius: 999px; transition: width 0.25s ease; }
.sd-counter { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--ink-soft); white-space: nowrap; }

.sd-card-stage { display: flex; flex-direction: column; align-items: center; margin: 10px 0 18px; }
.sd-flip-outer {
  width: 100%; max-width: 420px; height: 300px;
  perspective: 1400px;
  -webkit-perspective: 1400px;
  cursor: pointer;
}
.sd-flip-inner {
  position: relative; width: 100%; height: 100%;
  transition: transform 0.5s cubic-bezier(.4,.2,.2,1);
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}
.sd-flip-inner.flipped {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}
.sd-face {
  position: absolute; inset: 0; border-radius: 14px;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
  background: var(--card); border: 1px solid var(--border);
  box-shadow: 0 8px 24px var(--shadow);
  padding: 26px 24px;
  display: flex; flex-direction: column;
  background-image: repeating-linear-gradient(
    to bottom, transparent, transparent 27px, var(--rule-blue) 27px, var(--rule-blue) 28px
  );
  background-position: 0 64px;
}
.sd-face::before {
  content: ""; position: absolute; left: 40px; top: 0; bottom: 0; width: 1.5px; background: var(--rule-red);
  opacity: 0.55;
}
.sd-face-back {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}
.sd-tab {
  align-self: flex-start; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.03em;
  text-transform: uppercase; color: #fff; padding: 3px 9px; border-radius: 5px; margin-bottom: 14px;
  position: relative; z-index: 1;
}
.sd-card-front-word {
  font-family: 'Fraunces', serif; font-weight: 700; font-size: 32px; line-height: 1.15;
  color: var(--ink); position: relative; z-index: 1; margin-left: 8px;
}
.sd-card-front-pos {
  font-family: 'Fraunces', serif; font-style: italic; font-size: 14px; color: var(--ink-soft);
  margin-top: 6px; margin-left: 8px; position: relative; z-index: 1;
}
.sd-card-hint {
  margin-top: auto; font-size: 11.5px; color: var(--ink-soft); text-align: center; position: relative; z-index: 1;
  font-family: 'IBM Plex Mono', monospace;
}
.sd-card-back-def {
  font-family: 'Fraunces', serif; font-size: 17.5px; line-height: 1.45; color: var(--ink);
  margin-left: 8px; position: relative; z-index: 1;
}
.sd-card-back-example {
  font-size: 13.5px; font-style: italic; color: var(--ink-soft); margin-top: 12px; margin-left: 8px;
  position: relative; z-index: 1;
}
.sd-card-back-example b { font-style: normal; color: var(--mustard); font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
.sd-box-indicator {
  position: absolute; top: 16px; right: 18px; display: flex; gap: 4px; z-index: 1;
}
.sd-box-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(35,39,58,0.15); }
.sd-box-dot.filled { background: var(--mustard); }
.sd-box-label { position: absolute; top: 28px; right: 18px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--ink-soft); z-index: 1; }

.sd-rate-row { display: flex; gap: 12px; margin-top: 18px; width: 100%; max-width: 420px; }
.sd-rate-row .sd-btn { flex: 1; justify-content: center; padding: 13px; font-size: 15px; }
.sd-key-hint { text-align: center; font-size: 12px; color: var(--ink-soft); margin-top: 14px; font-family: 'IBM Plex Mono', monospace; }

.sd-summary { text-align: center; padding: 30px 10px; }
.sd-summary-stats { display: flex; justify-content: center; gap: 22px; margin: 26px 0; flex-wrap: wrap; }
.sd-summary-stat { display: flex; flex-direction: column; align-items: center; }
.sd-summary-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 700; }
.sd-summary-label { font-size: 12px; color: var(--ink-soft); margin-top: 2px; }

.sd-modal-overlay {
  position: fixed; inset: 0; background: rgba(20,20,20,0.35); display: flex; align-items: center; justify-content: center;
  z-index: 50; padding: 20px;
}
.sd-modal {
  background: var(--card); border-radius: 14px; padding: 22px; max-width: 320px; width: 100%;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
}
.sd-modal h3 { font-family: 'Fraunces', serif; margin: 0 0 8px; font-size: 18px; }
.sd-modal p { font-size: 13.5px; color: var(--ink-soft); margin: 0 0 16px; }
.sd-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

.sd-empty { text-align: center; padding: 40px 10px; color: var(--ink-soft); }
.sd-empty .sd-serif { font-size: 20px; color: var(--ink); display: block; margin-bottom: 6px; }

@media (max-width: 480px) {
  .sd-form-grid { grid-template-columns: 1fr; }
  .sd-heading { font-size: 25px; }
  .sd-flip-outer { height: 320px; }
  .sd-card-front-word { font-size: 26px; }
}
`;

const TAG_COLORS = {
  "Top & Common Words": "var(--burgundy)",
  "Tricky & Confusable Meanings": "var(--teal)",
  "Word Origins": "var(--mustard)",
  "Money & Finance": "var(--navy)",
  "Themed Vocab": "var(--burgundy)",
  "By the Letter": "var(--teal)",
  "High Difficulty": "var(--hard)",
  "Percentages & Ratios": "var(--navy)",
  "Exponents & Roots": "var(--teal)",
  "Algebra Shortcuts": "var(--burgundy)",
  "Number Properties": "var(--mustard)",
  "Geometry: Triangles & Angles": "var(--navy)",
  "Geometry: Circles, Area & Volume": "var(--teal)",
  "Statistics & Probability": "var(--burgundy)",
  "Word Problem Strategies": "var(--mustard)",
  "Custom": "var(--ink)",
};

function tagColor(tag) {
  return TAG_COLORS[tag] || "var(--ink)";
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({ streak: 0, lastStudyDate: null, totalReviewed: 0 });
  const [customCards, setCustomCards] = useState([]);

  const [screen, setScreen] = useState("home");
  const [selectedDeck, setSelectedDeck] = useState(null); // 'vocab' | 'math' | 'all'
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ good: 0, hard: 0 });
  const [hintVisible, setHintVisible] = useState(true);

  const [form, setForm] = useState({ deck: "vocab", tag: "Custom", front: "", back: "", example: "" });

  useEffect(() => {
    (async () => {
      const [p, s, c] = await Promise.all([
        loadKey("progress", {}),
        loadKey("stats", { streak: 0, lastStudyDate: null, totalReviewed: 0 }),
        loadKey("customCards", []),
      ]);
      setProgress(p);
      setStats(s);
      setCustomCards(c);
      setLoading(false);
    })();
  }, []);

  const allCards = useMemo(() => [...CARDS_DATA, ...customCards], [customCards]);

  const deckCards = useCallback(
    (deck) => {
      if (deck === "all") return allCards;
      return allCards.filter((c) => c.deck === deck);
    },
    [allCards]
  );

  const deckDueCount = useCallback(
    (deck) => {
      const cards = deckCards(deck);
      return cards.filter((c) => isDue(getCardProg(progress, c.id))).length;
    },
    [deckCards, progress]
  );

  const deckMasteredCount = useCallback(
    (deck) => {
      const cards = deckCards(deck);
      return cards.filter((c) => getCardProg(progress, c.id).box >= 5).length;
    },
    [deckCards, progress]
  );

  const availableTags = useMemo(() => {
    if (!selectedDeck) return [];
    const cards = deckCards(selectedDeck);
    return Array.from(new Set(cards.map((c) => c.tag)));
  }, [selectedDeck, deckCards]);

  const filteredCards = useMemo(() => {
    if (!selectedDeck) return [];
    let cards = deckCards(selectedDeck);
    if (selectedTags.size > 0) {
      cards = cards.filter((c) => selectedTags.has(c.tag));
    }
    return cards;
  }, [selectedDeck, deckCards, selectedTags]);

  const filteredDueCount = useMemo(
    () => filteredCards.filter((c) => isDue(getCardProg(progress, c.id))).length,
    [filteredCards, progress]
  );

  function toggleTag(tag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function selectDeck(deck) {
    setSelectedDeck(deck === selectedDeck ? null : deck);
    setSelectedTags(new Set());
  }

  function startSession() {
    const due = filteredCards.filter((c) => isDue(getCardProg(progress, c.id)));
    const pool = due.length > 0 ? due : filteredCards;
    const picked = shuffle(pool).slice(0, SESSION_CAP);
    setQueue(picked);
    setIdx(0);
    setFlipped(false);
    setHintVisible(true);
    setSessionStats({ good: 0, hard: 0 });
    setScreen("study");
  }

  function rate(correct) {
    const card = queue[idx];
    if (!card) return;
    setProgress((prev) => {
      const cur = getCardProg(prev, card.id);
      const newBox = correct ? Math.min(cur.box + 1, 5) : 1;
      const updated = {
        ...prev,
        [card.id]: {
          box: newBox,
          nextReview: nextReviewTime(newBox),
          seen: cur.seen + 1,
          correct: cur.correct + (correct ? 1 : 0),
        },
      };
      saveKey("progress", updated);
      return updated;
    });
    setSessionStats((s) => ({ good: s.good + (correct ? 1 : 0), hard: s.hard + (correct ? 0 : 1) }));

    if (idx + 1 >= queue.length) {
      finishSession();
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
      setHintVisible(false);
    }
  }

  function finishSession() {
    const reviewedCount = sessionStats.good + sessionStats.hard;
    if (reviewedCount > 0) {
      setStats((prev) => {
        const today = todayStr();
        let streak = prev.streak || 0;
        if (prev.lastStudyDate === today) {
          // already studied today, keep streak
        } else {
          const yesterday = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
          streak = prev.lastStudyDate === yesterday ? streak + 1 : 1;
        }
        const updated = { streak, lastStudyDate: today, totalReviewed: (prev.totalReviewed || 0) + reviewedCount };
        saveKey("stats", updated);
        return updated;
      });
    }
    setScreen("summary");
  }

  function backToHome() {
    setScreen("home");
    setSelectedDeck(null);
    setSelectedTags(new Set());
  }

  function handleAddCard() {
    if (!form.front.trim() || !form.back.trim()) return;
    const newCard = {
      id: "c" + Date.now(),
      deck: form.deck,
      tag: form.tag.trim() || "Custom",
      front: form.front.trim(),
      pos: "",
      back: form.back.trim(),
      example: form.example.trim(),
    };
    setCustomCards((prev) => {
      const updated = [...prev, newCard];
      saveKey("customCards", updated);
      return updated;
    });
    setForm({ deck: form.deck, tag: form.tag, front: "", back: "", example: "" });
    setShowAddForm(false);
  }

  function deleteCustomCard(id) {
    setCustomCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveKey("customCards", updated);
      return updated;
    });
    setProgress((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _, ...rest } = prev;
      saveKey("progress", rest);
      return rest;
    });
  }

  function doReset() {
    setProgress({});
    setStats({ streak: 0, lastStudyDate: null, totalReviewed: 0 });
    saveKey("progress", {});
    saveKey("stats", { streak: 0, lastStudyDate: null, totalReviewed: 0 });
    setShowReset(false);
  }

  // keyboard shortcuts on study screen
  useEffect(() => {
    if (screen !== "study") return;
    function onKey(e) {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "ArrowLeft" || e.key === "1")) {
        rate(false);
      } else if (flipped && (e.key === "ArrowRight" || e.key === "2")) {
        rate(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, flipped, idx, queue]);

  const totalMastered = useMemo(
    () => allCards.filter((c) => getCardProg(progress, c.id).box >= 5).length,
    [allCards, progress]
  );

  if (loading) {
    return (
      <div className="sd-root">
        <style>{STYLES}</style>
        <div className="sd-wrap sd-empty">
          <span className="sd-serif">Opening the drawer…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-root">
      <style>{STYLES}</style>
      <div className="sd-wrap">
        <div className="sd-topbar">
          <div className="sd-brand">
            <span className="sd-serif sd-brand-title">Study Drawer</span>
            <span className="sd-brand-sub">GRE flashcards</span>
          </div>
          <div className="sd-topbar-right">
            <div className="sd-pill">
              <Flame size={14} color="var(--mustard)" />
              {stats.streak || 0} day{stats.streak === 1 ? "" : "s"}
            </div>
            <div className="sd-pill">{totalMastered} mastered</div>
            <div className="sd-icon-btn" onClick={() => setShowReset(true)} title="Settings">
              <Settings size={16} />
            </div>
          </div>
        </div>

        {screen === "home" && (
          <>
            <div className="sd-heading sd-serif">What are we studying?</div>
            <div className="sd-subtext">Pick a deck, narrow it down if you want, then start a round.</div>

            <div className="sd-decks">
              <div
                className={"sd-deck-card vocab" + (selectedDeck === "vocab" ? " active" : "")}
                onClick={() => selectDeck("vocab")}
              >
                <div className="sd-deck-icon"><BookOpen size={18} /></div>
                <div className="sd-deck-name sd-serif">Vocabulary</div>
                <div className="sd-deck-meta">{deckCards("vocab").length} words</div>
                <div className="sd-deck-stats">
                  <span className="sd-stat-chip due">{deckDueCount("vocab")} due</span>
                  <span className="sd-stat-chip">{deckMasteredCount("vocab")} mastered</span>
                </div>
              </div>
              <div
                className={"sd-deck-card math" + (selectedDeck === "math" ? " active" : "")}
                onClick={() => selectDeck("math")}
              >
                <div className="sd-deck-icon"><Calculator size={18} /></div>
                <div className="sd-deck-name sd-serif">Math rules & tricks</div>
                <div className="sd-deck-meta">{deckCards("math").length} cards</div>
                <div className="sd-deck-stats">
                  <span className="sd-stat-chip due">{deckDueCount("math")} due</span>
                  <span className="sd-stat-chip">{deckMasteredCount("math")} mastered</span>
                </div>
              </div>
              <div
                className={"sd-deck-card all" + (selectedDeck === "all" ? " active" : "")}
                onClick={() => selectDeck("all")}
              >
                <div className="sd-deck-icon"><Layers size={18} /></div>
                <div className="sd-deck-name sd-serif">Everything</div>
                <div className="sd-deck-meta">{deckCards("all").length} cards total</div>
                <div className="sd-deck-stats">
                  <span className="sd-stat-chip due">{deckDueCount("all")} due</span>
                  <span className="sd-stat-chip">{deckMasteredCount("all")} mastered</span>
                </div>
              </div>
            </div>

            {selectedDeck && (
              <div className="sd-panel">
                <div className="sd-panel-title">Narrow it down (optional)</div>
                <div className="sd-tags">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className={"sd-tag-chip" + (selectedTags.has(tag) ? " selected" : "")}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="sd-start-row">
                  <button className="sd-btn sd-btn-primary" onClick={startSession} disabled={filteredCards.length === 0}>
                    {filteredDueCount > 0
                      ? `Start studying (${Math.min(filteredDueCount, SESSION_CAP)} due)`
                      : `Free practice (${Math.min(filteredCards.length, SESSION_CAP)} cards)`}
                  </button>
                  {filteredCards.length === 0 && (
                    <span className="sd-subtext" style={{ marginBottom: 0 }}>No cards match that filter yet.</span>
                  )}
                </div>
              </div>
            )}

            <div className="sd-panel">
              <div className="sd-panel-title">Your own cards</div>
              {!showAddForm ? (
                <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={() => setShowAddForm(true)}>
                  <Plus size={14} /> Add a card
                </button>
              ) : (
                <div>
                  <div className="sd-form-grid">
                    <div className="sd-field">
                      <label>Deck</label>
                      <select value={form.deck} onChange={(e) => setForm({ ...form, deck: e.target.value })}>
                        <option value="vocab">Vocabulary</option>
                        <option value="math">Math</option>
                      </select>
                    </div>
                    <div className="sd-field">
                      <label>Tag / category</label>
                      <input
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        placeholder="Custom"
                      />
                    </div>
                    <div className="sd-field full">
                      <label>Front (word or concept)</label>
                      <input value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} />
                    </div>
                    <div className="sd-field full">
                      <label>Back (definition or rule)</label>
                      <textarea value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} />
                    </div>
                    <div className="sd-field full">
                      <label>Example (optional)</label>
                      <input value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="sd-btn sd-btn-primary sd-btn-sm" onClick={handleAddCard}>Save card</button>
                    <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {customCards.length > 0 && (
                <div className="sd-custom-list">
                  {customCards.map((c) => (
                    <div className="sd-custom-row" key={c.id}>
                      <span className="sd-custom-row-text"><b>{c.front}</b> — {c.tag}</span>
                      <button className="sd-del-btn" onClick={() => deleteCustomCard(c.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {screen === "study" && queue.length > 0 && (
          <>
            <div className="sd-study-top">
              <div className="sd-icon-btn" onClick={finishSession} title="End session">
                <ArrowLeft size={16} />
              </div>
              <div className="sd-progress-track">
                <div className="sd-progress-fill" style={{ width: `${(idx / queue.length) * 100}%` }} />
              </div>
              <div className="sd-counter">{idx + 1} / {queue.length}</div>
            </div>

            <div className="sd-card-stage">
              <div className="sd-flip-outer" onClick={() => setFlipped((f) => !f)}>
                <div className={"sd-flip-inner" + (flipped ? " flipped" : "")}>
                  <div className="sd-face">
                    <span className="sd-tab" style={{ background: tagColor(queue[idx].tag) }}>{queue[idx].tag}</span>
                    <div className="sd-card-front-word">{queue[idx].front}</div>
                    {queue[idx].pos && <div className="sd-card-front-pos">{queue[idx].pos}.</div>}
                    {hintVisible && <div className="sd-card-hint">tap to flip</div>}
                  </div>
                  <div className="sd-face sd-face-back">
                    <BoxIndicator box={getCardProg(progress, queue[idx].id).box} />
                    <div className="sd-card-back-def">{queue[idx].back}</div>
                    {queue[idx].example && (
                      <div className="sd-card-back-example"><b>e.g.</b> &nbsp;{queue[idx].example}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sd-rate-row">
                <button className="sd-btn sd-btn-hard" onClick={() => rate(false)} disabled={!flipped}>
                  <RotateCcw size={15} /> Still learning
                </button>
                <button className="sd-btn sd-btn-good" onClick={() => rate(true)} disabled={!flipped}>
                  <Check size={15} /> Got it
                </button>
              </div>
              <div className="sd-key-hint">space to flip · ← still learning · → got it</div>
            </div>
          </>
        )}

        {screen === "summary" && (
          <div className="sd-summary">
            <div className="sd-serif" style={{ fontSize: 24, fontWeight: 600 }}>
              {sessionStats.good + sessionStats.hard === 0
                ? "No cards reviewed."
                : sessionStats.hard === 0
                ? "Clean sweep."
                : "Nice work."}
            </div>
            <div className="sd-summary-stats">
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--ink)" }}>{sessionStats.good + sessionStats.hard}</div>
                <div className="sd-summary-label">reviewed</div>
              </div>
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--good)" }}>{sessionStats.good}</div>
                <div className="sd-summary-label">got it</div>
              </div>
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--hard)" }}>{sessionStats.hard}</div>
                <div className="sd-summary-label">still learning</div>
              </div>
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--mustard)" }}>{stats.streak || 0}</div>
                <div className="sd-summary-label">day streak</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="sd-btn sd-btn-secondary" onClick={backToHome}>Back to Study Drawer</button>
              {filteredCards.length > 0 && (
                <button className="sd-btn sd-btn-primary" onClick={startSession}>Study another round</button>
              )}
            </div>
          </div>
        )}

        {showReset && (
          <div className="sd-modal-overlay" onClick={() => setShowReset(false)}>
            <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="sd-serif">Reset progress?</h3>
              <p>This clears every card's box and your streak. Your custom cards stay put.</p>
              <div className="sd-modal-actions">
                <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={() => setShowReset(false)}>Cancel</button>
                <button className="sd-btn sd-btn-hard sd-btn-sm" onClick={doReset}>
                  <X size={14} /> Reset everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BoxIndicator({ box }) {
  return (
    <>
      <div className="sd-box-indicator">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={"sd-box-dot" + (n <= box ? " filled" : "")} />
        ))}
      </div>
      <div className="sd-box-label">box {box}/5</div>
    </>
  );
}
