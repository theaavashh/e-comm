'use client';

import { useState, useEffect } from 'react';
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
  Activity
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
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
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export default function SalesAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  });

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    loadSalesData();
  }, [selectedPeriod]);

  const loadSalesData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would fetch from your API
      const mockSalesData: SalesData[] = [
        { period: '2024-01-01', revenue: 25000, orders: 150, customers: 120, conversion: 3.2 },
        { period: '2024-01-02', revenue: 32000, orders: 180, customers: 145, conversion: 3.8 },
        { period: '2024-01-03', revenue: 28000, orders: 165, customers: 130, conversion: 3.5 },
        { period: '2024-01-04', revenue: 35000, orders: 200, customers: 160, conversion: 4.1 },
        { period: '2024-01-05', revenue: 42000, orders: 240, customers: 190, conversion: 4.5 },
        { period: '2024-01-06', revenue: 38000, orders: 220, customers: 175, conversion: 4.2 },
        { period: '2024-01-07', revenue: 45000, orders: 260, customers: 210, conversion: 4.8 }
      ];

      const mockTopProducts: TopProduct[] = [
        { id: '1', name: 'Traditional Handicraft Wooden Bowl Set', sales: 45, revenue: 112500, growth: 12.5 },
        { id: '2', name: 'Brass Puja Thali Set', sales: 38, revenue: 68400, growth: 8.3 },
        { id: '3', name: 'Nepali Musical Instruments', sales: 32, revenue: 96000, growth: 15.2 },
        { id: '4', name: 'Handwoven Pashmina Shawl', sales: 28, revenue: 84000, growth: 6.7 },
        { id: '5', name: 'Rudrakshya Mala Set', sales: 25, revenue: 37500, growth: 9.1 }
      ];

      const mockMetrics: SalesMetrics = {
        totalRevenue: 245000,
        totalOrders: 1415,
        totalCustomers: 1130,
        averageOrderValue: 173.14,
        conversionRate: 4.2,
        revenueGrowth: 15.3,
        orderGrowth: 12.8,
        customerGrowth: 18.5
      };

      setSalesData(mockSalesData);
      setTopProducts(mockTopProducts);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NP').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <DashboardLayout title="Sales Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
            <p className="text-gray-600">Track your sales performance and revenue metrics</p>
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
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(metrics.revenueGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.revenueGrowth)}`}>
                    {metrics.revenueGrowth > 0 ? '+' : ''}{metrics.revenueGrowth}%
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
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalOrders)}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(metrics.orderGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.orderGrowth)}`}>
                    {metrics.orderGrowth > 0 ? '+' : ''}{metrics.orderGrowth}%
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
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalCustomers)}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(metrics.customerGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.customerGrowth)}`}>
                    {metrics.customerGrowth > 0 ? '+' : ''}{metrics.customerGrowth}%
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
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.averageOrderValue)}</p>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div
                    className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(data.revenue / 50000) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {new Date(data.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs font-medium text-gray-900">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div
                    className="bg-green-500 rounded-t w-8 transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(data.orders / 300) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {new Date(data.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs font-medium text-gray-900">
                    {data.orders}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Sales</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.sales}</td>
                    <td className="py-3 px-4 text-gray-600">{formatCurrency(product.revenue)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getGrowthIcon(product.growth)}
                        <span className={`text-sm font-medium ml-1 ${getGrowthColor(product.growth)}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
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
            <h3 className="text-lg font-semibold text-gray-900">Conversion Rate Trend</h3>
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
                  {new Date(data.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
