"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

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
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold text-zinc-900 mb-1">today&apos;s todos</h1>
        <p className="text-zinc-400 text-sm mb-8">just 3. no more.</p>

        <div className="flex gap-2 mb-6">
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

        <div className="flex gap-4 justify-center">
          {[0, 1, 2].map((i) => {
            const todo = todos[i];
            return (
              <div key={i} className="relative">
                <button
                  onClick={() => todo && toggleTodo(todo.id)}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition text-center p-4 ${
                    todo
                      ? todo.done
                        ? "bg-zinc-900"
                        : "bg-zinc-100 hover:bg-zinc-200"
                      : "bg-zinc-50 border border-dashed border-zinc-200"
                  }`}
                >
                  {todo ? (
                    <span
                      className={`text-xs leading-snug break-words transition ${
                        todo.done ? "line-through text-zinc-500" : "text-zinc-900"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {todo.text}
                    </span>
                  ) : (
                    <span className="text-zinc-300 text-xs">slot {i + 1}</span>
                  )}
                </button>
                {todo && (
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 flex items-center justify-center text-xs leading-none transition"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-xs text-zinc-400">
            <span>{todos.filter((t) => t.done).length}/{todos.length} done</span>
            {todos.length === 3 && todos.every((t) => t.done) && (
              <span className="text-zinc-900 font-medium">all done for today!</span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
