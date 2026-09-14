"use client";

import { useState, useEffect } from "react";
import Circles from "@/components/Circles";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed || todos.length >= 3) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, done: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const isFull = todos.length >= 3;

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

        {todos.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-xs text-zinc-400">
            <span>{todos.filter((t) => t.done).length}/{todos.length} done</span>
            {todos.length === 3 && todos.every((t) => t.done) && (
              <span className="text-zinc-900 font-medium">all done for today!</span>
            )}
          </div>
        )}
      </div>

      {mounted && <Circles todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />}
    </main>
  );
}
