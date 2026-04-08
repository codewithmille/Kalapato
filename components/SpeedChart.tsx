"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SpeedChartProps {
  data: any[];
}

export function SpeedChart({ data }: SpeedChartProps) {
  // Filter only those with speed and take top 10
  const chartData = data
    .filter((d) => d.arrivalLog)
    .sort((a, b) => b.arrivalLog.speed - a.arrivalLog.speed)
    .slice(0, 10)
    .map((d) => ({
      name: d.bird.bandNumber.split("-").slice(-1)[0], // last part of band
      speed: parseFloat(d.arrivalLog.speed.toFixed(2)),
      fullName: d.bird.bandNumber
    }));

  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500 italic">Insufficient data for velocity analysis.</div>;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickFormatter={(value) => `${value}`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            cursor={{ fill: '#1E2A3A' }}
            contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid #1E2A3A', borderRadius: '8px' }}
            itemStyle={{ color: '#F5C518' }}
            labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(value: any, name: any, props: any) => [value, "m/min"]}
            labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
          />
          <Bar dataKey="speed" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? "#F5C518" : "#1E2A3A"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
