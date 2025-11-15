"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueLineChartProps {
  data: Array<{ date: string; amount: number }>;
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="date" 
          stroke="#AEB7D6"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#AEB7D6"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(15,18,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#F8FAFC'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          dot={{ fill: '#8B5CF6', r: 4 }}
          activeDot={{ r: 6, fill: '#06B6D4' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

