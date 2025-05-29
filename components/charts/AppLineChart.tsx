"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useEffect, useState } from "react";
import SmallDashboardItem from "../SmallDashboardItem";

const AppComparisonCharts = () => {
  const [dynamicMonths, setDynamicMonths] = useState({ lastMonth: "Loading...", thisMonth: "Loading..." });
  const [lastMonthData, setLastMonthData] = useState([]);
  const [thisMonthData, setThisMonthData] = useState([]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`/api/savings/transactions`);
        if (!response.ok) throw new Error("Failed to load transaction data.");

        const data = await response.json();
        console.log("📊 API Response:", data);

        // ✅ Identify the latest two months dynamically
        const monthsPresent = [...new Set(data.map((entry) => entry.month))].sort();
        if (monthsPresent.length < 2) return;

        const lastMonth = monthsPresent[monthsPresent.length - 2];
        const thisMonth = monthsPresent[monthsPresent.length - 1];

        setDynamicMonths({ lastMonth, thisMonth });

        setLastMonthData(
          data.filter((entry) => entry.month === lastMonth).map((entry) => ({
            date: entry.date,
            savings: Number(entry.amount),
          }))
        );

        setThisMonthData(
          data.filter((entry) => entry.month === thisMonth).map((entry) => ({
            date: entry.date,
            savings: Number(entry.amount),
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching transaction data:", error);
      }
    }

    fetchChartData();
  }, []);

  return (
    <>
      {/* 🔷 Last Month Line Chart */}
      <SmallDashboardItem>
        <ResponsiveContainer>
          
        <h1 className="text-center mb-12">Last Month</h1>
        <ChartContainer config={{ label: dynamicMonths.lastMonth, color: "hsl(220, 100%, 50%)" }} className="border rounded-lg shadow-md p-4">
            <LineChart data={lastMonthData} >
              <CartesianGrid strokeDasharray="4 4" opacity={0.2} vertical={false} />
              <YAxis tickLine={false} axisLine={true} tickMargin={8} domain={[0, "auto"]} tickFormatter={(value) => `£${value.toFixed(2)}`} />
              <XAxis dataKey="date" tick={false} axisLine={false} />
              <Legend verticalAlign="top" align="center" />  {/* ✅ Added legend */}
              <ChartTooltip cursor={{ strokeDasharray: "4 4" }} content={<ChartTooltipContent />} />
              <Line dataKey="savings" type="monotone" stroke="hsl(220, 100%, 50%)" strokeWidth={2} dot={false} name={`${dynamicMonths.lastMonth} Savings`} />
            </LineChart>
        </ChartContainer>

        </ResponsiveContainer>
      </SmallDashboardItem>

      {/* 🟢 This Month Line Chart */}
      <SmallDashboardItem>
        <ResponsiveContainer>
        <h1 className="text-center mb-12">This Month</h1>
        <ChartContainer config={{ label: dynamicMonths.thisMonth, color: "hsl(140, 80%, 45%)" }} className="border rounded-lg shadow-md p-4">
            <LineChart data={thisMonthData} >
              <CartesianGrid strokeDasharray="4 4" opacity={0.2} vertical={false} />
              <YAxis tickLine={false} axisLine={true} tickMargin={8} domain={[0, "auto"]} tickFormatter={(value) => `£${value.toFixed(2)}`} />
              <XAxis dataKey="date" tick={false} axisLine={false} />
              <Legend verticalAlign="top" align="center" />  {/* ✅ Added legend */}
              <ChartTooltip cursor={{ strokeDasharray: "4 4" }} content={<ChartTooltipContent />} />
              <Line dataKey="savings" type="monotone" stroke="hsl(140, 80%, 45%)" strokeWidth={2} dot={false} name={`${dynamicMonths.thisMonth} Savings`} />
            </LineChart>
        </ChartContainer>
        </ResponsiveContainer>
      </SmallDashboardItem>
    </>
  );
};

export default AppComparisonCharts;
