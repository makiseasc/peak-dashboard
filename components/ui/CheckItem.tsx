"use client";

import { Check, Edit2, Trash2 } from "lucide-react";
import { Button } from "./button";

interface CheckItemProps {
  text: string;
  completed: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CheckItem({ text, completed, onToggle, onEdit, onDelete }: CheckItemProps) {
  return (
    <div
      className="
        group flex items-center gap-3 p-3
        bg-white/5 border border-white/10 rounded-xl
        hover:border-purple-500/30 hover:bg-white/10
        transition-all
      "
    >
      <div
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center
          ${completed ? 'bg-purple-500 border-purple-500' : 'border-white/30'}
          cursor-pointer
        `}
        onClick={onToggle}
      >
        {completed && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={`
          flex-1 text-sm ${completed ? 'text-slate-400 line-through' : 'text-white'}
          cursor-pointer
        `}
        onClick={onToggle}
      >
        {text}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-7 w-7 p-0 text-slate-400 hover:text-purple-400"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

