"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreVertical,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  User,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

interface Refund {
  id: string;
  refundNumber: string;
  orderNumber: string;
  returnNumber?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  originalAmount: number;
  refundAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  refundMethod: 'credit-card' | 'bank-transfer' | 'wallet' | 'cash';
  refundReason: string;
  requestedDate: string;
  processedDate?: string;
  completedDate?: string;
  transactionId?: string;
  notes?: string;
  fees?: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const methodColors = {
  'credit-card': 'bg-blue-100 text-blue-800',
  'bank-transfer': 'bg-green-100 text-green-800',
  'wallet': 'bg-purple-100 text-purple-800',
  'cash': 'bg-gray-100 text-gray-800'
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRefunds: Refund[] = [
      {
        id: '1',
        refundNumber: 'REF-2024-001',
        orderNumber: 'ORD-2024-001',
        returnNumber: 'RET-2024-001',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+977-9841234567'
        },
        items: [
          {
            id: '1',
            name: 'Wireless Headphones',
            quantity: 1,
            price: 2500,
            image: '/placeholder-product.jpg'
          }
        ],
        originalAmount: 2500,
        refundAmount: 2500,
        status: 'completed',
        refundMethod: 'credit-card',
        refundReason: 'Product defect - full refund processed',
        requestedDate: '2024-01-20',
        processedDate: '2024-01-21',
        completedDate: '2024-01-22',
        transactionId: 'TXN123456789',
        fees: 0
      },
      {
        id: '2',
        refundNumber: 'REF-2024-002',
        orderNumber: 'ORD-2024-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+977-9841234568'
        },
        items: [
          {
            id: '2',
            name: 'Smartphone Case',
            quantity: 2,
            price: 800,
            image: '/placeholder-product.jpg'
          }
        ],
        originalAmount: 1600,
        refundAmount: 1600,
        status: 'processing',
        refundMethod: 'bank-transfer',
        refundReason: 'Customer requested refund - processing',
        requestedDate: '2024-01-22',
        processedDate: '2024-01-23',
        fees: 25
      },
      {
        id: '3',
        refundNumber: 'REF-2024-003',
        orderNumber: 'ORD-2024-003',
        customer: {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+977-9841234569'
        },
        items: [
          {
            id: '3',
            name: 'Laptop Stand',
            quantity: 1,
            price: 1200,
            image: '/placeholder-product.jpg'
          }
        ],
        originalAmount: 1200,
        refundAmount: 1000,
        status: 'pending',
        refundMethod: 'wallet',
        refundReason: 'Partial refund due to restocking fee',
        requestedDate: '2024-01-24',
        fees: 200
      }
    ];

    setRefunds(mockRefunds);
    setFilteredRefunds(mockRefunds);
    setIsLoading(false);
  }, []);

  // Filter refunds based on search and filters
  useEffect(() => {
    let filtered = refunds;

    if (searchTerm) {
      filtered = filtered.filter(refund =>
        refund.refundNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(refund => refund.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(refund => refund.refundMethod === methodFilter);
    }

    setFilteredRefunds(filtered);
  }, [refunds, searchTerm, statusFilter, methodFilter]);

  const handleSelectRefund = (refundId: string) => {
    setSelectedRefunds(prev =>
      prev.includes(refundId)
        ? prev.filter(id => id !== refundId)
        : [...prev, refundId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRefunds.length === filteredRefunds.length) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(filteredRefunds.map(refund => refund.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on refunds:`, selectedRefunds);
    // Implement bulk actions
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'credit-card': 'Credit Card',
      'bank-transfer': 'Bank Transfer',
      'wallet': 'Digital Wallet',
      'cash': 'Cash'
    };
    return methodMap[method] || method;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit-card': return <CreditCard className="w-4 h-4" />;
      case 'bank-transfer': return <Banknote className="w-4 h-4" />;
      case 'wallet': return <DollarSign className="w-4 h-4" />;
      case 'cash': return <DollarSign className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Refunds">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Refunds">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Refunds</h1>
            <p className="text-gray-600 mt-1">
              Manage customer refunds and payment reversals
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {refunds.filter(r => r.status === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Processing
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {refunds.filter(r => r.status === 'processing').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {refunds.filter(r => r.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Refunded
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatPrice(refunds.reduce((sum, r) => sum + (r.status === 'completed' ? r.refundAmount : 0), 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search refunds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-4"
                >
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Methods</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="wallet">Digital Wallet</option>
                    <option value="cash">Cash</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRefunds.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRefunds.length} refund(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('process')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Process Selected
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Export Selected
                </button>
                <button
                  onClick={() => setSelectedRefunds([])}
                  className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refunds Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRefunds.length === filteredRefunds.length && filteredRefunds.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refund
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRefunds.includes(refund.id)}
                        onChange={() => handleSelectRefund(refund.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {refund.refundNumber}
                      </div>
                      {refund.transactionId && (
                        <div className="text-sm text-gray-500">
                          {refund.transactionId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {refund.orderNumber}
                      </div>
                      {refund.returnNumber && (
                        <div className="text-sm text-gray-500">
                          {refund.returnNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {refund.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {refund.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(refund.refundAmount)}
                        </div>
                        {refund.fees && refund.fees > 0 && (
                          <div className="text-sm text-gray-500">
                            Fee: {formatPrice(refund.fees)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodColors[refund.refundMethod]}`}>
                        {getMethodIcon(refund.refundMethod)}
                        <span className="ml-1">{getMethodText(refund.refundMethod)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[refund.status]}`}>
                        {getStatusIcon(refund.status)}
                        <span className="ml-1 capitalize">{refund.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(refund.requestedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRefunds.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No refunds found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Refunds will appear here when they are processed.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredRefunds.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">{filteredRefunds.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}




