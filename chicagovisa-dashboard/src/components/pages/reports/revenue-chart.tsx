"use client";

import React, { useState, useMemo } from "react";
import { format, parseISO, startOfMonth, startOfYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface RevenueData {
  week: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

type GroupBy = "week" | "month" | "year";

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [groupBy, setGroupBy] = useState<GroupBy>("week");

  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped: { [key: string]: number } = {};

    data.forEach((item) => {
      const date = parseISO(item.week);
      let key: string;

      switch (groupBy) {
        case "month":
          key = format(startOfMonth(date), "MMM yyyy");
          break;
        case "year":
          key = format(startOfYear(date), "yyyy");
          break;
        case "week":
        default:
          key = format(date, "MMM dd");
          break;
      }

      if (!grouped[key]) {
        grouped[key] = 0;
      }
      grouped[key] += item.revenue;
    });

    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (groupBy === "year") {
        return parseInt(a) - parseInt(b);
      }
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedKeys.map((key) => ({
      date: key,
      revenue: grouped[key],
    }));
  }, [data, groupBy]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-2)",
    },
  };

  const totalRevenue = aggregatedData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = aggregatedData.length > 0 ? totalRevenue / aggregatedData.length : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Revenue Trends</CardTitle>
            <CardDescription className="text-xs">
              Revenue over the past {groupBy === "week" ? "weeks" : groupBy === "month" ? "months" : "years"}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant={groupBy === "week" ? "primary" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setGroupBy("week")}
            >
              Week
            </Button>
            <Button
              variant={groupBy === "month" ? "primary" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setGroupBy("month")}
            >
              Month
            </Button>
            <Button
              variant={groupBy === "year" ? "primary" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setGroupBy("year")}
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {aggregatedData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart data={aggregatedData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value.slice(0, 6)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `$${Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex justify-center items-center h-48 text-muted-foreground text-sm">
            No revenue data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
