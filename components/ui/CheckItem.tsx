"use client";

import { Check } from "lucide-react";

interface CheckItemProps {
  text: string;
  completed: boolean;
  onToggle: () => void;
}

export function CheckItem({ text, completed, onToggle }: CheckItemProps) {
  return (
    <div
      className="
        flex items-center gap-3 p-3
        bg-white/5 border border-white/10 rounded-xl
        hover:border-purple-500/30 hover:bg-white/10
        transition-all cursor-pointer
      "
      onClick={onToggle}
    >
      <div
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center
          ${completed ? 'bg-purple-500 border-purple-500' : 'border-white/30'}
        `}
      >
        {completed && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={`
          text-sm ${completed ? 'text-slate-400 line-through' : 'text-white'}
        `}
      >
        {text}
      </span>
    </div>
  );
}

