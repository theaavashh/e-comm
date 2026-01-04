import React, { useState, useEffect } from "react";
import { Mail, MailOpen, Clock, CheckCircle, Archive } from "lucide-react";

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  createdAt: string;
  adminReply?: string;
  repliedAt?: string;
}

const RecentMessages: React.FC = () => {
  const [messages, setMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  const fetchRecentMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contacts/recent?limit=5`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UNREAD":
        return <Mail className="w-4 h-4 text-red-500" />;
      case "READ":
        return <MailOpen className="w-4 h-4 text-blue-500" />;
      case "REPLIED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "ARCHIVED":
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "bg-red-100 text-red-800";
      case "READ":
        return "bg-blue-100 text-blue-800";
      case "REPLIED":
        return "bg-green-100 text-green-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "NORMAL":
        return "bg-blue-500";
      case "LOW":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
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
            <Mail className="w-5 h-5 mr-2 text-blue-600" />
            Recent Messages
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <Mail className="w-5 h-5 mr-2 text-blue-600" />
          Recent Messages
        </h3>
        <span className="text-xs text-gray-500 custom-font">
          Last 5 messages
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 custom-font">No recent messages</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="border-l-4 border-gray-200 pl-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 custom-font truncate">
                      {message.subject}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        message.status,
                      )}`}
                    >
                      {message.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 custom-font mb-1">
                    {message.name}
                  </div>
                  <div className="text-xs text-gray-500 custom-font truncate">
                    {message.email}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center text-xs text-gray-500 custom-font">
                    {getStatusIcon(message.status)}
                    <span className="ml-1">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 custom-font mt-2 line-clamp-2">
                {message.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentMessages;
