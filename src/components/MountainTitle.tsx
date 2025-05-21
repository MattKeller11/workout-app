import React from "react";

export function MountainTitle() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Mountain SVG line above the title */}
      <svg
        viewBox="0 0 420 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-0 w-[95%] h-14 pointer-events-none select-none z-0"
        style={{ filter: "blur(0.5px)", opacity: 0.7, marginBottom: "-12px" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="mountain-gradient"
            x1="0"
            y1="0"
            x2="420"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4ade80" stopOpacity="0.7" />
            <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="1" stopColor="#4ade80" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d="M0 70 L70 18 L140 32 L210 7 L280 32 L350 18 L420 70"
          stroke="url(#mountain-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <h1
        className="text-5xl sm:text-6xl font-extrabold text-center tracking-tight relative z-10 inline-block"
        style={{ color: "#4ade80", letterSpacing: "0.04em" }}
      >
        <span className="relative inline-block">
          Peak
          <span
            className="absolute -bottom-1 -right-3 sm:-right-4 text-xs sm:text-sm font-semibold text-green-300 opacity-80 tracking-normal"
            style={{ letterSpacing: 0 }}
          >
            AI
          </span>
        </span>
      </h1>
    </div>
  );
}
