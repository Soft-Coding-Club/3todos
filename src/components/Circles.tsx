"use client";

import { useState, useEffect, useRef } from "react";
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
  const [visible, setVisible] = useState<boolean[]>([false, false, false]);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const init = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = getCircleSize(vw);
      setCircleSize(size);
      setPositions(generatePositions(vw, vh, size));
    };
    init();

    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = getCircleSize(vw);
      const PAD = 16;
      const HEADER_H = 160;
      setCircleSize(size);
      setPositions((prev) =>
        prev.map((p) => ({
          x: Math.min(Math.max(p.x, PAD), vw - size - PAD),
          y: Math.min(Math.max(p.y, HEADER_H), vh - size - PAD),
        }))
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Trigger fade-in when a slot becomes active or done
  useEffect(() => {
    setVisible((prev) =>
      prev.map((v, i) => v || slots[i].kind !== "empty")
    );
  }, [slots]);

  useEffect(() => {
    if (positions.length === 0) return;

    const magnetRadius = circleSize * 1.5;
    const maxPull = 0.45;

    const handleMouseMove = (e: MouseEvent) => {
      wrapperRefs.current.forEach((el, i) => {
        if (!el || !positions[i]) return;
        const cx = positions[i].x + circleSize / 2;
        const cy = positions[i].y + circleSize / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < magnetRadius) {
          const pull = Math.pow(1 - dist / magnetRadius, 2) * maxPull;
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        } else {
          el.style.transform = "translate(0px, 0px)";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [positions, circleSize]);

  if (positions.length === 0) return null;

  return (
    <>
      {slots.map((slot, i) => {
        const pos = positions[i];
        return (
          <div
            key={i}
            ref={(el) => { wrapperRefs.current[i] = el; }}
            className="absolute"
            style={{
              left: pos.x,
              top: pos.y,
              transition: "left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease, scale 0.5s ease",
              opacity: visible[i] ? 1 : 0,
              scale: visible[i] ? "1" : "0.7",
              pointerEvents: visible[i] ? "auto" : "none",
            }}
          >
            <button
              onClick={() => slot.kind === "active" && onDelete(i)}
              style={{ width: circleSize, height: circleSize }}
              className={`rounded-full flex items-center justify-center transition-colors text-center p-5 ${
                slot.kind === "done"
                  ? "bg-purple-500"
                  : slot.kind === "active"
                  ? "bg-zinc-100 hover:bg-zinc-200 active:scale-95"
                  : "bg-zinc-50"
              }`}
            >
              {(slot.kind === "active" || slot.kind === "done") ? (
                <span
                  className={`text-sm leading-snug ${slot.kind === "done" ? "text-white" : "text-zinc-900"}`}
                  style={{ wordBreak: "break-word" }}
                >
                  {slot.todo.text}
                </span>
              ) : null}
            </button>
          </div>
        );
      })}
    </>
  );
}
