// Mock analytics data types
export interface AnalyticsData {
  overview: OverviewData;
  traffic: TrafficData[];
  visitors: VisitorData[];
  pages: PageData[];
  conversion: ConversionData[];
  revenue: RevenueData[];
  devices: DeviceData[];
  sources: TrafficSourceData[];
}

export interface OverviewData {
  totalVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  totalRevenue: number;
  growthRate: number;
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
}

export interface VisitorData {
  date: string;
  newVisitors: number;
  returningVisitors: number;
}

export interface PageData {
  path: string;
  title: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface ConversionData {
  date: string;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

export interface TrafficSourceData {
  source: string;
  visitors: number;
  percentage: number;
}
