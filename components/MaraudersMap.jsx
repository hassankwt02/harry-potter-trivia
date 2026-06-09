"use client";

import { useEffect, useRef } from "react";

// An interactive, living Marauder's Map background: a castle floor-plan with
// double-walled corridors, moving staircases, a secret passage, and characters
// that leave fading footprint trails. The whole map parallaxes with the cursor.
export default function MaraudersMap() {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const SVGNS = "http://www.w3.org/2000/svg";
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const R = {
      astro:  { t: "c", x: 150,  y: 158, r: 46, label: "Astronomy Tower", lab: "below" },
      gryff:  { t: "c", x: 1052, y: 152, r: 50, label: "Gryffindor Tower", lab: "below" },
      raven:  { t: "c", x: 1055, y: 648, r: 46, label: "Ravenclaw Tower", lab: "above" },
      owlery: { t: "c", x: 148,  y: 648, r: 38, label: "Owlery", lab: "above" },
      hall:   { t: "r", x: 505, y: 320, w: 190, h: 108, label: "The Great Hall" },
      ent:    { t: "r", x: 522, y: 452, w: 156, h: 54,  label: "Entrance Hall" },
      dung:   { t: "r", x: 500, y: 540, w: 200, h: 78,  label: "The Dungeons" },
      lib:    { t: "r", x: 250, y: 318, w: 150, h: 100, label: "Library" },
      hosp:   { t: "r", x: 800, y: 318, w: 160, h: 96,  label: "Hospital Wing" },
      ror:    { t: "r", x: 812, y: 540, w: 196, h: 82,  label: "Room of Requirement" },
      trophy: { t: "r", x: 250, y: 540, w: 150, h: 72,  label: "Trophy Room" },
      kitchen:{ t: "r", x: 520, y: 648, w: 160, h: 60,  label: "Kitchens" },
      charms: { t: "r", x: 800, y: 452, w: 150, h: 54,  label: "Charms" }
    };
    const C = (id) => {
      const r = R[id];
      return r.t === "c" ? [r.x, r.y] : [r.x + r.w / 2, r.y + r.h / 2];
    };

    const CORRIDORS = [
      ["hall","ent"], ["ent","dung"], ["dung","kitchen"], ["hall","lib"],
      ["lib","trophy"], ["lib","astro"], ["hall","hosp"], ["hosp","charms"],
      ["charms","ror"], ["ror","raven"], ["dung","ror"], ["hall","gryff"],
      ["lib","owlery"], ["trophy","dung"], ["hosp","gryff"], ["ent","charms"]
    ];

    const oab = (...ids) => ids.concat(ids.slice(1, -1).reverse());
    const CHARACTERS = [
      { name: "Harry Potter",       speed: 40, route: oab("gryff","hall","ent","dung") },
      { name: "Hermione Granger",   speed: 44, route: oab("lib","hall","hosp","charms") },
      { name: "Ron Weasley",        speed: 38, route: oab("gryff","hall","lib","astro") },
      { name: "Severus Snape",      speed: 30, route: oab("dung","ent","hall","lib","trophy") },
      { name: "Albus Dumbledore",   speed: 28, route: oab("astro","lib","hall","hosp","charms","ror","raven") },
      { name: "Sirius Black",       speed: 46, route: oab("raven","ror","dung","kitchen") },
      { name: "Peter Pettigrew",    speed: 50, route: oab("owlery","lib","trophy","dung","kitchen") },
      { name: "Minerva McGonagall", speed: 34, route: oab("gryff","hosp","charms","hall") },
      { name: "Argus Filch",        speed: 26, route: oab("trophy","dung","ent","charms") },
      { name: "Neville Longbottom", speed: 36, route: oab("gryff","hall","kitchen") },
      { name: "Luna Lovegood",      speed: 32, route: oab("raven","charms","hall","astro") },
      { name: "Draco Malfoy",       speed: 42, route: oab("dung","ent","hall","hosp") }
    ];

    let g = "";

    g += `<defs><g id="footMark">
            <ellipse cx="0" cy="0" rx="2.5" ry="4.1"/>
            <ellipse cx="0" cy="-4.6" rx="1.5" ry="1.3"/>
          </g></defs>`;

    g += `<rect x="14" y="14" width="1172" height="772" rx="6" class="m-frame"/>`;
    g += `<rect x="26" y="26" width="1148" height="748" rx="4" class="m-frame thin"/>`;
    for (let i = 0; i < 6; i++) {
      const o = 30 + i * 9;
      g += `<line x1="14" y1="${14 + o}" x2="${14 + o}" y2="14" class="m-hatch"/>`;
      g += `<line x1="1186" y1="${786 - o}" x2="${1186 - o}" y2="786" class="m-hatch"/>`;
    }

    g += `<text x="600" y="60" class="m-title">The Marauder's Map</text>`;
    g += `<text x="600" y="82" class="m-makers">Moony · Wormtail · Padfoot · Prongs</text>`;
    g += `<text x="600" y="768" class="m-makers">Every corridor, every passage, every secret — faithfully charted</text>`;

    g += `<g transform="translate(1108,116)" class="m-compass">
            <circle r="26" class="m-line"/><circle r="18" class="m-line" style="opacity:.35"/>
            <path d="M0,-30 L6,0 L0,30 L-6,0 Z" class="m-ink-fill"/>
            <path d="M-30,0 L0,-6 L30,0 L0,6 Z" class="m-ink-soft"/>
            <text x="0" y="-32" class="m-compass-n">N</text>
          </g>`;

    CORRIDORS.forEach(([a, b]) => {
      const p1 = C(a), p2 = C(b);
      const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len * 5, ny = dx / len * 5;
      g += `<line x1="${(p1[0]+nx).toFixed(1)}" y1="${(p1[1]+ny).toFixed(1)}" x2="${(p2[0]+nx).toFixed(1)}" y2="${(p2[1]+ny).toFixed(1)}" class="m-wall"/>`;
      g += `<line x1="${(p1[0]-nx).toFixed(1)}" y1="${(p1[1]-ny).toFixed(1)}" x2="${(p2[0]-nx).toFixed(1)}" y2="${(p2[1]-ny).toFixed(1)}" class="m-wall"/>`;
      g += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" class="m-corridor"/>`;
    });

    Object.values(R).forEach((r) => {
      if (r.t === "r") {
        g += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="3" class="m-room"/>`;
        g += `<rect x="${r.x+4}" y="${r.y+4}" width="${r.w-8}" height="${r.h-8}" rx="2" class="m-room thin"/>`;
        g += `<text x="${r.x + r.w/2}" y="${r.y + r.h/2 + 5}" class="m-label">${r.label}</text>`;
      } else {
        g += `<circle cx="${r.x}" cy="${r.y}" r="${r.r}" class="m-room"/>`;
        g += `<circle cx="${r.x}" cy="${r.y}" r="${r.r-7}" class="m-room thin"/>`;
        for (let k = 0; k < 12; k++) {
          const a = (Math.PI*2*k)/12;
          const x1 = r.x + Math.cos(a)*(r.r-7), y1 = r.y + Math.sin(a)*(r.r-7);
          const x2 = r.x + Math.cos(a)*r.r,     y2 = r.y + Math.sin(a)*r.r;
          g += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="m-hatch" style="opacity:.4"/>`;
        }
        const ly = r.lab === "above" ? r.y - r.r - 10 : r.y + r.r + 20;
        g += `<text x="${r.x}" y="${ly}" class="m-label">${r.label}</text>`;
      }
    });

    function staircase(cx, cy, steps, dir) {
      let s = `<g class="m-stair" transform="translate(${cx},${cy})" style="animation-duration:${7 + dir*2.5}s">`;
      s += `<rect x="-26" y="-34" width="52" height="68" rx="3" class="m-room thin"/>`;
      for (let i = 0; i < steps; i++) {
        const yy = -30 + i * (60 / steps);
        s += `<line x1="-22" y1="${yy.toFixed(1)}" x2="22" y2="${yy.toFixed(1)}" class="m-wall" style="opacity:.45"/>`;
      }
      s += `<line x1="-22" y1="-32" x2="-22" y2="32" class="m-wall"/>`;
      s += `<line x1="22" y1="-32" x2="22" y2="32" class="m-wall"/>`;
      s += `</g>`;
      return s;
    }
    g += staircase(430, 478, 7, 0);
    g += staircase(762, 478, 7, 1);

    g += `<path class="m-secret" d="M500,580 C420,610 380,540 300,560 C220,580 180,520 120,540"/>`;
    g += `<text x="150" y="520" class="m-label" style="font-size:12px;opacity:.5">Passage to Hogsmeade</text>`;

    g += `<g id="m-feet-layer"></g><g id="m-name-layer"></g>`;

    host.innerHTML =
      `<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="${SVGNS}">${g}</svg>`;

    const svg = host.querySelector("svg");
    const footLayer = svg.querySelector("#m-feet-layer");
    const nameLayer = svg.querySelector("#m-name-layer");

    const STEP = 17;
    const FOOT_LIFE = 3.6;
    const walkers = CHARACTERS.map((ch, idx) => {
      const pts = ch.route.map(C);
      pts.push(pts[0]);
      const seg = [];
      let total = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = pts[i+1][0] - pts[i][0], dy = pts[i+1][1] - pts[i][1];
        const l = Math.hypot(dx, dy);
        seg.push({ x: pts[i][0], y: pts[i][1], dx, dy, l });
        total += l;
      }
      const nameEl = document.createElementNS(SVGNS, "text");
      nameEl.setAttribute("class", "m-name");
      nameEl.textContent = ch.name;
      nameLayer.appendChild(nameEl);
      return {
        seg, total, speed: ch.speed,
        odo: (idx * 53) % total,
        lastFoot: (idx * 53) % total,
        side: idx % 2 ? 1 : -1,
        nameEl
      };
    });

    function pointAt(w, d) {
      let acc = 0;
      for (let i = 0; i < w.seg.length; i++) {
        const s = w.seg[i];
        if (acc + s.l >= d || i === w.seg.length - 1) {
          const t = s.l ? (d - acc) / s.l : 0;
          return {
            x: s.x + s.dx * t,
            y: s.y + s.dy * t,
            ang: Math.atan2(s.dy, s.dx) * 180 / Math.PI + 90
          };
        }
        acc += s.l;
      }
      return { x: w.seg[0].x, y: w.seg[0].y, ang: 0 };
    }

    function dropFoot(x, y, ang, side, animate) {
      const rad = (ang - 90) * Math.PI / 180;
      const px = Math.cos(rad + Math.PI / 2) * 3.2 * side;
      const py = Math.sin(rad + Math.PI / 2) * 3.2 * side;
      const use = document.createElementNS(SVGNS, "use");
      use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#footMark");
      use.setAttribute("href", "#footMark");
      use.setAttribute("transform", `translate(${(x+px).toFixed(1)},${(y+py).toFixed(1)}) rotate(${ang.toFixed(1)})`);
      if (animate) {
        use.setAttribute("class", "foot");
        use.style.setProperty("--life", FOOT_LIFE + "s");
        use.addEventListener("animationend", () => use.remove());
      } else {
        use.setAttribute("class", "foot static");
      }
      footLayer.appendChild(use);
    }

    if (reduce) {
      walkers.forEach((w) => {
        for (let d = 0; d < w.total; d += STEP * 2) {
          const p = pointAt(w, d);
          dropFoot(p.x, p.y, p.ang, (Math.round(d / STEP) % 2 ? 1 : -1), false);
        }
        const p0 = pointAt(w, 0);
        w.nameEl.setAttribute("x", p0.x.toFixed(1));
        w.nameEl.setAttribute("y", (p0.y - 13).toFixed(1));
      });
      return; // no animation/cleanup needed beyond clearing innerHTML on unmount
    }

    let last = performance.now();
    let rafId = 0;
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      walkers.forEach((w) => {
        w.odo += w.speed * dt;
        const lead = pointAt(w, w.odo % w.total);
        w.nameEl.setAttribute("x", lead.x.toFixed(1));
        w.nameEl.setAttribute("y", (lead.y - 13).toFixed(1));
        while (w.odo - w.lastFoot >= STEP) {
          w.lastFoot += STEP;
          const p = pointAt(w, w.lastFoot % w.total);
          dropFoot(p.x, p.y, p.ang, w.side, true);
          w.side *= -1;
        }
      });
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    let parked = false;
    function onMove(e) {
      if (parked) return;
      parked = true;
      requestAnimationFrame(() => {
        const tx = -((e.clientX / window.innerWidth) - 0.5) * 22;
        const ty = -((e.clientY / window.innerHeight) - 0.5) * 22;
        svg.style.transform = `scale(1.06) translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
        parked = false;
      });
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      if (host) host.innerHTML = "";
    };
  }, []);

  return <div className="map-bg" id="map-bg" aria-hidden="true" ref={ref} />;
}
