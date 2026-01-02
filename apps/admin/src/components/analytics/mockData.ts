import {
  AnalyticsData,
  OverviewData,
  TrafficData,
  VisitorData,
  PageData,
  ConversionData,
  RevenueData,
  DeviceData,
  TrafficSourceData,
} from "./types";

// Generate realistic mock data
export function generateMockAnalyticsData(): AnalyticsData {
  const now = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0];
  });

  return {
    overview: {
      totalVisitors: 12458,
      totalPageViews: 45892,
      totalSessions: 8923,
      bounceRate: 32.5,
      avgSessionDuration: 245, // seconds
      conversionRate: 3.2,
      totalRevenue: 89750,
      growthRate: 12.4,
    },
    traffic: last30Days.map((date, index) => ({
      date,
      visitors: Math.floor(300 + Math.random() * 200 + index * 2),
      pageViews: Math.floor(1200 + Math.random() * 400 + index * 8),
      sessions: Math.floor(250 + Math.random() * 150 + index * 1.5),
    })),
    visitors: last30Days.map((date) => ({
      date,
      newVisitors: Math.floor(50 + Math.random() * 100),
      returningVisitors: Math.floor(200 + Math.random() * 150),
    })),
    pages: [
      {
        path: "/",
        title: "Home",
        views: 15420,
        uniqueViews: 8234,
        avgTimeOnPage: 145,
        bounceRate: 28.3,
      },
      {
        path: "/products",
        title: "Products",
        views: 8923,
        uniqueViews: 5432,
        avgTimeOnPage: 234,
        bounceRate: 31.2,
      },
      {
        path: "/products/cultural",
        title: "Cultural Products",
        views: 5632,
        uniqueViews: 3214,
        avgTimeOnPage: 189,
        bounceRate: 29.1,
      },
      {
        path: "/products/carpet",
        title: "Carpet Collection",
        views: 4231,
        uniqueViews: 2456,
        avgTimeOnPage: 267,
        bounceRate: 25.7,
      },
      {
        path: "/about",
        title: "About Us",
        views: 2345,
        uniqueViews: 1823,
        avgTimeOnPage: 89,
        bounceRate: 41.2,
      },
      {
        path: "/contact",
        title: "Contact",
        views: 1876,
        uniqueViews: 1456,
        avgTimeOnPage: 123,
        bounceRate: 35.8,
      },
    ],
    conversion: last30Days.map((date, index) => ({
      date,
      conversions: Math.floor(8 + Math.random() * 12 + index * 0.3),
      revenue: Math.floor(2500 + Math.random() * 1500 + index * 50),
      conversionRate: parseFloat((2.5 + Math.random() * 2).toFixed(1)),
    })),
    revenue: last30Days.map((date, index) => ({
      date,
      revenue: Math.floor(2500 + Math.random() * 2000 + index * 100),
      orders: Math.floor(15 + Math.random() * 25 + index * 0.5),
      avgOrderValue: Math.floor(150 + Math.random() * 100),
    })),
    devices: [
      { device: "Desktop", count: 8923, percentage: 71.6 },
      { device: "Mobile", count: 2876, percentage: 23.1 },
      { device: "Tablet", count: 659, percentage: 5.3 },
    ],
    sources: [
      { source: "Organic Search", visitors: 5234, percentage: 42.0 },
      { source: "Direct", visitors: 3567, percentage: 28.6 },
      { source: "Social Media", visitors: 1876, percentage: 15.1 },
      { source: "Referral", visitors: 1234, percentage: 9.9 },
      { source: "Email", visitors: 547, percentage: 4.4 },
    ],
  };
}
