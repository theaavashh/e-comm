import React, { useState, useEffect } from "react";
import { Activity, User, Package, Settings, ShoppingCart } from "lucide-react";

interface RecentActivity {
  id: string;
  type: string;
  action: string;
  description: string;
  entityId?: string;
  entityType?: string;
  metadata?: any;
  userId?: string;
  createdAt: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/activities/recent?limit=10`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "ORDER_CREATED":
      case "ORDER_UPDATED":
      case "ORDER_CANCELLED":
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case "PRODUCT_CREATED":
      case "PRODUCT_UPDATED":
      case "PRODUCT_DELETED":
        return <Package className="w-4 h-4 text-green-600" />;
      case "USER_REGISTERED":
      case "USER_UPDATED":
        return <User className="w-4 h-4 text-purple-600" />;
      case "CREATE":
      case "UPDATE":
      case "DELETE":
        return <Settings className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes("create")) {
      return "text-green-600";
    } else if (
      action.toLowerCase().includes("delete") ||
      action.toLowerCase().includes("cancel")
    ) {
      return "text-red-600";
    } else if (action.toLowerCase().includes("update")) {
      return "text-blue-600";
    }
    return "text-gray-600";
  };

  const formatDescription = (activity: RecentActivity) => {
    if (activity.entityType && activity.entityId) {
      return activity.description;
    }
    return activity.action;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 custom-font flex items-center">
            <Activity className="w-5 h-5 mr-2 text-orange-600" />
            Recent Activity
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
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
          <Activity className="w-5 h-5 mr-2 text-orange-600" />
          Recent Activity
        </h3>
        <span className="text-xs text-gray-500 custom-font">
          Last 10 activities
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 custom-font">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 custom-font truncate">
                  {formatDescription(activity)}
                </p>
                <p
                  className={`text-xs ${getActionColor(activity.action)} custom-font`}
                >
                  {activity.action}
                </p>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500 custom-font">
                {formatDate(activity.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
