"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface Deal {
  id: string;
  client_name: string;
  stage: string;
  date: string;
}

interface DealFlowTimelineProps {
  deals: Deal[];
}

const stages = ['Discovery', 'Proposal', 'Negotiation', 'Closed'];

export function DealFlowTimeline({ deals }: DealFlowTimelineProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No active deals</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deals.slice(0, 3).map((deal) => (
        <div key={deal.id} className="relative">
          <div className="flex items-center gap-4">
            {stages.map((stage, index) => {
              const isActive = deal.stage === stage;
              const isPast = stages.indexOf(deal.stage) > index;
              
              return (
                <div key={stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isPast || isActive 
                        ? 'bg-purple-500 border-2 border-purple-500' 
                        : 'bg-white/5 border-2 border-white/10'
                      }
                    `}>
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-purple-300' : 'text-slate-400'}`}>
                      {stage}
                    </span>
                  </div>
                  {index < stages.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-2
                      ${isPast ? 'bg-purple-500' : 'bg-white/10'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm text-slate-300">
            {deal.client_name}
          </div>
        </div>
      ))}
    </div>
  );
}

