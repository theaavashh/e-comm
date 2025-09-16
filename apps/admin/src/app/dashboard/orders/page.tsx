'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would fetch from your API
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customer: {
            name: 'Aavash Shrestha',
            email: 'sthaaavash@email.com',
            phone: '+977-98-1234-5678'
          },
          items: [
            {
              id: '1',
              name: 'Traditional Handicraft Wooden Bowl Set',
              quantity: 2,
              price: 2500,
              image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop'
            },
            {
              id: '2',
              name: 'Brass Puja Thali Set',
              quantity: 1,
              price: 1800,
              image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop'
            }
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'Kathmandu',
            state: 'Bagmati',
            zipCode: '44600',
            country: 'Nepal'
          },
          billingAddress: {
            street: '123 Main Street',
            city: 'Kathmandu',
            state: 'Bagmati',
            zipCode: '44600',
            country: 'Nepal'
          },
          payment: {
            method: 'Credit Card',
            status: 'Paid',
            transactionId: 'TXN-123456789'
          },
          status: 'processing',
          total: 6800,
          subtotal: 6800,
          shipping: 0,
          tax: 0,
          discount: 0,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          notes: 'Handle with care - fragile items'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customer: {
            name: 'Tic Tac',
            email: 'tictac@email.com',
            phone: '+977-98-8765-4321'
          },
          items: [
            {
              id: '3',
              name: 'Nepali Musical Instruments Collection',
              quantity: 1,
              price: 3000,
              image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
            }
          ],
          shippingAddress: {
            street: '456 Oak Avenue',
            city: 'Pokhara',
            state: 'Gandaki',
            zipCode: '33700',
            country: 'Nepal'
          },
          billingAddress: {
            street: '456 Oak Avenue',
            city: 'Pokhara',
            state: 'Gandaki',
            zipCode: '33700',
            country: 'Nepal'
          },
          payment: {
            method: 'Bank Transfer',
            status: 'Pending',
            transactionId: 'TXN-987654321'
          },
          status: 'pending',
          total: 3000,
          subtotal: 3000,
          shipping: 0,
          tax: 0,
          discount: 0,
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customer: {
            name: 'lorem100',
            email: '100thelorem@email.com',
            phone: '+977-98-5555-1234'
          },
          items: [
            {
              id: '4',
              name: 'Handwoven Pashmina Shawl',
              quantity: 3,
              price: 3000,
              image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=100&h=100&fit=crop'
            }
          ],
          shippingAddress: {
            street: '789 Pine Street',
            city: 'Lalitpur',
            state: 'Bagmati',
            zipCode: '44700',
            country: 'Nepal'
          },
          billingAddress: {
            street: '789 Pine Street',
            city: 'Lalitpur',
            state: 'Bagmati',
            zipCode: '44700',
            country: 'Nepal'
          },
          payment: {
            method: 'Digital Wallet',
            status: 'Paid',
            transactionId: 'TXN-456789123'
          },
          status: 'shipped',
          total: 9000,
          subtotal: 9000,
          shipping: 0,
          tax: 0,
          discount: 0,
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-16T11:30:00Z'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          customer: {
            name: 'Sarah Khadka',
            email: 'sarah.khadka@email.com',
            phone: '+977-98-7777-8888'
          },
          items: [
            {
              id: '5',
              name: 'Rudrakshya Mala Set',
              quantity: 1,
              price: 1500,
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
            }
          ],
          shippingAddress: {
            street: '321 Elm Street',
            city: 'Bhaktapur',
            state: 'Bagmati',
            zipCode: '44800',
            country: 'Nepal'
          },
          billingAddress: {
            street: '321 Elm Street',
            city: 'Bhaktapur',
            state: 'Bagmati',
            zipCode: '44800',
            country: 'Nepal'
          },
          payment: {
            method: 'Credit Card',
            status: 'Paid',
            transactionId: 'TXN-789123456'
          },
          status: 'delivered',
          total: 1500,
          subtotal: 1500,
          shipping: 0,
          tax: 0,
          discount: 0,
          createdAt: '2024-01-10T16:45:00Z',
          updatedAt: '2024-01-12T14:20:00Z'
        },
        {
          id: '5',
          orderNumber: 'ORD-2024-005',
          customer: {
            name: 'David Prajapati',
            email: 'prajapatidav@email.com',
            phone: '+977-98-9999-0000'
          },
          items: [
            {
              id: '6',
              name: 'Traditional Nepali Tea Set',
              quantity: 2,
              price: 800,
              image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop'
            }
          ],
          shippingAddress: {
            street: '654 Maple Drive',
            city: 'Chitwan',
            state: 'Narayani',
            zipCode: '44200',
            country: 'Nepal'
          },
          billingAddress: {
            street: '654 Maple Drive',
            city: 'Chitwan',
            state: 'Narayani',
            zipCode: '44200',
            country: 'Nepal'
          },
          payment: {
            method: 'Cash on Delivery',
            status: 'Pending',
            transactionId: 'COD-123456'
          },
          status: 'cancelled',
          total: 1600,
          subtotal: 1600,
          shipping: 0,
          tax: 0,
          discount: 0,
          createdAt: '2024-01-08T12:30:00Z',
          updatedAt: '2024-01-09T10:15:00Z',
          notes: 'Customer requested cancellation'
        }
      ];

      const mockStats: OrderStats = {
        totalOrders: 5,
        pendingOrders: 1,
        processingOrders: 1,
        shippedOrders: 1,
        deliveredOrders: 1,
        cancelledOrders: 1,
        totalRevenue: 21900,
        averageOrderValue: 4380
      };

      setOrders(mockOrders);
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast.success(`Order status updated to ${newStatus}!`);
  };

  const getStatusChangeOptions = (currentStatus: Order['status']) => {
    switch (currentStatus) {
      case 'pending':
        return [
          { value: 'confirmed', label: 'Confirm Order', color: 'bg-blue-100 text-blue-800' },
          { value: 'processing', label: 'Start Processing', color: 'bg-purple-100 text-purple-800' },
          { value: 'cancelled', label: 'Cancel Order', color: 'bg-red-100 text-red-800' }
        ];
      case 'confirmed':
        return [
          { value: 'processing', label: 'Start Processing', color: 'bg-purple-100 text-purple-800' },
          { value: 'cancelled', label: 'Cancel Order', color: 'bg-red-100 text-red-800' }
        ];
      case 'processing':
        return [
          { value: 'shipped', label: 'Mark as Shipped', color: 'bg-indigo-100 text-indigo-800' },
          { value: 'cancelled', label: 'Cancel Order', color: 'bg-red-100 text-red-800' }
        ];
      case 'shipped':
        return [
          { value: 'delivered', label: 'Mark as Delivered', color: 'bg-green-100 text-green-800' }
        ];
      case 'delivered':
        return [
          { value: 'refunded', label: 'Process Refund', color: 'bg-gray-100 text-gray-800' }
        ];
      case 'cancelled':
        return [
          { value: 'refunded', label: 'Process Refund', color: 'bg-gray-100 text-gray-800' }
        ];
      default:
        return [];
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Orders">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadOrders}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-gray-500">All time</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                <p className="text-sm text-gray-500">Awaiting confirmation</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processingOrders}</p>
                <p className="text-sm text-gray-500">Being prepared</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-gray-500">All orders</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-green-600" />
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
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">ID: {order.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                        <div className="text-sm text-gray-500">{order.customer.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <img
                              key={index}
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{formatCurrency(order.total)}</div>
                      {order.discount > 0 && (
                        <div className="text-sm text-green-600">-{formatCurrency(order.discount)} discount</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="text-sm">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="text-gray-400 hover:text-gray-600" title="Change Status">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px]">
                            {getStatusChangeOptions(order.status).map((option) => (
                              <button
                                key={option.value}
                                onClick={() => updateOrderStatus(order.id, option.value as Order['status'])}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${option.color}`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Order Details - {selectedOrder.orderNumber}</h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Number:</span>
                          <span className="font-medium">{selectedOrder.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updated:</span>
                          <span className="font-medium">{formatDate(selectedOrder.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{selectedOrder.customer.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{selectedOrder.customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{selectedOrder.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Payment Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium">{selectedOrder.payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">{selectedOrder.payment.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-medium">{selectedOrder.payment.transactionId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items & Addresses */}
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div>{selectedOrder.shippingAddress.street}</div>
                            <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</div>
                            <div>{selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span className="font-medium">-{formatCurrency(selectedOrder.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-semibold border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Order Notes</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Change Status:</span>
                    {getStatusChangeOptions(selectedOrder.status).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, option.value as Order['status']);
                          setShowOrderModal(false);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${option.color} hover:opacity-80`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}