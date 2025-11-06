import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, TrendingDown, Clock } from "lucide-react";
import { Progress } from "./ui/progress";

const constraints = [
  { 
    name: "Sales Pipeline", 
    capacity: 75, 
    isBottleneck: false,
    description: "Healthy flow of prospects"
  },
  { 
    name: "Time Allocation", 
    capacity: 95, 
    isBottleneck: true,
    description: "Near capacity - delegate or optimize"
  },
  { 
    name: "Financial Runway", 
    capacity: 60, 
    isBottleneck: false,
    description: "6 months at current burn rate"
  },
  { 
    name: "Team Capacity", 
    capacity: 85, 
    isBottleneck: true,
    description: "Consider hiring to scale"
  },
];

export function ConstraintAnalysis() {
  const bottlenecks = constraints.filter(c => c.isBottleneck);

  return (
    <div className="space-y-6">
      {bottlenecks.length > 0 && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            <span className="font-semibold">{bottlenecks.length} bottleneck(s) detected</span> - 
            Focus here for maximum leverage
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            System Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {constraints.map((constraint, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{constraint.name}</span>
                  {constraint.isBottleneck && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                </div>
                <span className="text-sm font-bold">{constraint.capacity}%</span>
              </div>
              <Progress 
                value={constraint.capacity} 
                className={constraint.isBottleneck ? "bg-warning/20" : ""} 
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {constraint.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
