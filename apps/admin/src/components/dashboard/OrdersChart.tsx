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

interface OrdersChartProps {
  data: number[];
}

const OrdersChart = ({ data }: OrdersChartProps) => {
  const chartData = data.map((value, index) => ({
    day: `Day ${index + 1}`,
    orders: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          tick={{ fill: "#666", fontSize: 11 }}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#666", fontSize: 11 }} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "11px",
          }}
          formatter={(value: any) => [`Orders: ${value}`]}
        />
        <Bar
          dataKey="orders"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;
