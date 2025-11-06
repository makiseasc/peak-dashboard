"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="bg-gradient-to-br from-[#141C2E] to-[#0F1626] p-6 rounded-xl border border-white/10 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-white/90">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            style={{ fontSize: "12px" }}
            tick={{ fill: "#9CA3AF" }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            style={{ fontSize: "12px" }}
            tick={{ fill: "#9CA3AF" }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#1C2540",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#7C3AED" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#A78BFA" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

