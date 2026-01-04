"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  MousePointer,
  CreditCard,
  XCircle,
  TrendingUp as TrendingIcon,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
  sessions: number;
  draftOrders: number;
  abandonedCarts: number;
  addToCart: number;
  reachedCheckout: number;
  averageOrderValue: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalSessions: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  sessionGrowth: number;
  draftOrders: number;
  abandonedCarts: number;
  addToCartRate: number;
  checkoutRate: number;
}

interface ConversionFunnelData {
  name: string;
  value: number;
  conversion: number;
}

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
  [key: string]: any; // Add index signature for ChartDataInput compatibility
}

export default function SalesAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalSessions: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    sessionGrowth: 0,
    draftOrders: 0,
    abandonedCarts: 0,
    addToCartRate: 0,
    checkoutRate: 0,
  });

  const periods = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
  ];

  useEffect(() => {
    loadSalesData();
  }, [selectedPeriod]);

  const loadSalesData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would fetch from your API
      const mockSalesData: SalesData[] = [
        {
          period: "2024-01-01",
          revenue: 25000,
          orders: 150,
          customers: 120,
          conversion: 3.2,
          sessions: 4687,
          draftOrders: 25,
          abandonedCarts: 85,
          addToCart: 280,
          reachedCheckout: 195,
          averageOrderValue: 166.67,
        },
        {
          period: "2024-01-02",
          revenue: 32000,
          orders: 180,
          customers: 145,
          conversion: 3.8,
          sessions: 4737,
          draftOrders: 32,
          abandonedCarts: 92,
          addToCart: 320,
          reachedCheckout: 240,
          averageOrderValue: 177.78,
        },
        {
          period: "2024-01-03",
          revenue: 28000,
          orders: 165,
          customers: 130,
          conversion: 3.5,
          sessions: 4714,
          draftOrders: 28,
          abandonedCarts: 88,
          addToCart: 295,
          reachedCheckout: 210,
          averageOrderValue: 169.7,
        },
        {
          period: "2024-01-04",
          revenue: 35000,
          orders: 200,
          customers: 160,
          conversion: 4.1,
          sessions: 4878,
          draftOrders: 35,
          abandonedCarts: 95,
          addToCart: 350,
          reachedCheckout: 265,
          averageOrderValue: 175.0,
        },
        {
          period: "2024-01-05",
          revenue: 42000,
          orders: 240,
          customers: 190,
          conversion: 4.5,
          sessions: 5333,
          draftOrders: 42,
          abandonedCarts: 108,
          addToCart: 420,
          reachedCheckout: 320,
          averageOrderValue: 175.0,
        },
        {
          period: "2024-01-06",
          revenue: 38000,
          orders: 220,
          customers: 175,
          conversion: 4.2,
          sessions: 5238,
          draftOrders: 38,
          abandonedCarts: 98,
          addToCart: 380,
          reachedCheckout: 285,
          averageOrderValue: 172.73,
        },
        {
          period: "2024-01-07",
          revenue: 45000,
          orders: 260,
          customers: 210,
          conversion: 4.8,
          sessions: 5417,
          draftOrders: 48,
          abandonedCarts: 115,
          addToCart: 450,
          reachedCheckout: 345,
          averageOrderValue: 173.08,
        },
      ];

      const mockTopProducts: TopProduct[] = [
        {
          id: "1",
          name: "Traditional Handicraft Wooden Bowl Set",
          sales: 45,
          revenue: 112500,
          growth: 12.5,
        },
        {
          id: "2",
          name: "Brass Puja Thali Set",
          sales: 38,
          revenue: 68400,
          growth: 8.3,
        },
        {
          id: "3",
          name: "Nepali Musical Instruments",
          sales: 32,
          revenue: 96000,
          growth: 15.2,
        },
        {
          id: "4",
          name: "Handwoven Pashmina Shawl",
          sales: 28,
          revenue: 84000,
          growth: 6.7,
        },
        {
          id: "5",
          name: "Rudrakshya Mala Set",
          sales: 25,
          revenue: 37500,
          growth: 9.1,
        },
      ];

      const mockMetrics: SalesMetrics = {
        totalRevenue: 245000,
        totalOrders: 1415,
        totalCustomers: 1130,
        totalSessions: 35004,
        averageOrderValue: 173.14,
        conversionRate: 4.2,
        revenueGrowth: 15.3,
        orderGrowth: 12.8,
        customerGrowth: 18.5,
        sessionGrowth: 8.7,
        draftOrders: 248,
        abandonedCarts: 681,
        addToCartRate: 6.4,
        checkoutRate: 4.8,
      };

      setSalesData(mockSalesData);
      setTopProducts(mockTopProducts);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Error loading sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-NP").format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getConversionFunnelData = (): ConversionFunnelData[] => {
    const totalSessions = metrics.totalSessions;
    return [
      { name: "Sessions", value: totalSessions, conversion: 100 },
      {
        name: "Add to Cart",
        value: Math.round(totalSessions * (metrics.addToCartRate / 100)),
        conversion: metrics.addToCartRate,
      },
      {
        name: "Reached Checkout",
        value: Math.round(totalSessions * (metrics.checkoutRate / 100)),
        conversion: metrics.checkoutRate,
      },
      {
        name: "Orders",
        value: metrics.totalOrders,
        conversion: metrics.conversionRate,
      },
    ];
  };

  const getOrderStatusData = (): OrderStatusData[] => {
    return [
      {
        status: "Completed",
        count: Math.round(metrics.totalOrders * 0.85),
        color: "#10b981",
      },
      {
        status: "Processing",
        count: Math.round(metrics.totalOrders * 0.1),
        color: "#3b82f6",
      },
      { status: "Draft", count: metrics.draftOrders, color: "#f59e0b" },
      {
        status: "Cancelled",
        count: Math.round(metrics.totalOrders * 0.05),
        color: "#ef4444",
      },
    ];
  };

  return (
    <DashboardLayout title="Sales Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sales Analytics
            </h1>
            <p className="text-gray-600">
              Track your sales performance and revenue metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button
              onClick={loadSalesData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(metrics.revenueGrowth)}
                  <span
                    className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.revenueGrowth)}`}
                  >
                    {metrics.revenueGrowth > 0 ? "+" : ""}
                    {metrics.revenueGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.totalOrders)}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(metrics.orderGrowth)}
                  <span
                    className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.orderGrowth)}`}
                  >
                    {metrics.orderGrowth > 0 ? "+" : ""}
                    {metrics.orderGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.totalCustomers)}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(metrics.customerGrowth)}
                  <span
                    className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.customerGrowth)}`}
                  >
                    {metrics.customerGrowth > 0 ? "+" : ""}
                    {metrics.customerGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Order Value
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.averageOrderValue)}
                </p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium ml-1 text-gray-600">
                    {metrics.conversionRate}% conversion
                  </span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Analytics Chart - Revenue & Orders */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Analytics
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Orders</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  yAxisId="revenue"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Legend />
                <Bar
                  yAxisId="revenue"
                  dataKey="revenue"
                  fill="#3b82f6"
                  name="Revenue"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Orders"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* Online Store Sessions Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Online Store Sessions
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sessions</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
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
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel & Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Online Store Conversion Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Conversion Funnel
              </h3>
              <span className="text-sm text-gray-600">
                Session to purchase journey
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Funnel
                  dataKey="value"
                  data={getConversionFunnelData()}
                  isAnimationActive
                >
                  <LabelList
                    position="center"
                    fill="#fff"
                    fontSize={12}
                    dataKey="conversion"
                    formatter={(value: any) => `${value}%`}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MousePointer className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Add to Cart: {metrics.addToCartRate}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  Checkout: {metrics.checkoutRate}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">
                  Abandoned: {formatNumber(metrics.abandonedCarts)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">
                  Draft Orders: {formatNumber(metrics.draftOrders)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Status Distribution
              </h3>
              <span className="text-sm text-gray-600">
                Current order breakdown
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={getOrderStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getOrderStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatNumber(value), "Orders"]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Orders & Average Order Value */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Orders Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Orders Trend
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
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
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Order Value Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Average Order Value
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">AOV</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
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
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                  formatter={(value: any) => [formatCurrency(value), "AOV"]}
                />
                <Line
                  type="monotone"
                  dataKey="averageOrderValue"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Products
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Sales
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.sales}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getGrowthIcon(product.growth)}
                        <span
                          className={`text-sm font-medium ml-1 ${getGrowthColor(product.growth)}`}
                        >
                          {product.growth > 0 ? "+" : ""}
                          {product.growth}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Rate Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Conversion Rate Trend
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Conversion Rate (%)</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-purple-500 rounded-t w-8 transition-all duration-300 hover:bg-purple-600"
                  style={{ height: `${(data.conversion / 5) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500">
                  {new Date(data.period).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {data.conversion}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
