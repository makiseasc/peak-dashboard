import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Scroll } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { Badge } from "./ui/badge";

const questNarratives = {
  revenue: {
    title: "The Revenue Quest",
    description: "The Pattern Architect seeks new clients to build their empire. Reach out to 10 prospects to advance your quest.",
    flavor: "Every outreach is a seed planted. Some will grow into mighty oaks of revenue.",
  },
  signal: {
    title: "Signal in the Noise",
    description: "Listen to the market's whispers. Connect deeply with 3 prospects to unlock hidden opportunities.",
    flavor: "In conversation lies truth. In truth lies the path forward.",
  },
  mastery: {
    title: "The Path of Mastery",
    description: "Sharpen your skills through focused learning. One hour of deliberate practice moves you closer to mastery.",
    flavor: "The master has failed more times than the beginner has tried.",
  },
};

const levelMilestones = [
  { level: 5, chapter: "Rising Challenger", story: "Your persistence has caught the attention of others in your field." },
  { level: 10, chapter: "Proven Warrior", story: "Word of your victories spreads. New opportunities seek you out." },
  { level: 20, chapter: "Master of the Craft", story: "You've transcended mere competence. Others study your methods." },
  { level: 50, chapter: "Legend", story: "Your name is spoken with reverence. The path you've walked inspires generations." },
];

export function NarrativeSystem() {
  const { data } = useDashboard();
  
  const currentMilestone = [...levelMilestones]
    .reverse()
    .find(m => data.level >= m.level) || levelMilestones[0];

  const nextMilestone = levelMilestones.find(m => m.level > data.level);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Chapter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Scroll className="h-4 w-4 text-primary" />
              {currentMilestone.chapter}
            </h3>
            <Badge>Level {data.level}</Badge>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{currentMilestone.story}"
          </p>
        </div>

        {/* Next Chapter Preview */}
        {nextMilestone && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Next Chapter (Level {nextMilestone.level})</p>
            <p className="text-sm font-medium">{nextMilestone.chapter}</p>
            <p className="text-xs text-muted-foreground mt-1">???</p>
          </div>
        )}

        {/* Daily Quest Narratives */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Today's Quests</h4>
          {Object.entries(questNarratives).map(([key, quest]) => (
            <div key={key} className="p-3 bg-card rounded-lg border border-border space-y-1">
              <p className="text-sm font-medium">{quest.title}</p>
              <p className="text-xs text-muted-foreground">{quest.description}</p>
              <p className="text-xs italic text-primary/80">"{quest.flavor}"</p>
            </div>
          ))}
        </div>

        {/* Boss Battle Narrative */}
        {data.currentBoss && (
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
            <p className="text-sm font-bold text-destructive mb-2">⚔️ Active Boss Battle</p>
            <p className="text-sm font-medium">{data.currentBoss.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{data.currentBoss.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
