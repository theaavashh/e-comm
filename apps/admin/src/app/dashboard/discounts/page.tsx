'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  Percent,
  Tag,
  Users,
  DollarSign,
  Eye,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

interface DiscountCoupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableTo: 'all' | 'products' | 'categories';
  applicableItems: string[];
  description: string;
  createdAt: string;
  lastUsed?: string;
}

interface DiscountStats {
  totalCoupons: number;
  activeCoupons: number;
  totalDiscounts: number;
  totalSavings: number;
  mostUsedCoupon: string;
  expiringSoon: number;
}

export default function DiscountsPage() {
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [stats, setStats] = useState<DiscountStats>({
    totalCoupons: 0,
    activeCoupons: 0,
    totalDiscounts: 0,
    totalSavings: 0,
    mostUsedCoupon: '',
    expiringSoon: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DiscountCoupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [newCoupon, setNewCoupon] = useState<Partial<DiscountCoupon>>({
    code: '',
    name: '',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    applicableTo: 'all',
    applicableItems: [],
    description: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would fetch from your API
      const mockCoupons: DiscountCoupon[] = [
        {
          id: '1',
          code: 'WELCOME10',
          name: 'Welcome Discount',
          type: 'percentage',
          value: 10,
          minOrderAmount: 1000,
          maxDiscountAmount: 500,
          usageLimit: 100,
          usedCount: 45,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isActive: true,
          applicableTo: 'all',
          applicableItems: [],
          description: 'Welcome discount for new customers',
          createdAt: '2024-01-01',
          lastUsed: '2024-01-15'
        },
        {
          id: '2',
          code: 'SAVE20',
          name: 'Flash Sale',
          type: 'percentage',
          value: 20,
          minOrderAmount: 2000,
          maxDiscountAmount: 1000,
          usageLimit: 50,
          usedCount: 32,
          startDate: '2024-01-10',
          endDate: '2024-01-20',
          isActive: true,
          applicableTo: 'products',
          applicableItems: ['HC-WB-001', 'PS-TH-002'],
          description: 'Flash sale on selected products',
          createdAt: '2024-01-10',
          lastUsed: '2024-01-18'
        },
        {
          id: '3',
          code: 'FIXED100',
          name: 'Fixed Amount Off',
          type: 'fixed',
          value: 100,
          minOrderAmount: 500,
          usageLimit: 200,
          usedCount: 78,
          startDate: '2024-01-05',
          endDate: '2024-02-05',
          isActive: true,
          applicableTo: 'all',
          applicableItems: [],
          description: 'Fixed amount discount',
          createdAt: '2024-01-05',
          lastUsed: '2024-01-19'
        },
        {
          id: '4',
          code: 'EXPIRED15',
          name: 'Expired Coupon',
          type: 'percentage',
          value: 15,
          minOrderAmount: 1500,
          usageLimit: 30,
          usedCount: 30,
          startDate: '2023-12-01',
          endDate: '2023-12-31',
          isActive: false,
          applicableTo: 'all',
          applicableItems: [],
          description: 'Expired coupon',
          createdAt: '2023-12-01',
          lastUsed: '2023-12-30'
        }
      ];

      const mockStats: DiscountStats = {
        totalCoupons: 4,
        activeCoupons: 3,
        totalDiscounts: 185,
        totalSavings: 125000,
        mostUsedCoupon: 'FIXED100',
        expiringSoon: 1
      };

      setCoupons(mockCoupons);
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon(prev => ({ ...prev, code: result }));
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.name || !newCoupon.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    const coupon: DiscountCoupon = {
      id: Date.now().toString(),
      code: newCoupon.code,
      name: newCoupon.name,
      type: newCoupon.type || 'percentage',
      value: newCoupon.value,
      minOrderAmount: newCoupon.minOrderAmount || 0,
      maxDiscountAmount: newCoupon.maxDiscountAmount || 0,
      usageLimit: newCoupon.usageLimit || 0,
      usedCount: 0,
      startDate: newCoupon.startDate || new Date().toISOString().split('T')[0],
      endDate: newCoupon.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: newCoupon.isActive || true,
      applicableTo: newCoupon.applicableTo || 'all',
      applicableItems: newCoupon.applicableItems || [],
      description: newCoupon.description || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCoupons(prev => [...prev, coupon]);
    setShowCreateModal(false);
    setNewCoupon({
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      applicableTo: 'all',
      applicableItems: [],
      description: ''
    });
    toast.success('Coupon created successfully!');
  };

  const handleEditCoupon = (coupon: DiscountCoupon) => {
    setEditingCoupon(coupon);
  };

  const handleUpdateCoupon = () => {
    if (!editingCoupon) return;

    setCoupons(prev => 
      prev.map(coupon => 
        coupon.id === editingCoupon.id ? editingCoupon : coupon
      )
    );
    setEditingCoupon(null);
    toast.success('Coupon updated successfully!');
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id));
    toast.success('Coupon deleted successfully!');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev => 
      prev.map(coupon => 
        coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
      )
    );
    toast.success('Coupon status updated!');
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard!');
  };

  const getStatusColor = (coupon: DiscountCoupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    
    if (!coupon.isActive) return 'bg-gray-100 text-gray-800';
    if (endDate < now) return 'bg-red-100 text-red-800';
    if (coupon.usedCount >= (coupon.usageLimit || 0)) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (coupon: DiscountCoupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    
    if (!coupon.isActive) return 'Inactive';
    if (endDate < now) return 'Expired';
    if (coupon.usedCount >= (coupon.usageLimit || 0)) return 'Limit Reached';
    return 'Active';
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && coupon.isActive) ||
                         (filterStatus === 'inactive' && !coupon.isActive);
    const matchesType = filterType === 'all' || coupon.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Discount Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Discount Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discount Management</h1>
            <p className="text-gray-600">Create and manage discount coupons and promotions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
                <p className="text-sm text-gray-500">{stats.activeCoupons} active</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Discounts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDiscounts}</p>
                <p className="text-sm text-gray-500">Times used</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSavings)}</p>
                <p className="text-sm text-gray-500">Customer savings</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
                <p className="text-sm text-gray-500">In next 7 days</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Coupon Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Usage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Valid Until</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-black">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCouponCode(coupon.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{coupon.name}</div>
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.type === 'percentage' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      </div>
                      {coupon.minOrderAmount && coupon.minOrderAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          Min: {formatCurrency(coupon.minOrderAmount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {coupon.usedCount} / {coupon.usageLimit || '∞'}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${coupon.usageLimit ? (coupon.usedCount / coupon.usageLimit) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}>
                        {getStatusText(coupon)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleCouponStatus(coupon.id)}
                          className={`${coupon.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                        >
                          {coupon.isActive ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Coupon Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Coupon</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newCoupon.code}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="WELCOME10"
                        />
                        <button
                          onClick={generateCouponCode}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Name *
                      </label>
                      <input
                        type="text"
                        value={newCoupon.name}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Welcome Discount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type *
                      </label>
                      <select
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={newCoupon.value}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, value: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="10"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {newCoupon.type === 'percentage' ? '%' : 'NPR'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Amount
                      </label>
                      <input
                        type="number"
                        value={newCoupon.minOrderAmount}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Discount Amount
                      </label>
                      <input
                        type="number"
                        value={newCoupon.maxDiscountAmount}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, maxDiscountAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        value={newCoupon.usageLimit}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Applicable To
                      </label>
                      <select
                        value={newCoupon.applicableTo}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, applicableTo: e.target.value as 'all' | 'products' | 'categories' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="all">All Products</option>
                        <option value="products">Specific Products</option>
                        <option value="categories">Product Categories</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newCoupon.startDate}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newCoupon.endDate}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Describe the coupon and its benefits"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newCoupon.isActive}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCoupon}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Coupon Modal */}
        {editingCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Coupon</h2>
                  <button
                    onClick={() => setEditingCoupon(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        value={editingCoupon.code}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Name *
                      </label>
                      <input
                        type="text"
                        value={editingCoupon.name}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type *
                      </label>
                      <select
                        value={editingCoupon.type}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, type: e.target.value as 'percentage' | 'fixed' } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={editingCoupon.value}
                          onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, value: Number(e.target.value) } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {editingCoupon.type === 'percentage' ? '%' : 'NPR'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Amount
                      </label>
                      <input
                        type="number"
                        value={editingCoupon.minOrderAmount || 0}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, minOrderAmount: Number(e.target.value) } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Discount Amount
                      </label>
                      <input
                        type="number"
                        value={editingCoupon.maxDiscountAmount || 0}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, maxDiscountAmount: Number(e.target.value) } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        value={editingCoupon.usageLimit || 0}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, usageLimit: Number(e.target.value) } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Applicable To
                      </label>
                      <select
                        value={editingCoupon.applicableTo}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, applicableTo: e.target.value as 'all' | 'products' | 'categories' } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="all">All Products</option>
                        <option value="products">Specific Products</option>
                        <option value="categories">Product Categories</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editingCoupon.startDate}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editingCoupon.endDate}
                        onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingCoupon.description}
                      onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={editingCoupon.isActive}
                      onChange={(e) => setEditingCoupon(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="editIsActive" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingCoupon(null)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCoupon}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
