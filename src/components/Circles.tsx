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
              onClick={() => slot.kind === "active" && onToggle(i)}
              style={{ width: circleSize, height: circleSize }}
              className={`rounded-full flex items-center justify-center transition text-center p-5 ${
                slot.kind === "done"
                  ? "bg-purple-500"
                  : slot.kind === "active"
                  ? slot.todo.done
                    ? "bg-zinc-900"
                    : "bg-zinc-100 hover:bg-zinc-200"
                  : "bg-zinc-50 border border-dashed border-zinc-200"
              }`}
            >
              {slot.kind === "active" ? (
                <span
                  className={`text-sm leading-snug transition ${
                    slot.todo.done ? "line-through text-zinc-500" : "text-zinc-900"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {slot.todo.text}
                </span>
              ) : slot.kind === "done" ? null : (
                <span className="text-zinc-300 text-sm">slot {i + 1}</span>
              )}
            </button>
            {slot.kind === "active" && (
              <button
                onClick={() => onDelete(i)}
                className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 flex items-center justify-center text-xs leading-none transition"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
