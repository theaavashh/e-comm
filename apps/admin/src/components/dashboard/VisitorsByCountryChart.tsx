"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VisitorsByCountryChartProps {
  data: { country: string; value: number }[];
}

const VisitorsByCountryChart = ({ data }: VisitorsByCountryChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="country"
          tick={{ fill: "#666", fontSize: 12 }}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#666", fontSize: 12 }} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          formatter={(value: any, name: any) => [
            `${name}: ${value.toLocaleString()} visitors`,
          ]}
        />
        <Bar
          dataKey="value"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VisitorsByCountryChart;
