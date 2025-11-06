import { TabKey } from '../types';

export const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'general', label: 'General', icon: 'Settings' },
  { key: 'contact', label: 'Contact', icon: 'Mail' },
  { key: 'business', label: 'Business', icon: 'Database' },
  { key: 'payment', label: 'Payment', icon: 'CreditCard' },
  { key: 'appearance', label: 'Appearance', icon: 'Palette' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell' },
  { key: 'security', label: 'Security', icon: 'Shield' },
  { key: 'inventory', label: 'Inventory', icon: 'Package' },
  { key: 'seo', label: 'SEO', icon: 'Search' }
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash on Delivery' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'esewa', label: 'eSewa' },
  { value: 'khalti', label: 'Khalti' }
];

export const TIMEZONES = [
  'Asia/Kathmandu',
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo'
];

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ne', label: 'नेपाली (Nepali)' },
  { value: 'hi', label: 'हिन्दी (Hindi)' }
];

export const PASSWORD_POLICIES = [
  { value: 'weak', label: 'Weak' },
  { value: 'medium', label: 'Medium' },
  { value: 'strong', label: 'Strong' }
];

export const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' }
];














