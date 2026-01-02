"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  TrendingUp,
  Users,
  Eye,
  DollarSign,
  Activity,
  Download,
  Filter,
} from "lucide-react";
import { generateMockAnalyticsData } from "@/components/analytics/mockData";
import { OverviewCards } from "@/components/analytics/OverviewCards";
import {
  TrafficChart,
  VisitorTrendChart,
  RevenueChart,
  DeviceChart,
  TrafficSourceChart,
} from "@/components/analytics/Charts";

export default function WebsiteAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [analyticsData, setAnalyticsData] = useState(
    generateMockAnalyticsData(),
  );

  // Simulate loading and refreshing data
  const refreshData = () => {
    setAnalyticsData(generateMockAnalyticsData());
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 custom-font mb-2">
              Website Analytics
            </h1>
            <p className="text-gray-600 custom-font">
              Monitor your website performance and user behavior
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border-none outline-none text-gray-700 custom-font"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
            </div>

            {/* Actions */}
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="custom-font">Export</span>
            </button>

            <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="custom-font">Filter</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OverviewCards data={analyticsData.overview} />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TrafficChart
              data={analyticsData.traffic}
              title="Traffic Overview"
            />
          </motion.div>

          {/* Visitor Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VisitorTrendChart
              data={analyticsData.visitors}
              title="New vs Returning Visitors"
            />
          </motion.div>
        </div>

        {/* Revenue and Conversions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RevenueChart data={analyticsData.revenue} title="Revenue Trend" />
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
              <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Top Pages
              </h3>
              <div className="space-y-3">
                {analyticsData.pages.slice(0, 5).map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 custom-font">
                        {page.title}
                      </p>
                      <p className="text-sm text-gray-500">{page.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 custom-font">
                        {page.views.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {page.uniqueViews} unique
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Device and Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <DeviceChart
              data={analyticsData.devices}
              title="Device Breakdown"
            />
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TrafficSourceChart
              data={analyticsData.sources}
              title="Traffic Sources"
            />
          </motion.div>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold custom-font text-gray-900 mb-2">
                Data Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 custom-font">Avg. Order Value</p>
                  <p className="font-bold text-gray-900 custom-font">
                    $
                    {Math.floor(
                      analyticsData.revenue.reduce(
                        (acc, r) => acc + r.avgOrderValue,
                        0,
                      ) / analyticsData.revenue.length,
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 custom-font">Total Orders</p>
                  <p className="font-bold text-gray-900 custom-font">
                    {analyticsData.revenue
                      .reduce((acc, r) => acc + r.orders, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 custom-font">Conversion Rate</p>
                  <p className="font-bold text-gray-900 custom-font">
                    {analyticsData.overview.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 custom-font">Growth Rate</p>
                  <p className="font-bold text-green-600 custom-font">
                    +{analyticsData.overview.growthRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
