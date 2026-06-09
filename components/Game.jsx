"use client";

import { useState, useEffect, useRef } from "react";
import { QUESTIONS, LETTERS, DIFFICULTY, DIFF_ORDER } from "../lib/questions";
import { HOUSES, HOUSE_COLORS } from "../lib/houses";
import { loadScores, saveScore, clearScores, nextTs } from "../lib/leaderboard";
import { createSound } from "../lib/sound";
import Crest from "./Crest";
import MaraudersMap from "./MaraudersMap";

const TOTAL = QUESTIONS.length;

function Leaderboard({ entries, highlight, onClear, hideIfEmpty }) {
  const top = entries.slice(0, 5);
  if (hideIfEmpty && top.length === 0) return null;
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="leaderboard">
      <div className="lb-title">🏆 Hall of Fame</div>
      <div className="lb-sub">Top five wizards by points earned</div>
      {top.length === 0 ? (
        <div className="lb-empty">No champions yet — be the first to make the board!</div>
      ) : (
        <ul className="lb-list">
          {top.map((e, i) => (
            <li key={e.ts} className={"lb-row" + (highlight && e.ts === highlight ? " me" : "")}>
              <span className="lb-rank">{medals[i] || i + 1}</span>
              <span className="lb-name">
                <Crest house={e.house} />{e.name}
                <span className="lb-meta"> · {e.difficulty || ""}</span>
              </span>
              <span className="lb-score">{e.score}/{e.total}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="lb-clear" type="button" onClick={onClear}>Clear the Hall of Fame</button>
    </div>
  );
}

export default function Game() {
  const [screen, setScreen] = useState("start");
  const [name, setName] = useState("");
  const [house, setHouse] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [err, setErr] = useState("");

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [leaderboard, setLeaderboard] = useState([]);
  const [highlightTs, setHighlightTs] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [result, setResult] = useState(null);

  const soundRef = useRef(null);
  const timerIvl = useRef(null);
  const cardRef = useRef(null);
  const barRef = useRef(null);
  const answeredRef = useRef(false);
  answeredRef.current = answered;

  // Init sound + load leaderboard on mount (client only).
  useEffect(() => {
    soundRef.current = createSound();
    setSoundOn(soundRef.current.isOn());
    setLeaderboard(loadScores());
  }, []);

  // House-colored glow + theme variables.
  useEffect(() => {
    const inGame = screen === "quiz" || screen === "result";
    document.body.classList.toggle("quiz-active", inGame);
    return () => document.body.classList.remove("quiz-active");
  }, [screen]);

  useEffect(() => {
    if (!house) return;
    const c = HOUSE_COLORS[house];
    const s = document.documentElement.style;
    s.setProperty("--house-primary", c.primary);
    s.setProperty("--house-secondary", c.secondary);
    s.setProperty("--house-accent", c.accent);
  }, [house]);

  // Per-question countdown timer (restarts each question).
  useEffect(() => {
    if (screen !== "quiz") return;
    const seconds = DIFFICULTY[difficulty].time;
    setTimeLeft(seconds);

    const bar = barRef.current;
    if (bar) {
      bar.style.transition = "none";
      bar.style.width = "100%";
      void bar.offsetWidth;
      bar.style.transition = `width ${seconds}s linear`;
      bar.style.width = "0%";
    }

    let tl = seconds;
    const id = setInterval(() => {
      tl -= 1;
      setTimeLeft(tl);
      if (tl <= 5 && tl > 0 && soundRef.current) soundRef.current.tick();
      if (tl <= 0) {
        clearInterval(id);
        if (answeredRef.current) return;
        const item = QUESTIONS[current];
        setAnswered(true);
        setSelectedIdx(null);
        setFeedback({
          good: false,
          text: `⏳ Time's up! The answer was ${LETTERS[item.answer]}: ${item.options[item.answer]}`,
          note: item.note
        });
        if (soundRef.current) soundRef.current.wrong();
        flashCard("bad");
      }
    }, 1000);
    timerIvl.current = id;
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, current, difficulty]);

  // ----- Visual flourishes (imperative, replayable) -----
  function flashCard(kind) {
    const card = cardRef.current;
    if (!card) return;
    const o = document.createElement("div");
    o.className = "flash-overlay " + (kind === "good" ? "good" : "bad");
    card.appendChild(o);
    setTimeout(() => o.remove(), 800);
  }

  function celebrate() {
    const card = cardRef.current;
    if (!card) return;
    const layer = document.createElement("div");
    layer.className = "sparkle-layer";
    const glyphs = ["✨", "⭐", "🌟", "✦", "★"];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = glyphs[i % glyphs.length];
      const angle = (Math.PI * 2 * i) / count + (i % 3) * 0.3;
      const dist = 90 + (i % 5) * 28;
      s.style.setProperty("--sx", (35 + (i * 37) % 50) + "%");
      s.style.setProperty("--sy", (30 + (i * 53) % 40) + "%");
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      s.style.setProperty("--rot", (i % 2 ? 220 : -220) + "deg");
      s.style.setProperty("--sz", (14 + (i % 4) * 6) + "px");
      s.style.setProperty("--sd", (800 + (i % 5) * 120) + "ms");
      layer.appendChild(s);
    }
    card.appendChild(layer);
    setTimeout(() => layer.remove(), 1500);
  }

  // ----- Flow -----
  function begin() {
    if (!name.trim()) { setErr("Please enter your wizard name."); return; }
    if (!house) { setErr("Please choose your house."); return; }
    setErr("");
    if (soundRef.current) soundRef.current.warmUp();
    setScore(0);
    setCurrent(0);
    setAnswered(false);
    setSelectedIdx(null);
    setFeedback(null);
    setResult(null);
    setScreen("quiz");
  }

  function selectOption(i) {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(i);
    clearInterval(timerIvl.current);
    const bar = barRef.current;
    if (bar) {
      const w = getComputedStyle(bar).width;
      bar.style.transition = "none";
      bar.style.width = w;
    }
    const item = QUESTIONS[current];
    if (i === item.answer) {
      setScore((s) => s + 1);
      setFeedback({ good: true, text: `✓ Correct! +10 points to ${house}`, note: item.note });
      if (soundRef.current) soundRef.current.correct();
      flashCard("good");
      celebrate();
    } else {
      setFeedback({
        good: false,
        text: `✗ Not quite. The answer was ${LETTERS[item.answer]}: ${item.options[item.answer]}`,
        note: item.note
      });
      if (soundRef.current) soundRef.current.wrong();
      flashCard("bad");
    }
  }

  function next() {
    if (current === TOTAL - 1) { finish(); return; }
    setCurrent((c) => c + 1);
    setAnswered(false);
    setSelectedIdx(null);
    setFeedback(null);
  }

  function finish() {
    clearInterval(timerIvl.current);
    const pct = score / TOTAL;
    let rank, msg, crest;
    if (pct === 1) { rank = "Order of Merlin, First Class"; crest = "🏆"; msg = "Flawless! Dumbledore himself would be impressed."; }
    else if (pct >= 0.8) { rank = "Top of the Class"; crest = "🌟"; msg = "Outstanding wizarding knowledge — Hermione would approve."; }
    else if (pct >= 0.6) { rank = "Prefect Material"; crest = "🎓"; msg = "A solid effort. The library awaits for the rest."; }
    else if (pct >= 0.4) { rank = "Apprentice Wizard"; crest = "📜"; msg = "Not bad, but more study at Hogwarts is in order."; }
    else { rank = "First-Year Muggle-born"; crest = "🪄"; msg = "Everyone starts somewhere. Back to Diagon Alley!"; }

    setResult({ rank, msg, crest, title: pct >= 0.6 ? "Well done!" : "Keep practising!" });

    const ts = nextTs();
    const updated = saveScore({
      name: name.trim(), house, score, total: TOTAL,
      difficulty: DIFFICULTY[difficulty].label, ts
    });
    setLeaderboard(updated);
    setHighlightTs(ts);
    if (pct >= 0.8 && soundRef.current) soundRef.current.fanfare();
    setScreen("result");
  }

  function restart() {
    clearInterval(timerIvl.current);
    setScreen("start");
    setName("");
    setHouse(null);
    setErr("");
    setLeaderboard(loadScores());
  }

  function toggleSound() {
    const on = soundRef.current ? soundRef.current.toggle() : true;
    setSoundOn(on);
  }

  function handleClear() {
    if (window.confirm("Banish all records from the Hall of Fame?")) {
      clearScores();
      setLeaderboard([]);
    }
  }

  const item = QUESTIONS[current];
  const warning = timeLeft <= 5;

  return (
    <>
      <MaraudersMap />

      <button
        className={"sound-toggle" + (soundOn ? "" : " muted")}
        title="Toggle sound"
        aria-label="Toggle sound"
        onClick={toggleSound}
      >
        {soundOn ? "🔊" : "🔈"}
      </button>

      <div className="stage">
        {/* ===== START ===== */}
        {screen === "start" && (
          <section className="card" id="start-screen">
            <div className="crest">⚡️</div>
            <h1>Hogwarts Trivia</h1>
            <p className="subtitle">Prove your wizarding knowledge</p>

            <label className="field-label">Choose Your House</label>
            <div className="houses">
              {HOUSES.map((h) => (
                <div
                  key={h.key}
                  className={`house ${h.cls}${house === h.key ? " selected" : ""}`}
                  tabIndex={0}
                  title={h.title}
                  onClick={() => { setHouse(h.key); setErr(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHouse(h.key); setErr(""); } }}
                >
                  <span className="check" aria-hidden="true">✓</span>
                  <span className="emoji"><Crest house={h.key} /></span>
                  <span className="name">{h.key}</span>
                  <div className="traits">{h.traits}</div>
                </div>
              ))}
            </div>

            <div className="start-row">
              <div className="start-col">
                <label className="field-label" htmlFor="name">Your Wizard Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. Hermione Granger"
                  autoComplete="off"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") begin(); }}
                />
              </div>
              <div className="start-col">
                <label className="field-label">Choose Your Difficulty</label>
                <div className="difficulties">
                  {DIFF_ORDER.map((d) => (
                    <div
                      key={d.key}
                      className={`diff${difficulty === d.key ? " selected" : ""}`}
                      tabIndex={0}
                      onClick={() => setDifficulty(d.key)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDifficulty(d.key); } }}
                    >
                      <span className="d-name">{d.name}</span>
                      <span className="d-sub">{d.sub}</span>
                      <span className="d-time">{d.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="err">{err}</div>
            <button className="btn" onClick={begin}>Begin the Challenge →</button>

            <Leaderboard entries={leaderboard} highlight={highlightTs} onClear={handleClear} hideIfEmpty />
          </section>
        )}

        {/* ===== QUIZ ===== */}
        {screen === "quiz" && (
          <section className="card" id="quiz-screen" ref={cardRef}>
            <div className="hud">
              <div className="who">
                <span className="badge"><Crest house={house} /> {house}</span>
                <span>{name}</span>
              </div>
              <div className="hud-right">
                <span className="diff-pill">{DIFFICULTY[difficulty].label}</span>
                <span className="score-pill">Score: {score}</span>
              </div>
            </div>

            <div className="progress-wrap">
              <div className="progress-bar" style={{ width: `${(current / TOTAL) * 100}%` }} />
            </div>

            <div className="timer-row">
              <span className="hourglass">⏳</span>
              <div className="timer-wrap">
                <div className={"timer-bar" + (warning ? " warning" : "")} ref={barRef} />
              </div>
              <span className={"timer-num" + (warning ? " warning" : "")}>{Math.max(0, timeLeft)}</span>
            </div>

            <div className="q-count">Question {current + 1} of {TOTAL}</div>
            <div className="question q-anim" key={`q${current}`}>{item.q}</div>

            <div className="options q-anim" key={`o${current}`}>
              {item.options.map((opt, i) => {
                let cls = "option";
                if (answered && i === item.answer) cls += " correct";
                else if (answered && selectedIdx === i && i !== item.answer) cls += " wrong";
                return (
                  <button key={i} className={cls} disabled={answered} onClick={() => selectOption(i)}>
                    <span className="letter">{LETTERS[i]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className={"feedback" + (feedback ? " show " + (feedback.good ? "good" : "bad") : "")}>
              {feedback && (<>{feedback.text}<small>{feedback.note}</small></>)}
            </div>

            {answered && (
              <button className="btn" onClick={next}>
                {current === TOTAL - 1 ? "See Results →" : "Next →"}
              </button>
            )}
          </section>
        )}

        {/* ===== RESULTS ===== */}
        {screen === "result" && (
          <section className="card" id="result-screen">
            <div className="crest">{result?.crest}</div>
            <h1>{result?.title}</h1>
            <p className="subtitle">Your final tally from the Great Hall</p>

            <div className="result-score">{score}</div>
            <div className="result-out">out of {TOTAL} — well played, {name} of {house}</div>

            <div className="rank">{result?.rank}</div>
            <p className="rank-msg">{result?.msg}</p>

            <Leaderboard entries={leaderboard} highlight={highlightTs} onClear={handleClear} />

            <button className="btn" onClick={restart}>Play Again ↺</button>
            <p className="footer-note">Mischief managed. 🪄</p>
          </section>
        )}
      </div>
    </>
  );
}
