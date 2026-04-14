"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HrvChartProps {
  data: { date: string; hrvStatus: number | null; restingHr: number | null }[];
}

export default function HrvChart({ data }: HrvChartProps) {
  if (data.length === 0) return <p className="text-foreground/50 text-center py-8">Keine HRV-Daten</p>;

  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    HRV: d.hrvStatus ? Math.round(d.hrvStatus) : null,
    "Ruhe-HF": d.restingHr,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
        <YAxis yAxisId="hrv" stroke="#a78bfa" fontSize={12} />
        <YAxis yAxisId="hr" orientation="right" stroke="#f87171" fontSize={12} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Line yAxisId="hrv" type="monotone" dataKey="HRV" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} name="HRV (ms)" />
        <Line yAxisId="hr" type="monotone" dataKey="Ruhe-HF" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} name="Ruhe-HF (bpm)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
