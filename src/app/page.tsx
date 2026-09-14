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
        <h1 className="text-3xl font-bold text-zinc-900 mb-1">오늘의 할일</h1>
        <p className="text-zinc-400 text-sm mb-8">딱 3개만. 더는 안 돼요.</p>

        {/* 입력 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder={isFull ? "오늘 할 일은 다 정했어요!" : "할 일을 입력하세요"}
            disabled={isFull}
            className="flex-1 bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-40 transition"
          />
          <button
            onClick={addTodo}
            disabled={isFull || !input.trim()}
            className="bg-zinc-900 text-white font-semibold px-5 py-3 rounded-xl text-sm disabled:opacity-30 hover:bg-zinc-700 active:scale-95 transition"
          >
            추가
          </button>
        </div>

        {/* 슬롯 */}
        <div className="space-y-3">
          {[0, 1, 2].map((i) => {
            const todo = todos[i];
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-2xl px-4 py-4 transition ${
                  todo
                    ? "bg-zinc-100"
                    : "bg-zinc-50 border border-dashed border-zinc-200"
                }`}
              >
                {todo ? (
                  <>
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                        todo.done
                          ? "bg-zinc-900 border-zinc-900"
                          : "border-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {todo.done && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm transition ${
                        todo.done ? "line-through text-zinc-400" : "text-zinc-900"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-zinc-300 hover:text-zinc-500 transition text-lg leading-none"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-zinc-300 text-sm">빈 슬롯 {i + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 진행 상황 */}
        {todos.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-xs text-zinc-400">
            <span>{todos.filter((t) => t.done).length}/{todos.length} 완료</span>
            {todos.length === 3 && todos.every((t) => t.done) && (
              <span className="text-zinc-900 font-medium">오늘 할 일 다 했어요! 🎉</span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
