// Leaderboard persistence via localStorage.

const LB_KEY = "hp_leaderboard";

export function loadScores() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LB_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function saveScore(entry) {
  const list = loadScores();
  list.push(entry);
  list.sort((a, b) => b.score - a.score || a.ts - b.ts); // higher score first; earlier wins ties
  const trimmed = list.slice(0, 50);
  if (typeof window !== "undefined") localStorage.setItem(LB_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearScores() {
  if (typeof window !== "undefined") localStorage.removeItem(LB_KEY);
}

// Monotonic id so the just-played run can be highlighted on the board.
export function nextTs() {
  const prev = loadScores().reduce((m, e) => Math.max(m, e.ts || 0), 0);
  return prev + 1;
}
