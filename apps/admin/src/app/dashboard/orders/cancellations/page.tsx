"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreVertical,
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Package,
  RefreshCw,
  Ban,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

interface Cancellation {
  id: string;
  cancellationNumber: string;
  orderNumber: string;
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
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  cancellationReason: string;
  requestedDate: string;
  processedDate?: string;
  completedDate?: string;
  refundAmount?: number;
  refundStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  refundMethod?: string;
  notes?: string;
  adminNotes?: string;
  cancellationType: 'customer' | 'admin' | 'system';
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800'
};

const typeColors = {
  'customer': 'bg-blue-100 text-blue-800',
  'admin': 'bg-purple-100 text-purple-800',
  'system': 'bg-gray-100 text-gray-800'
};

const reasonColors = {
  'changed-mind': 'bg-blue-100 text-blue-800',
  'found-better-price': 'bg-orange-100 text-orange-800',
  'shipping-delay': 'bg-yellow-100 text-yellow-800',
  'product-unavailable': 'bg-red-100 text-red-800',
  'payment-issue': 'bg-purple-100 text-purple-800',
  'duplicate-order': 'bg-gray-100 text-gray-800',
  'other': 'bg-gray-100 text-gray-800'
};

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [filteredCancellations, setFilteredCancellations] = useState<Cancellation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCancellations, setSelectedCancellations] = useState<string[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCancellations: Cancellation[] = [
      {
        id: '1',
        cancellationNumber: 'CAN-2024-001',
        orderNumber: 'ORD-2024-001',
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
        total: 2500,
        status: 'approved',
        cancellationReason: 'Customer changed mind - no longer needed',
        requestedDate: '2024-01-20',
        processedDate: '2024-01-21',
        completedDate: '2024-01-22',
        refundAmount: 2500,
        refundStatus: 'completed',
        refundMethod: 'Credit Card',
        cancellationType: 'customer',
        adminNotes: 'Customer provided valid reason for cancellation'
      },
      {
        id: '2',
        cancellationNumber: 'CAN-2024-002',
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
        total: 1600,
        status: 'pending',
        cancellationReason: 'Found better price elsewhere',
        requestedDate: '2024-01-22',
        cancellationType: 'customer'
      },
      {
        id: '3',
        cancellationNumber: 'CAN-2024-003',
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
        total: 1200,
        status: 'rejected',
        cancellationReason: 'Product out of stock - cannot fulfill',
        requestedDate: '2024-01-19',
        processedDate: '2024-01-20',
        cancellationType: 'admin',
        adminNotes: 'Product is back in stock, order can be fulfilled'
      }
    ];

    setCancellations(mockCancellations);
    setFilteredCancellations(mockCancellations);
    setIsLoading(false);
  }, []);

  // Filter cancellations based on search and filters
  useEffect(() => {
    let filtered = cancellations;

    if (searchTerm) {
      filtered = filtered.filter(cancellation =>
        cancellation.cancellationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancellation.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancellation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancellation.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cancellation => cancellation.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(cancellation => cancellation.cancellationType === typeFilter);
    }

    if (reasonFilter !== 'all') {
      // This would need to be implemented based on how reasons are stored
      // For now, we'll filter by the first part of the reason string
      filtered = filtered.filter(cancellation => {
        const reason = cancellation.cancellationReason.toLowerCase();
        return reason.includes(reasonFilter);
      });
    }

    setFilteredCancellations(filtered);
  }, [cancellations, searchTerm, statusFilter, typeFilter, reasonFilter]);

  const handleSelectCancellation = (cancellationId: string) => {
    setSelectedCancellations(prev =>
      prev.includes(cancellationId)
        ? prev.filter(id => id !== cancellationId)
        : [...prev, cancellationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCancellations.length === filteredCancellations.length) {
      setSelectedCancellations([]);
    } else {
      setSelectedCancellations(filteredCancellations.map(cancellation => cancellation.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on cancellations:`, selectedCancellations);
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
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'customer': 'Customer Requested',
      'admin': 'Admin Cancelled',
      'system': 'System Cancelled'
    };
    return typeMap[type] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customer': return <User className="w-4 h-4" />;
      case 'admin': return <Ban className="w-4 h-4" />;
      case 'system': return <AlertCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Cancellations">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Cancellations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cancellations</h1>
            <p className="text-gray-600 mt-1">
              Manage order cancellations and refunds
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
                    {cancellations.filter(c => c.status === 'pending').length}
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
                    Approved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cancellations.filter(c => c.status === 'approved').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejected
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cancellations.filter(c => c.status === 'rejected').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Cancelled
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cancellations.length}
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
                  placeholder="Search cancellations..."
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
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="customer">Customer Requested</option>
                    <option value="admin">Admin Cancelled</option>
                    <option value="system">System Cancelled</option>
                  </select>

                  <select
                    value={reasonFilter}
                    onChange={(e) => setReasonFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Reasons</option>
                    <option value="changed-mind">Changed Mind</option>
                    <option value="found-better-price">Found Better Price</option>
                    <option value="shipping-delay">Shipping Delay</option>
                    <option value="product-unavailable">Product Unavailable</option>
                    <option value="payment-issue">Payment Issue</option>
                    <option value="duplicate-order">Duplicate Order</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCancellations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedCancellations.length} cancellation(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject Selected
                </button>
                <button
                  onClick={() => setSelectedCancellations([])}
                  className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCancellations.length === filteredCancellations.length && filteredCancellations.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cancellation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refund Amount
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
                {filteredCancellations.map((cancellation) => (
                  <tr key={cancellation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCancellations.includes(cancellation.id)}
                        onChange={() => handleSelectCancellation(cancellation.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cancellation.cancellationNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cancellation.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cancellation.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cancellation.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[cancellation.cancellationType]}`}>
                        {getTypeIcon(cancellation.cancellationType)}
                        <span className="ml-1">{getTypeText(cancellation.cancellationType)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[cancellation.status]}`}>
                        {getStatusIcon(cancellation.status)}
                        <span className="ml-1 capitalize">{cancellation.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cancellation.refundAmount ? formatPrice(cancellation.refundAmount) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cancellation.requestedDate)}
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

          {filteredCancellations.length === 0 && (
            <div className="text-center py-12">
              <XCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cancellations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || reasonFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Cancellations will appear here when they are requested.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCancellations.length > 0 && (
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
                  <span className="font-medium">{filteredCancellations.length}</span> results
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




