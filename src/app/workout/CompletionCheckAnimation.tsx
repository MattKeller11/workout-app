// src/app/workout/CompletionCheckAnimation.tsx
import React, { useEffect, useState } from "react";

export function CompletionCheckAnimation({ onDone }: { onDone: () => void }) {
  const [showCheck, setShowCheck] = useState(false);
  useEffect(() => {
    const checkTimeout = setTimeout(() => setShowCheck(true), 300);
    const doneTimeout = setTimeout(onDone, 1500);
    return () => {
      clearTimeout(checkTimeout);
      clearTimeout(doneTimeout);
    };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="#262626"
          stroke="#4ade80"
          strokeWidth="8"
        />
        <g>
          <polyline
            points="40,65 55,80 85,50"
            fill="none"
            stroke="#4ade80"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: showCheck ? 1 : 0,
              transform: showCheck ? "scale(1.2)" : "scale(0.7)",
              transformOrigin: "60px 65px",
              transition:
                "opacity 0.2s 0.2s, transform 0.4s cubic-bezier(.4,2,.6,1)",
            }}
          />
        </g>
      </svg>
    </div>
  );
}
