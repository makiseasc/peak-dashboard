"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PipelineFunnelProps {
  data: Array<{ stage: string; count: number }>;
}

export function PipelineFunnel({ data }: PipelineFunnelProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis type="number" stroke="#AEB7D6" style={{ fontSize: '12px' }} />
        <YAxis 
          dataKey="stage" 
          type="category" 
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
        <Bar dataKey="count" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

