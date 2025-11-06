import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState } from "react";

const revenueData = [
  { month: "Aug", value: 28000 },
  { month: "Sep", value: 31500 },
  { month: "Oct", value: 29000 },
  { month: "Nov", value: 35000 },
  { month: "Dec", value: 38500 },
  { month: "Jan", value: 32500 },
];

export function TrendChart() {
  const [animate, setAnimate] = useState(false);

  // Calculate trend
  const firstValue = revenueData[0].value;
  const lastValue = revenueData[revenueData.length - 1].value;
  const trend = lastValue > firstValue ? "positive" : "negative";
  const avgValue = revenueData.reduce((sum, d) => sum + d.value, 0) / revenueData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Revenue Trend (6 Months)
          <span className={trend === "positive" ? "text-green-500" : "text-red-500"}>
            {trend === "positive" ? "↗" : "↘"} {((lastValue - firstValue) / firstValue * 100).toFixed(1)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={revenueData}
            onMouseEnter={() => setAnimate(true)}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-muted-foreground"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              className="text-muted-foreground"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <ReferenceLine 
              y={avgValue} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3" 
              label={{ value: 'Avg', position: 'right' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={trend === "positive" ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))"}
              strokeWidth={3}
              dot={{ fill: trend === "positive" ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))", r: 4 }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
              animationBegin={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
