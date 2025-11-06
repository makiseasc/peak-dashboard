import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useDashboard } from "@/contexts/DashboardContext";
import { Sparkles, Briefcase, Heart, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  icon: any;
  bonus: string;
  color: string;
}

const classes: CharacterClass[] = [
  {
    id: "architect",
    name: "Pattern Architect",
    description: "Master of systems and constraints",
    icon: Target,
    bonus: "+20% XP for constraint solving",
    color: "text-blue-500",
  },
  {
    id: "warrior",
    name: "Revenue Warrior",
    description: "Conqueror of deals and targets",
    icon: Briefcase,
    bonus: "+15 GP for deals closed",
    color: "text-purple-500",
  },
  {
    id: "titan",
    name: "Health Titan",
    description: "Guardian of peak performance",
    icon: Heart,
    bonus: "+10 XP for gym streaks",
    color: "text-red-500",
  },
];

export function CharacterSystem() {
  const { data } = useDashboard();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const savedClass = localStorage.getItem("characterClass");
    if (savedClass) {
      setSelectedClass(savedClass);
    } else if (data.level >= 1) {
      setShowSelector(true);
    }
  }, [data.level]);

  const handleSelectClass = (classId: string) => {
    setSelectedClass(classId);
    localStorage.setItem("characterClass", classId);
    setShowSelector(false);
  };

  const getCharacterEvolution = () => {
    if (data.level >= 20) return "Legendary";
    if (data.level >= 10) return "Master";
    if (data.level >= 5) return "Advanced";
    return "Novice";
  };

  const currentClass = classes.find((c) => c.id === selectedClass);

  if (!selectedClass && !showSelector) return null;

  return (
    <>
      {currentClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentClass.icon className={currentClass.color} />
              Character
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{currentClass.name}</h3>
                <p className="text-sm text-muted-foreground">{currentClass.description}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {getCharacterEvolution()}
              </Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Class Bonus:</p>
              <p className="text-sm text-muted-foreground">{currentClass.bonus}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted rounded">
                <p className="text-2xl font-bold">{data.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-2xl font-bold">{data.xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-2xl font-bold">{data.gp}</p>
                <p className="text-xs text-muted-foreground">GP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showSelector} onOpenChange={setShowSelector}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Your Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {classes.map((charClass) => (
              <Card
                key={charClass.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectClass(charClass.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <charClass.icon className={`h-12 w-12 ${charClass.color}`} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{charClass.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {charClass.description}
                    </p>
                    <Badge variant="secondary">{charClass.bonus}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
