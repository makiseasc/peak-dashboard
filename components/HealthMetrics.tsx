import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Moon, Dumbbell, Zap } from "lucide-react";
import { StatCard } from "./StatCard";
import { Progress } from "./ui/progress";

export function HealthMetrics() {
  const metrics = [
    { label: "Sleep Quality", value: 85, target: 90, unit: "%" },
    { label: "Workout Streak", value: 5, target: 7, unit: " days" },
    { label: "Energy Level", value: 75, target: 100, unit: "%" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Sleep Score"
          value="7.2h"
          icon={<Moon className="h-5 w-5" />}
          trend={{ value: "Goal: 8h", isPositive: false }}
        />
        <StatCard
          title="Workouts This Week"
          value="5"
          icon={<Dumbbell className="h-5 w-5" />}
          trend={{ value: "On track", isPositive: true }}
        />
        <StatCard
          title="Energy Level"
          value="High"
          icon={<Zap className="h-5 w-5" />}
          trend={{ value: "Consistent", isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm font-bold">
                  {metric.value}{metric.unit} / {metric.target}{metric.unit}
                </span>
              </div>
              <Progress value={(metric.value / metric.target) * 100} />
            </div>
          ))}

          <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-accent">
              <span className="font-semibold">Tip:</span> Consistent sleep improves decision-making by 40%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
