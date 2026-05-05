import React from "react";
import AsciiField from "./AsciiField";

/* Quiet ambient — the ASCII field, monochrome, very faint, on light paper. */
export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <AsciiField
        color="#d6d8c8"
        accent="#5fd193"
        opacity={0.07}
        fontSize={14}
      />
    </div>
  );
}
