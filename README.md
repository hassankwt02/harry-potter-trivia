# 🧙 Harry Potter Trivia — The Wizarding Challenge

A Harry Potter–themed trivia game, built with **Next.js (App Router) + React**.
Enter your wizard name, choose your house, pick a difficulty, and test your
wizarding knowledge — all on a living **Marauder's Map** background.

## 🚀 Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

To build for production:

```bash
npm run build
npm start
```

> Requires [Node.js](https://nodejs.org/) 18.18+ (Next.js 14).

## ✨ Features

- **Live questions from the [Open Trivia Database](https://opentdb.com/)** — fresh questions every game (no hardcoded content). HTML entities are decoded and answer positions are shuffled each time.
- **Category & difficulty selection** — pick from 14 categories (General Knowledge, Science, Computers, History, Geography, …) and Easy / Medium / Hard before each game.
- **Loading & error states** — a themed spinner while questions load, and a clear retry screen if the API fails.
- **House selection** — Gryffindor, Slytherin, Ravenclaw, Hufflepuff, each with its real heraldic crest.
- **10 multiple-choice questions** (A–D) with clear right/wrong feedback.
- **Score tracking** — results show your tally as a fraction and a percentage, with a correct/incorrect breakdown.
- **Difficulty levels** — Easy (30s), Medium (20s), Hard (12s) per question, with a live countdown.
- **Animations** — golden sparkle celebration on correct answers, shake + flash on wrong ones, smooth question transitions.
- **Sound effects** — generated with the Web Audio API (no audio files): chime for correct, buzz for wrong, fanfare for a high score, plus a mute toggle.
- **Leaderboard** — a "Hall of Fame" of the top 5 scores, saved to `localStorage`, persists across refreshes, with a clear option.
- **Living Marauder's Map background** — an animated castle floor-plan with double-walled corridors, moving staircases, a secret passage, and characters leaving fading footprint trails. The whole map parallaxes with your cursor.
- **Fully responsive** and respects `prefers-reduced-motion`.

## 📁 Project structure

```
app/
  layout.js        # root layout, fonts, global styles
  page.js          # renders <Game />
  globals.css      # all styling (ported from the original single file)
components/
  Game.jsx         # main client component: screens, state, game flow
  MaraudersMap.jsx # animated SVG map background (footprint trails, parallax)
  Crest.jsx        # house crest <img> with SVG fallback
lib/
  api.js           # Open Trivia DB fetch (HTML decode + answer shuffle)
  questions.js     # answer labels, difficulty + category settings
  houses.js        # house colours + card metadata
  crests.js        # crest image URLs + hand-drawn SVG fallbacks
  sound.js         # Web Audio sound engine
  leaderboard.js   # localStorage leaderboard helpers
legacy/
  index.html       # the original single-file version (pre-refactor)
```

## 🛠️ Tech

- **Next.js 14** (App Router) + **React 18**, plain JavaScript.
- **SVG** for crests and the animated map; **Web Audio API** for sound; **localStorage** for the leaderboard.
- No CSS framework — styling is hand-written in `app/globals.css`.

## ⚖️ Notes & credits

This is a **non-commercial fan project** made for learning.
*Harry Potter* and all associated names and marks are the property of their
respective owners; this project is not affiliated with or endorsed by them.

House crest images are the freely-licensed heraldic "Blason" coats of arms
from [Wikimedia Commons](https://commons.wikimedia.org/).

---

*Mischief managed.* 🪄
