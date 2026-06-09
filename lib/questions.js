// Answer labels, difficulty settings, and Open Trivia DB categories.
// (Questions are now fetched live from the API — see lib/api.js.)

export const LETTERS = ["A", "B", "C", "D"];

// How many questions per game (Open Trivia DB allows up to 50).
export const QUESTION_COUNT = 10;

export const DIFFICULTY = {
  easy:   { label: "Easy",   time: 30 },
  medium: { label: "Medium", time: 20 },
  hard:   { label: "Hard",   time: 12 }
};

// Display order + descriptions for the difficulty selector.
// The keys (easy/medium/hard) are passed straight to the API's `difficulty` param.
export const DIFF_ORDER = [
  { key: "easy",   name: "Easy",   sub: "First Year", time: "⏳ 30s" },
  { key: "medium", name: "Medium", sub: "O.W.L.",     time: "⏳ 20s" },
  { key: "hard",   name: "Hard",   sub: "N.E.W.T.",   time: "⏳ 12s" }
];

// Open Trivia DB category codes (empty string = any category).
export const CATEGORIES = [
  { code: "",   name: "Any Category" },
  { code: 9,    name: "General Knowledge" },
  { code: 17,   name: "Science & Nature" },
  { code: 18,   name: "Computers" },
  { code: 19,   name: "Mathematics" },
  { code: 21,   name: "Sports" },
  { code: 22,   name: "Geography" },
  { code: 23,   name: "History" },
  { code: 25,   name: "Art" },
  { code: 10,   name: "Books" },
  { code: 11,   name: "Film" },
  { code: 12,   name: "Music" },
  { code: 15,   name: "Video Games" },
  { code: 20,   name: "Mythology" },
  { code: 27,   name: "Animals" }
];
