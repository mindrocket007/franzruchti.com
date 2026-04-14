"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BodyBatteryChartProps {
  data: { date: string; bodyBatteryHigh: number | null; bodyBatteryLow: number | null }[];
}

export default function BodyBatteryChart({ data }: BodyBatteryChartProps) {
  if (data.length === 0) return <p className="text-foreground/50 text-center py-8">Keine Body Battery Daten</p>;

  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    Hoch: d.bodyBatteryHigh,
    Tief: d.bodyBatteryLow,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Area type="monotone" dataKey="Hoch" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
        <Area type="monotone" dataKey="Tief" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
