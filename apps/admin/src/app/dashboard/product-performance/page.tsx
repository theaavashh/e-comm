'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Star, 
  Eye, 
  ShoppingCart, 
  Heart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  sales: number;
  revenue: number;
  views: number;
  conversion: number;
  rating: number;
  reviews: number;
  stock: number;
  growth: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  lastUpdated: string;
}

interface CategoryPerformance {
  category: string;
  products: number;
  revenue: number;
  growth: number;
  avgRating: number;
}

interface PerformanceMetrics {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  avgConversion: number;
  avgRating: number;
  totalViews: number;
  outOfStock: number;
  topPerformer: string;
  worstPerformer: string;
}

export default function ProductPerformancePage() {
  const [products, setProducts] = useState<ProductPerformance[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryPerformance[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    avgConversion: 0,
    avgRating: 0,
    totalViews: 0,
    outOfStock: 0,
    topPerformer: '',
    worstPerformer: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    loadProductData();
  }, [selectedPeriod]);

  const loadProductData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would fetch from your API
      const mockProducts: ProductPerformance[] = [
        {
          id: '1',
          name: 'Traditional Handicraft Wooden Bowl Set',
          category: 'Handicrafts',
          sku: 'HC-WB-001',
          price: 2500,
          sales: 45,
          revenue: 112500,
          views: 1250,
          conversion: 3.6,
          rating: 4.8,
          reviews: 124,
          stock: 15,
          growth: 12.5,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
          lastUpdated: '2024-01-15'
        },
        {
          id: '2',
          name: 'Brass Puja Thali Set',
          category: 'Puja Samagri',
          sku: 'PS-TH-002',
          price: 1800,
          sales: 38,
          revenue: 68400,
          views: 980,
          conversion: 3.9,
          rating: 4.6,
          reviews: 89,
          stock: 8,
          growth: 8.3,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop',
          lastUpdated: '2024-01-14'
        },
        {
          id: '3',
          name: 'Nepali Musical Instruments Collection',
          category: 'Musical Instruments',
          sku: 'MI-NC-003',
          price: 3000,
          sales: 32,
          revenue: 96000,
          views: 1100,
          conversion: 2.9,
          rating: 4.9,
          reviews: 156,
          stock: 0,
          growth: 15.2,
          status: 'out-of-stock',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
          lastUpdated: '2024-01-13'
        },
        {
          id: '4',
          name: 'Handwoven Pashmina Shawl',
          category: 'Handicrafts',
          sku: 'HC-PS-004',
          price: 3000,
          sales: 28,
          revenue: 84000,
          views: 850,
          conversion: 3.3,
          rating: 4.7,
          reviews: 67,
          stock: 12,
          growth: 6.7,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=100&h=100&fit=crop',
          lastUpdated: '2024-01-12'
        },
        {
          id: '5',
          name: 'Rudrakshya Mala Set',
          category: 'Puja Samagri',
          sku: 'PS-RM-005',
          price: 1500,
          sales: 25,
          revenue: 37500,
          views: 720,
          conversion: 3.5,
          rating: 4.5,
          reviews: 43,
          stock: 20,
          growth: 9.1,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
          lastUpdated: '2024-01-11'
        },
        {
          id: '6',
          name: 'Traditional Nepali Tea Set',
          category: 'Foods',
          sku: 'FD-TS-006',
          price: 800,
          sales: 18,
          revenue: 14400,
          views: 450,
          conversion: 4.0,
          rating: 4.3,
          reviews: 28,
          stock: 5,
          growth: -2.1,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop',
          lastUpdated: '2024-01-10'
        }
      ];

      const mockCategoryData: CategoryPerformance[] = [
        { category: 'Handicrafts', products: 2, revenue: 196500, growth: 9.6, avgRating: 4.75 },
        { category: 'Puja Samagri', products: 2, revenue: 105900, growth: 8.7, avgRating: 4.55 },
        { category: 'Musical Instruments', products: 1, revenue: 96000, growth: 15.2, avgRating: 4.9 },
        { category: 'Foods', products: 1, revenue: 14400, growth: -2.1, avgRating: 4.3 }
      ];

      const mockMetrics: PerformanceMetrics = {
        totalProducts: 6,
        activeProducts: 5,
        totalRevenue: 412800,
        avgConversion: 3.5,
        avgRating: 4.6,
        totalViews: 5350,
        outOfStock: 1,
        topPerformer: 'Traditional Handicraft Wooden Bowl Set',
        worstPerformer: 'Traditional Nepali Tea Set'
      };

      setProducts(mockProducts);
      setCategoryData(mockCategoryData);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || product.category === selectedCategory)
    )
    .sort((a, b) => {
      const aValue = a[sortBy as keyof ProductPerformance] as number;
      const bValue = b[sortBy as keyof ProductPerformance] as number;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <DashboardLayout title="Product Performance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Performance</h1>
            <p className="text-gray-600">Analyze product sales, views, and conversion metrics</p>
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
              onClick={loadProductData}
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
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
                <p className="text-sm text-gray-500">{metrics.activeProducts} active</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                <p className="text-sm text-gray-500">All products</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.avgConversion}%</p>
                <p className="text-sm text-gray-500">Across all products</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.avgRating}</p>
                <p className="text-sm text-gray-500">Customer satisfaction</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryData.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium">{category.products}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth:</span>
                    <div className="flex items-center">
                      {getGrowthIcon(category.growth)}
                      <span className={`ml-1 font-medium ${getGrowthColor(category.growth)}`}>
                        {category.growth > 0 ? '+' : ''}{category.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="font-medium">{category.avgRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="revenue">Revenue</option>
                <option value="sales">Sales</option>
                <option value="views">Views</option>
                <option value="conversion">Conversion</option>
                <option value="rating">Rating</option>
                <option value="growth">Growth</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Sales</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Conversion</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Growth</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-gray-600">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4 text-gray-600">{product.sales}</td>
                    <td className="py-3 px-4 text-gray-600">{formatCurrency(product.revenue)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatNumber(product.views)}</td>
                    <td className="py-3 px-4 text-gray-600">{product.conversion}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-gray-600">{product.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getGrowthIcon(product.growth)}
                        <span className={`text-sm font-medium ml-1 ${getGrowthColor(product.growth)}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Best Seller</p>
                  <p className="text-sm text-gray-600">{metrics.topPerformer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+12.5%</p>
                  <p className="text-xs text-gray-500">Growth</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Needs Attention</p>
                  <p className="text-sm text-gray-600">{metrics.worstPerformer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">-2.1%</p>
                  <p className="text-xs text-gray-500">Growth</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Views</span>
                <span className="font-medium">{formatNumber(metrics.totalViews)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-medium text-red-600">{metrics.outOfStock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Products</span>
                <span className="font-medium text-green-600">{metrics.activeProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Reviews</span>
                <span className="font-medium">{Math.round(products.reduce((acc, p) => acc + p.reviews, 0) / products.length)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
