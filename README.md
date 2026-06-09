# 🧙 Harry Potter Trivia — The Wizarding Challenge

A single-file, front-end-only trivia game themed around the world of Harry Potter.
Enter your wizard name, choose your house, pick a difficulty, and test your
wizarding knowledge — all on a living **Marauder's Map** background.

👉 **Play it:** open `index.html` in any modern browser (no build step, no dependencies).

## ✨ Features

- **House selection** — Gryffindor, Slytherin, Ravenclaw, or Hufflepuff, each with its real heraldic crest.
- **5 multiple-choice questions** (A–D) with clear right/wrong feedback and fun facts.
- **Difficulty levels** — Easy (30s), Medium (20s), Hard (12s) per question, with a live countdown.
- **Animations** — golden sparkle celebration on correct answers, shake + flash on wrong ones, smooth question transitions.
- **Sound effects** — generated with the Web Audio API (no audio files): a chime for correct, a buzz for wrong, and a fanfare for a high score. Includes a mute toggle.
- **Leaderboard** — a "Hall of Fame" of the top 5 scores, saved to `localStorage`, persists across refreshes, with a clear option.
- **Living Marauder's Map background** — an animated castle floor-plan with double-walled corridors, moving staircases, a secret passage, and characters leaving fading footprint trails. The whole map parallaxes with your cursor.
- **Fully responsive** — adapts from wide desktop to mobile, with large, comfortable tap targets.
- **Accessibility** — respects `prefers-reduced-motion`.

## 🛠️ Tech

- Plain **HTML + CSS + JavaScript** in one file (`index.html`).
- **SVG** for crests and the animated map; **Web Audio API** for sound; **localStorage** for the leaderboard.
- No frameworks, no build tooling, no server required.

## 📁 Structure

```
index.html   # the entire app (markup, styles, and logic)
```

## ⚖️ Notes & credits

This is a **non-commercial fan project** made for learning.
*Harry Potter* and all associated names and marks are the property of their
respective owners; this project is not affiliated with or endorsed by them.

House crest images are the freely-licensed heraldic "Blason" coats of arms
from [Wikimedia Commons](https://commons.wikimedia.org/).

---

*Mischief managed.* 🪄
