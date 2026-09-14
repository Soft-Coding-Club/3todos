"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function getCircleSize(vw: number) {
  if (vw < 480) return 160;
  if (vw < 768) return 200;
  return 240;
}

function generatePositions(vw: number, vh: number, size: number) {
  const minDist = size + 24;
  const margin = size / 2 + 16;
  const maxX = vw - size - margin;
  const maxY = vh - size - margin;
  const result: { x: number; y: number }[] = [];

  for (let i = 0; i < 3; i++) {
    let pos = { x: 0, y: 0 };
    let attempts = 0;
    do {
      pos = {
        x: Math.random() * (maxX - margin) + margin,
        y: Math.random() * (maxY - margin) + margin,
      };
      attempts++;
    } while (
      attempts < 200 &&
      result.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < minDist)
    );
    result.push(pos);
  }
  return result;
}

interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Circles({ todos, onToggle, onDelete }: Props) {
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
      {[0, 1, 2].map((i) => {
        const todo = todos[i];
        const pos = positions[i];
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: pos.x, top: pos.y }}
          >
            <button
              onClick={() => todo && onToggle(todo.id)}
              style={{ width: circleSize, height: circleSize }}
              className={`rounded-full flex items-center justify-center transition text-center p-5 ${
                todo
                  ? todo.done
                    ? "bg-zinc-900"
                    : "bg-zinc-100 hover:bg-zinc-200"
                  : "bg-zinc-50 border border-dashed border-zinc-200"
              }`}
            >
              {todo ? (
                <span
                  className={`text-sm leading-snug transition ${
                    todo.done ? "line-through text-zinc-500" : "text-zinc-900"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {todo.text}
                </span>
              ) : (
                <span className="text-zinc-300 text-sm">slot {i + 1}</span>
              )}
            </button>
            {todo && (
              <button
                onClick={() => onDelete(todo.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 flex items-center justify-center text-xs leading-none transition"
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
