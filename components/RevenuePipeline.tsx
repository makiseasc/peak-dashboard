import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDashboard } from "@/contexts/DashboardContext";

export function RevenuePipeline() {
  const { data } = useDashboard();

  const pipelineData = [
    { name: "Leads", value: data.activeProspects, fill: "hsl(var(--primary))" },
    { name: "Qualified", value: data.dealsInfo.qualified || 0, fill: "hsl(var(--chart-3))" },
    { name: "Proposal", value: data.dealsInfo.proposal || 0, fill: "hsl(var(--chart-2))" },
    { name: "Closed", value: data.dealsInfo.closed, fill: "hsl(var(--chart-1))" },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pipelineData.map((stage) => (
            <div key={stage.name} className="text-center p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">{stage.name}</p>
              <p className="text-3xl font-bold" style={{ color: stage.fill }}>
                {stage.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
