"use client";

import { useState } from "react";
import { HOUSE_IMG, HOUSE_CRESTS } from "../lib/crests";

// Renders the real heraldic crest image; if it fails to load (e.g. offline),
// falls back to the hand-drawn SVG.
export default function Crest({ house }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span dangerouslySetInnerHTML={{ __html: HOUSE_CRESTS[house] }} />;
  }
  return (
    <img
      src={HOUSE_IMG[house]}
      alt={`${house} crest`}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
