"use client";

import { useState } from "react";
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Phone, 
  Mail,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  FileText,
  RotateCcw,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // Replace with proper Order type
  type: 'order' | 'return' | 'refund' | 'cancellation';
}

export default function OrderDetailsModal({ isOpen, onClose, order, type }: OrderDetailsModalProps) {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'returned': return <RotateCcw className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {type === 'order' && 'Order Details'}
                    {type === 'return' && 'Return Details'}
                    {type === 'refund' && 'Refund Details'}
                    {type === 'cancellation' && 'Cancellation Details'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.orderNumber || order.returnNumber || order.refundNumber || order.cancellationNumber}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-sm text-gray-900">{order.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {order.customer.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {order.customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      {type === 'order' ? 'Order Information' : 'Details'}
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date</label>
                          <p className="text-sm text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.orderDate || order.requestedDate || order.returnDate)}
                          </p>
                        </div>
                      </div>
                      
                      {order.paymentStatus && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Payment Status</label>
                          <p className="text-sm text-gray-900 capitalize">{order.paymentStatus}</p>
                        </div>
                      )}
                      
                      {order.paymentMethod && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Payment Method</label>
                          <p className="text-sm text-gray-900 flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            {order.paymentMethod}
                          </p>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tracking Number</label>
                          <p className="text-sm text-gray-900">{order.trackingNumber}</p>
                        </div>
                      )}

                      {order.carrier && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Carrier</label>
                          <p className="text-sm text-gray-900">{order.carrier}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Items
                    </h3>
                    <div className="space-y-3">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                              {item.reason && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Reason: <span className="capitalize">{item.reason}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Financial Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Total Amount</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total || order.originalAmount || order.refundAmount)}
                        </span>
                      </div>
                      
                      {order.refundAmount && order.refundAmount !== order.total && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Refund Amount</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(order.refundAmount)}
                          </span>
                        </div>
                      )}
                      
                      {order.fees && order.fees > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Fees</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(order.fees)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Shipping Address
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-900">{order.shippingAddress.street}</p>
                        <p className="text-sm text-gray-900">
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p className="text-sm text-gray-900">{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {(order.notes || order.adminNotes) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {order.notes && (
                          <div className="mb-3">
                            <label className="text-sm font-medium text-gray-500">Customer Notes</label>
                            <p className="text-sm text-gray-900 mt-1">{order.notes}</p>
                          </div>
                        )}
                        {order.adminNotes && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Admin Notes</label>
                            <p className="text-sm text-gray-900 mt-1">{order.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  {(order.returnReason || order.cancellationReason || order.refundReason) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Reason</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-900">
                          {order.returnReason || order.cancellationReason || order.refundReason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                  Process
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}




