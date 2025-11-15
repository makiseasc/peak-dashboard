"use client";

import { CheckCircle2, DollarSign, Target, MessageSquare, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: 'hla' | 'revenue' | 'deal' | 'outreach';
  description: string;
  timestamp: string;
}

interface TimelineFeedProps {
  activities: Activity[];
}

const typeIcons = {
  hla: CheckCircle2,
  revenue: DollarSign,
  deal: Target,
  outreach: MessageSquare,
};

const typeColors = {
  hla: 'text-purple-400',
  revenue: 'text-green-400',
  deal: 'text-cyan-400',
  outreach: 'text-blue-400',
};

export function TimelineFeed({ activities }: TimelineFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {activities.map((activity) => {
        const Icon = typeIcons[activity.type];
        const iconColor = typeColors[activity.type];
        
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 hover:bg-white/10 transition-all"
          >
            <div className={`${iconColor} mt-0.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

