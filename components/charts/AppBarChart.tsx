
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "../CustomToolTip";
import { useEffect, useState } from "react";

// Color mapping by month abbreviation
const monthColors: Record<string, string> = {
  Jan: "#3B82F6",
  Feb: "#F43F5E",
  Mar: "#10B981",
  Apr: "#F59E0B",
  May: "#6366F1",
  Jun: "#8B5CF6",
  Jul: "#14B8A6",
  Aug: "#D946EF",
  Sep: "#22D3EE",
  Oct: "#EF4444",
  Nov: "#0EA5E9",
  Dec: "#4F46E5",
};

// Custom tooltip component


const AppBarChart = () => {
  const [data, setData] = useState<{ month: string; total: number }[]>([]);

  useEffect(() => {
    fetch("/api/savings/monthly")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-lg font-medium mb-6">Monthly Savings</h1>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No savings data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300} >
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="false" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `£${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" radius={4}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={monthColors[entry.month] ?? "#ccc"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AppBarChart;
