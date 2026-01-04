import React, { useState, useEffect } from "react";
import { ShoppingBag, Calendar, User, TrendingUp } from "lucide-react";

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: {
      name: string;
      thumbnail?: string;
    };
    quantity: number;
  }>;
}

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orders/recent?limit=5`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 custom-font flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-purple-600" />
            Recent Orders
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 custom-font flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-purple-600" />
          Recent Orders
        </h3>
        <span className="text-xs text-gray-500 custom-font">Last 5 orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 custom-font">No recent orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 custom-font">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 custom-font mb-1">
                    {order.user.firstName} {order.user.lastName}
                  </div>
                  <div className="text-xs text-gray-500 custom-font">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 custom-font">
                    {order.currency} {order.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 custom-font flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
