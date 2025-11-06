import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Trophy, Sparkles, Star, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";

interface LevelUpCelebrationProps {
  level: number;
  onClose: () => void;
}

export function LevelUpCelebration({ level, onClose }: LevelUpCelebrationProps) {
  const { awardGP, getXPForNextLevel } = useDashboard();
  const [show, setShow] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const hasRunRef = useRef(false);
  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Award GP bonus for leveling up (run once)
    const gpBonus = level * 10;
    awardGP(gpBonus, `Level ${level} Achievement`);

    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 4000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-500",
      show ? "opacity-100" : "opacity-0"
    )}>
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fade-in"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.id % 3 === 0 ? (
            <Star className="h-4 w-4 text-accent animate-pulse" />
          ) : (
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          )}
        </div>
      ))}
      
      {/* Main celebration card */}
      <Card className={cn(
        "bg-gradient-to-br from-primary via-accent to-primary border-2 border-accent shadow-2xl transition-all duration-500",
        show ? "scale-100 animate-scale-in" : "scale-95"
      )}>
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="h-24 w-24 text-primary-foreground animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-accent animate-spin" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-primary-foreground animate-fade-in">
              LEVEL UP!
            </h2>
            <p className="text-6xl font-black text-primary-foreground animate-scale-in">
              {level}
            </p>
            <p className="text-xl text-primary-foreground/80 animate-fade-in">
              You're crushing it! Keep going! 🚀
            </p>
            <div className="flex items-center justify-center gap-2 text-warning text-2xl font-bold mt-4">
              <Coins className="h-8 w-8" />
              <span>+{level * 10} GP Bonus!</span>
            </div>
            <p className="text-sm text-primary-foreground/60 mt-2">
              Next level: {getXPForNextLevel(level)} XP required
            </p>
          </div>
          
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-6 w-6 text-accent animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
