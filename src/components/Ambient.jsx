import React from "react";
import AsciiField from "./AsciiField";
import { SIGIL } from "../lib/ascii";

export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-heatmap" />
      <div className="ambient-grid" />
      <AsciiField
        color="var(--paper-mid)"
        accent="var(--paper)"
        opacity={0.2}
      />
      <pre className="ambient-sigil">{SIGIL}</pre>
      <div className="ambient-noise" />
      <div className="ambient-scan" />
    </div>
  );
}
