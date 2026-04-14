"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SleepChartProps {
  data: { date: string; deepMin: number | null; lightMin: number | null; remMin: number | null; awakeMin: number | null }[];
}

export default function SleepChart({ data }: SleepChartProps) {
  if (data.length === 0) return <p className="text-foreground/50 text-center py-8">Keine Schlafdaten</p>;

  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    Tief: Math.round((d.deepMin || 0) / 60 * 10) / 10,
    Leicht: Math.round((d.lightMin || 0) / 60 * 10) / 10,
    REM: Math.round((d.remMin || 0) / 60 * 10) / 10,
    Wach: Math.round((d.awakeMin || 0) / 60 * 10) / 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} unit="h" />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Legend />
        <Bar dataKey="Tief" stackId="sleep" fill="#1e40af" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Leicht" stackId="sleep" fill="#60a5fa" radius={[0, 0, 0, 0]} />
        <Bar dataKey="REM" stackId="sleep" fill="#a78bfa" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Wach" stackId="sleep" fill="#f87171" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
