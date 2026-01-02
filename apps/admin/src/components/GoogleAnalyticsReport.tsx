import React from 'react';
import { BarChart, Users, TrendingUp } from 'lucide-react';

export default function GoogleAnalyticsReport() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Google Analytics Report</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">42,890</p>
              <p className="text-sm text-green-600 mt-1">↑ 12.4% from last month</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessions</h3>
              <p className="text-3xl font-bold text-green-600">68,420</p>
              <p className="text-sm text-green-600 mt-1">↑ 8.2% from last month</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bounce Rate</h3>
              <p className="text-3xl font-bold text-purple-600">32.4%</p>
              <p className="text-sm text-red-600 mt-1">↓ 3.1% from last month</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Organic Search</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-gray-900 font-medium">65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Direct</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-gray-900 font-medium">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Social Media</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-gray-900 font-medium">10%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">/products</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12,450</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2m 34s</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">/categories/electronics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8,760</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3m 12s</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">/checkout</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">6,890</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1m 45s</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">42%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}