// Open Trivia Database integration.
// Fetches questions, decodes HTML entities, and shuffles answer positions.

// Decode HTML-encoded strings (e.g. "&amp;", "&#039;", "&quot;") from the API.
function decodeHtml(str) {
  if (typeof document === "undefined") return str;
  const ta = document.createElement("textarea");
  ta.innerHTML = str;
  return ta.value;
}

// Fisher–Yates shuffle (returns a new array).
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Convert one API result into our internal question shape, with answers shuffled.
function buildQuestion(r) {
  const correct = decodeHtml(r.correct_answer);
  const options = shuffle([correct, ...r.incorrect_answers.map(decodeHtml)]);
  return {
    q: decodeHtml(r.question),
    options,
    answer: options.indexOf(correct),
    note: `${decodeHtml(r.category)}${r.difficulty ? " · " + cap(r.difficulty) : ""}`
  };
}

// Fetch questions from the Open Trivia Database.
// opts: { amount, category, difficulty }
export async function fetchQuestions({ amount = 10, category, difficulty } = {}) {
  const params = new URLSearchParams({ amount: String(amount), type: "multiple" });
  if (category) params.set("category", String(category));
  if (difficulty) params.set("difficulty", difficulty);

  const url = `https://opentdb.com/api.php?${params.toString()}`;

  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error("Couldn't reach the trivia archives. Check your connection and try again.");
  }
  if (!res.ok) throw new Error(`The archives responded with an error (${res.status}). Please try again.`);

  const data = await res.json();

  // Open Trivia DB response codes
  switch (data.response_code) {
    case 0:
      break; // success
    case 1:
      throw new Error("Not enough questions for that category and difficulty. Try another combination.");
    case 2:
      throw new Error("That request wasn't valid. Try a different selection.");
    case 5:
      throw new Error("The archives are busy (too many requests). Wait a few seconds and try again.");
    default:
      throw new Error("Couldn't load questions right now. Please try again.");
  }

  if (!Array.isArray(data.results) || data.results.length === 0) {
    throw new Error("No questions came back. Try another category or difficulty.");
  }

  return data.results.map(buildQuestion);
}
