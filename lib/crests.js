// House crests: real freely-licensed heraldry from Wikimedia Commons, with
// hand-drawn SVG shields as an offline fallback.

// Wrap inner artwork in a heraldic shield with the house field colours.
function shield(inner, bg1, bg2, border) {
  const gid = "g_" + bg2.replace("#", "");
  return `<svg viewBox="0 0 100 122" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <path d="M50 3 L94 18 L94 60 C94 90 74 109 50 118 C26 109 6 90 6 60 L6 18 Z"
          fill="url(#${gid})" stroke="${border}" stroke-width="3.5"/>
    <path d="M50 3 L94 18 L94 60 C94 90 74 109 50 118 C26 109 6 90 6 60 L6 18 Z"
          fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" transform="scale(0.9) translate(5.5,6)"/>
    ${inner}
  </svg>`;
}

function lionInner() {
  const cx = 50, cy = 52, spikes = 16, rOut = 30, rIn = 21;
  let pts = "";
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return `
    <polygon points="${pts.trim()}" fill="#f0c75e" stroke="#9c7415" stroke-width="1"/>
    <circle cx="42" cy="48" r="4.5" fill="#f0c75e"/>
    <circle cx="58" cy="48" r="4.5" fill="#f0c75e"/>
    <circle cx="${cx}" cy="${cy}" r="18" fill="#d3a625"/>
    <circle cx="44" cy="49" r="2.6" fill="#3a2a08"/>
    <circle cx="56" cy="49" r="2.6" fill="#3a2a08"/>
    <path d="M50 53 L46 58 L54 58 Z" fill="#3a2a08"/>
    <path d="M50 58 Q50 64 45 64 M50 58 Q50 64 55 64" stroke="#3a2a08" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

function serpentInner() {
  return `
    <path d="M56 26 C38 32 40 46 50 54 C60 62 60 76 42 84"
          fill="none" stroke="#cfcfcf" stroke-width="8.5" stroke-linecap="round"/>
    <path d="M56 26 C38 32 40 46 50 54 C60 62 60 76 42 84"
          fill="none" stroke="#8f8f8f" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"/>
    <circle cx="42" cy="84" r="6.5" fill="#cfcfcf"/>
    <circle cx="40" cy="83" r="1.6" fill="#1a472a"/>
    <path d="M36 86 L29 90 M36 88 L30 93" stroke="#9b2226" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="56" cy="26" r="3" fill="#eeeeee"/>`;
}

function eagleInner() {
  const wing = `<path d="M50 46 C36 32 22 32 11 41 C24 41 33 47 41 55 C31 53 22 57 16 65 C29 61 41 62 50 68 Z"
                 fill="#c08b3e" stroke="#7c5a23" stroke-width="0.8"/>`;
  return `
    ${wing}
    <g transform="translate(100,0) scale(-1,1)">${wing}</g>
    <path d="M45 42 L45 74 L55 74 L55 42 Z" fill="#c08b3e"/>
    <path d="M44 74 L39 92 L50 84 L61 92 L56 74 Z" fill="#c08b3e" stroke="#7c5a23" stroke-width="0.8"/>
    <circle cx="50" cy="36" r="7" fill="#c08b3e"/>
    <path d="M56 34 L66 37 L56 40 Z" fill="#eeba30"/>
    <circle cx="52" cy="35" r="1.8" fill="#0e1a40"/>`;
}

function badgerInner() {
  const stripe = `<path d="M42 30 C34 46 36 66 46 80 L40 82 C29 66 27 44 35 30 Z" fill="#2b2113"/>`;
  return `
    <path d="M50 28 C65 28 73 41 71 56 C69 73 59 84 50 90 C41 84 31 73 29 56 C27 41 35 28 50 28 Z"
          fill="#f7f2e3" stroke="#cbb98a" stroke-width="1"/>
    ${stripe}
    <g transform="translate(100,0) scale(-1,1)">${stripe}</g>
    <ellipse cx="50" cy="60" rx="9" ry="11" fill="#f7f2e3"/>
    <path d="M50 84 L44 76 L56 76 Z" fill="#2b2113"/>
    <circle cx="50" cy="71" r="2.2" fill="#2b2113"/>`;
}

// Drawn SVG fallback crests (markup strings).
export const HOUSE_CRESTS = {
  Gryffindor: shield(lionInner(),    "#9b1113", "#5e0001", "#eeba30"),
  Slytherin:  shield(serpentInner(), "#2a623d", "#10331f", "#d9d9d9"),
  Ravenclaw:  shield(eagleInner(),   "#26356b", "#0c1530", "#c08b3e"),
  Hufflepuff: shield(badgerInner(),  "#f0c64a", "#caa12c", "#372e29")
};

// Real heraldic coats of arms (freely licensed) from Wikimedia Commons.
export const HOUSE_IMG = {
  Gryffindor: "https://commons.wikimedia.org/wiki/Special:FilePath/Blason_Gryffondor.svg?width=320",
  Slytherin:  "https://commons.wikimedia.org/wiki/Special:FilePath/Blason_Serpentard.svg?width=320",
  Ravenclaw:  "https://commons.wikimedia.org/wiki/Special:FilePath/Blason_Serdaigle.svg?width=320",
  Hufflepuff: "https://commons.wikimedia.org/wiki/Special:FilePath/Blason_Poufsouffle.svg?width=320"
};
