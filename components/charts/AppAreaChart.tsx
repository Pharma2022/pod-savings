"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const AppAreaChart = () => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`/api/savings/transactions`);
        if (!response.ok) throw new Error("Failed to load transaction data.");

        const data = await response.json();
        console.log("📊 API Response (Transactions):", data);

        // ✅ Identify dynamic lastMonth & currentMonth from API
        const monthsPresent = [...new Set(data.map((entry) => entry.month))];
        if (monthsPresent.length < 2) return;

        const [lastMonth, currentMonth] = monthsPresent;

        const formattedData = data.map((entry: any) => ({
          date: entry.date,
          [lastMonth]: entry.month === lastMonth ? Number(entry.amount) : null,
          [currentMonth]:
            entry.month === currentMonth ? Number(entry.amount) : null,
        }));

        // ✅ Sort data chronologically **before** setting state
        const sortedData = formattedData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        console.log("📊 Sorted Data for Chart:", sortedData);

        setChartData(sortedData);
      } catch (error) {
        console.error("❌ Error fetching transaction data:", error);
      }
    }

    fetchChartData();
  }, []);

  // ✅ Apply ShadCN colors dynamically
  const chartConfig: ChartConfig = {
    lastMonth: {
      label: "Last Month",
      color: "hsl(210, 90%, 60%)", // ✅ Custom Blue
    },
    thisMonth: {
      label: "This Month",
      color: "hsl(160, 80%, 50%)", // ✅ Custom Green
    },
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-medium">Monthly Savings Comparison</h1>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

          <defs>
            <linearGradient id="fillLastMonth" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillThisMonth" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          {/* ✅ Use dynamically generated month keys */}
          <Area
            dataKey={
              chartData.length > 0 ? Object.keys(chartData[0])[1] : "lastMonth"
            }
            type="natural"
            fill={chartConfig.lastMonth.color}
            fillOpacity={0.4}
            stroke={chartConfig.lastMonth.color}
            stackId="a"
          />

          <Area
            dataKey={
              chartData.length > 0 ? Object.keys(chartData[0])[2] : "thisMonth"
            }
            type="natural"
            fill={chartConfig.thisMonth.color}
            fillOpacity={0.4}
            stroke={chartConfig.thisMonth.color}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AppAreaChart;
