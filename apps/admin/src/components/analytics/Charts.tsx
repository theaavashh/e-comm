"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrafficData,
  VisitorData,
  ConversionData,
  RevenueData,
  DeviceData,
  TrafficSourceData,
} from "./types";

interface TrafficChartProps {
  data: TrafficData[];
  title: string;
}

export function TrafficChart({ data, title }: TrafficChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="visitors"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Visitors"
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            stackId="2"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Page Views"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface VisitorTrendProps {
  data: VisitorData[];
  title: string;
}

export function VisitorTrendChart({ data, title }: VisitorTrendProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="newVisitors"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="New Visitors"
          />
          <Line
            type="monotone"
            dataKey="returningVisitors"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            name="Returning Visitors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RevenueChartProps {
  data: RevenueData[];
  title: string;
}

export function RevenueChart({ data, title }: RevenueChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
          />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            name="Revenue"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DeviceChartProps {
  data: DeviceData[];
  title: string;
}

export function DeviceChart({ data, title }: DeviceChartProps) {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  // Transform data for PieChart
  const chartData = data.map((item) => ({
    name: item.device,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(1)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [value.toLocaleString(), "Visitors"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrafficSourceChartProps {
  data: TrafficSourceData[];
  title: string;
}

export function TrafficSourceChart({ data, title }: TrafficSourceChartProps) {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="source" type="category" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value: any) => [value.toLocaleString(), "Visitors"]}
          />
          <Bar dataKey="visitors" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
