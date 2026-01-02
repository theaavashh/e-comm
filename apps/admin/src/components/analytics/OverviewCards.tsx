"use client";

import { OverviewData } from "./types";
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

function OverviewCard({
  title,
  value,
  change,
  icon,
  color,
}: OverviewCardProps) {
  const isPositive = change && change > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 custom-font">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div
              className={`flex items-center mt-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="custom-font">
                {isPositive ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

interface OverviewCardsProps {
  data: OverviewData;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatRate = (rate: number): string => `${rate.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OverviewCard
        title="Total Visitors"
        value={data.totalVisitors}
        change={data.growthRate}
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-blue-500"
      />
      <OverviewCard
        title="Page Views"
        value={data.totalPageViews}
        icon={<Eye className="w-6 h-6 text-white" />}
        color="bg-green-500"
      />
      <OverviewCard
        title="Sessions"
        value={data.totalSessions}
        icon={<Activity className="w-6 h-6 text-white" />}
        color="bg-purple-500"
      />
      <OverviewCard
        title="Bounce Rate"
        value={formatRate(data.bounceRate)}
        icon={<MousePointer className="w-6 h-6 text-white" />}
        color="bg-orange-500"
      />
      <OverviewCard
        title="Avg. Session Duration"
        value={formatDuration(data.avgSessionDuration)}
        icon={<Clock className="w-6 h-6 text-white" />}
        color="bg-pink-500"
      />
      <OverviewCard
        title="Conversion Rate"
        value={formatRate(data.conversionRate)}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        color="bg-indigo-500"
      />
      <OverviewCard
        title="Total Revenue"
        value={`$${data.totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="w-6 h-6 text-white" />}
        color="bg-teal-500"
      />
    </div>
  );
}
