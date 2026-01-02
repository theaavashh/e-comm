import React from 'react';
import { BarChart, Users, TrendingUp } from 'lucide-react';

export default function FacebookPixelReport() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Facebook Pixel Report</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add to Cart</h3>
              <p className="text-3xl font-bold text-blue-600">1,240</p>
              <p className="text-sm text-green-600 mt-1">↑ 5.2% from last week</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initiate Checkout</h3>
              <p className="text-3xl font-bold text-green-600">890</p>
              <p className="text-sm text-green-600 mt-1">↑ 3.8% from last week</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase</h3>
              <p className="text-3xl font-bold text-purple-600">420</p>
              <p className="text-sm text-green-600 mt-1">↑ 7.1% from last week</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-orange-600">4.7%</p>
              <p className="text-sm text-green-600 mt-1">↑ 0.8% from last week</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Summer Sale 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45,200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">128,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3,240</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.52%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">180</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">New Arrivals</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32,100</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">89,400</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,150</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.41%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Flash Sale</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18,700</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">52,300</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,890</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3.61%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">125</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Top Demographics</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">25-34 years</span>
                    <span className="font-medium">38%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">35-44 years</span>
                    <span className="font-medium">26%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">18-24 years</span>
                    <span className="font-medium">19%</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Top Interests</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Technology</span>
                    <span className="font-medium">42%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fashion</span>
                    <span className="font-medium">31%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Home & Garden</span>
                    <span className="font-medium">22%</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Devices</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Mobile</span>
                    <span className="font-medium">58%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Desktop</span>
                    <span className="font-medium">35%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Tablet</span>
                    <span className="font-medium">7%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}