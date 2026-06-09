// Trivia questions, answer labels, and difficulty settings.

export const QUESTIONS = [
  {
    q: "What position does Harry Potter play on the Gryffindor Quidditch team?",
    options: ["Keeper", "Beater", "Seeker", "Chaser"],
    answer: 2,
    note: "He catches the Golden Snitch."
  },
  {
    q: "What is the name of Harry's pet owl?",
    options: ["Errol", "Hedwig", "Crookshanks", "Scabbers"],
    answer: 1,
    note: "A snowy owl gifted by Hagrid."
  },
  {
    q: "Which spell is used to disarm an opponent?",
    options: ["Expelliarmus", "Lumos", "Wingardium Leviosa", "Alohomora"],
    answer: 0,
    note: "Harry's signature spell."
  },
  {
    q: "What is the name of the three-headed dog guarding the Philosopher's Stone?",
    options: ["Norbert", "Aragog", "Fluffy", "Fang"],
    answer: 2,
    note: "Owned, of course, by Hagrid."
  },
  {
    q: "Who is the Half-Blood Prince?",
    options: ["Sirius Black", "Tom Riddle", "Severus Snape", "Remus Lupin"],
    answer: 2,
    note: "His mother was Eileen Prince."
  }
];

export const LETTERS = ["A", "B", "C", "D"];

export const DIFFICULTY = {
  easy:   { label: "Easy",   time: 30 },
  medium: { label: "Medium", time: 20 },
  hard:   { label: "Hard",   time: 12 }
};

// Display order + descriptions for the difficulty selector.
export const DIFF_ORDER = [
  { key: "easy",   name: "Easy",   sub: "First Year", time: "⏳ 30s" },
  { key: "medium", name: "Medium", sub: "O.W.L.",     time: "⏳ 20s" },
  { key: "hard",   name: "Hard",   sub: "N.E.W.T.",   time: "⏳ 12s" }
];
