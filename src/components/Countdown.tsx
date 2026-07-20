"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-08-08T18:00:00-03:00");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = EVENT_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const units = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-[62px] sm:w-[72px] h-[62px] sm:h-[72px] rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="text-2xl sm:text-3xl font-bold tabular-nums text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {pad(unit.value)}
              </span>
            </div>
            <span className="mt-1.5 text-[10px] uppercase tracking-widest text-gray-400"
              style={{ fontFamily: "var(--font-inter)" }}>
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-light text-white/30 mb-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
