"use client";

import { useState, useEffect } from "react";
import type { SlotState } from "@/app/page";

function getCircleSize(vw: number) {
  if (vw < 480) return 160;
  if (vw < 768) return 200;
  return 240;
}

function generatePositions(vw: number, vh: number, size: number) {
  const HEADER_H = 160;
  const PAD = 16;
  const minDist = size + 8;

  const minX = PAD;
  const maxX = vw - size - PAD;
  const minY = HEADER_H;
  const maxY = vh - size - PAD;

  const result: { x: number; y: number }[] = [];

  for (let i = 0; i < 3; i++) {
    let pos = { x: 0, y: 0 };
    let attempts = 0;
    do {
      pos = {
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY,
      };
      attempts++;
    } while (
      attempts < 300 &&
      result.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < minDist)
    );
    result.push(pos);
  }
  return result;
}

interface Props {
  slots: SlotState[];
  onToggle: (i: number) => void;
  onDelete: (i: number) => void;
}

export default function Circles({ slots, onToggle, onDelete }: Props) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [circleSize, setCircleSize] = useState(200);

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const size = getCircleSize(vw);
    setCircleSize(size);
    setPositions(generatePositions(vw, vh, size));
  }, []);

  if (positions.length === 0) return null;

  return (
    <>
      {slots.map((slot, i) => {
        const pos = positions[i];
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: pos.x, top: pos.y }}
          >
            <button
              onClick={() => slot.kind === "active" && onDelete(i)}
              style={{ width: circleSize, height: circleSize }}
              className={`rounded-full flex items-center justify-center transition text-center p-5 ${
                slot.kind === "done"
                  ? "bg-purple-500"
                  : slot.kind === "active"
                  ? "bg-zinc-100 hover:bg-zinc-200 active:scale-95"
                  : "bg-zinc-50 border border-dashed border-zinc-200"
              }`}
            >
              {slot.kind === "active" ? (
                <span
                  className="text-sm leading-snug text-zinc-900"
                  style={{ wordBreak: "break-word" }}
                >
                  {slot.todo.text}
                </span>
              ) : slot.kind === "done" ? null : (
                <span className="text-zinc-300 text-sm">slot {i + 1}</span>
              )}
            </button>
          </div>
        );
      })}
    </>
  );
}
