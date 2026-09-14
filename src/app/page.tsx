"use client";

import { useState, useEffect } from "react";
import Circles from "@/components/Circles";

interface Todo {
  text: string;
  done: boolean;
}

export type SlotState =
  | { kind: "empty" }
  | { kind: "active"; todo: Todo }
  | { kind: "done" };

const INITIAL_SLOTS: SlotState[] = [
  { kind: "empty" },
  { kind: "empty" },
  { kind: "empty" },
];

export default function Home() {
  const [slots, setSlots] = useState<SlotState[]>(INITIAL_SLOTS);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isFull = slots.every((s) => s.kind !== "empty");

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed || isFull) return;
    setSlots((prev) => {
      const next = [...prev];
      const idx = next.findIndex((s) => s.kind === "empty");
      next[idx] = { kind: "active", todo: { text: trimmed, done: false } };
      return next;
    });
    setInput("");
  };

  const toggleSlot = (i: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const slot = next[i];
      if (slot.kind !== "active") return prev;
      next[i] = { kind: "active", todo: { ...slot.todo, done: !slot.todo.done } };
      return next;
    });
  };

  const deleteSlot = (i: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[i] = { kind: "done" };
      return next;
    });
  };

  const activeTodos = slots.filter((s) => s.kind === "active");
  const doneTodos = slots.filter((s) => s.kind === "done");

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <div className="relative z-10 p-8 max-w-sm">
        <h1 className="text-3xl font-semibold text-zinc-900 mb-1">today&apos;s todos</h1>
        <p className="text-zinc-400 text-sm mb-6">just 3. no more.</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder={isFull ? "that's enough for today." : "add a task..."}
            disabled={isFull}
            className="flex-1 bg-zinc-100 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-40 transition"
          />
          <button
            onClick={addTodo}
            disabled={isFull || !input.trim()}
            className="bg-zinc-900 text-white font-medium px-5 py-3 text-sm disabled:opacity-30 hover:bg-zinc-700 active:scale-95 transition"
          >
            add
          </button>
        </div>

        {activeTodos.length > 0 && (
          <div className="mt-4 text-xs text-zinc-400">
            {doneTodos.length > 0 && (
              <span>{doneTodos.length} completed · </span>
            )}
            <span>{activeTodos.filter((s) => s.kind === "active" && s.todo.done).length}/{activeTodos.length} checked</span>
          </div>
        )}
      </div>

      {mounted && <Circles slots={slots} onToggle={toggleSlot} onDelete={deleteSlot} />}
    </main>
  );
}
