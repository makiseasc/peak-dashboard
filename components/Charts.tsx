"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="bg-gradient-to-br from-[#141C2E] to-[#0F1626] p-6 rounded-xl border border-white/10 shadow-md hover:shadow-purple-500/20 transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-white/90 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
        Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.3} />
            </linearGradient>
          </defs>
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
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#revenueGradient)" 
            strokeWidth={3}
            dot={false}
            activeDot={{ 
              r: 6, 
              fill: "#A78BFA",
              stroke: "#7C3AED",
              strokeWidth: 2,
              filter: "drop-shadow(0 0 6px #7C3AED)",
            }}
            style={{
              filter: "drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

