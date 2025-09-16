# Admin Dashboard Layout Guide

This guide explains how to use the shared layout components in the admin dashboard.

## Overview

All admin pages now use a consistent layout with:
- **Sidebar**: Navigation menu with collapsible sections
- **Topbar**: Page title, user info, and mobile menu toggle
- **Main Content**: Page-specific content area

## Components

### 1. DashboardLayout

The main layout component that provides the sidebar and topbar for all admin pages.

```tsx
import DashboardLayout from "@/components/DashboardLayout";

export default function MyPage() {
  return (
    <DashboardLayout 
      title="Page Title" 
      showBackButton={true}
    >
      {/* Your page content */}
    </DashboardLayout>
  );
}
```

**Props:**
- `title` (string): Page title displayed in the topbar
- `showBackButton` (boolean, optional): Shows a back button in the topbar
- `children` (ReactNode): Page content

### 2. PageTemplate

A simplified wrapper around DashboardLayout for common page patterns.

```tsx
import PageTemplate from "@/components/PageTemplate";
import { Plus } from "lucide-react";

export default function MyPage() {
  const actions = (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
      <Plus className="w-4 h-4 mr-2" />
      Add Item
    </button>
  );

  return (
    <PageTemplate 
      title="My Page" 
      showBackButton={true}
      actions={actions}
    >
      {/* Your page content */}
    </PageTemplate>
  );
}
```

**Props:**
- `title` (string): Page title
- `showBackButton` (boolean, optional): Shows back button
- `actions` (ReactNode, optional): Action buttons for the page
- `children` (ReactNode): Page content

## Usage Examples

### Basic Page

```tsx
"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function BasicPage() {
  return (
    <DashboardLayout title="Basic Page">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Page Content</h2>
        <p>Your content goes here...</p>
      </div>
    </DashboardLayout>
  );
}
```

### Page with Actions

```tsx
"use client";

import PageTemplate from "@/components/PageTemplate";
import { Plus, Download } from "lucide-react";

export default function PageWithActions() {
  const actions = (
    <div className="flex space-x-2">
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
        <Download className="w-4 h-4 mr-2" />
        Export
      </button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        Add New
      </button>
    </div>
  );

  return (
    <PageTemplate 
      title="Page with Actions" 
      actions={actions}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p>Page content with action buttons...</p>
      </div>
    </PageTemplate>
  );
}
```

### Page with Back Button

```tsx
"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function PageWithBack() {
  return (
    <DashboardLayout 
      title="Detail Page" 
      showBackButton={true}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <p>Detail content...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

## Layout Features

### Sidebar Navigation
- **Collapsible sections**: Click on parent items to expand/collapse
- **Active state**: Current page is highlighted
- **Mobile responsive**: Sidebar slides in/out on mobile
- **User info**: Shows welcome message with user's name

### Topbar
- **Page title**: Displays the current page title
- **Back button**: Optional back navigation
- **User info**: Shows "Welcome back, [Name]"
- **Mobile menu**: Toggle button for mobile sidebar

### Main Content
- **Responsive padding**: Automatically adjusts for sidebar
- **Smooth animations**: Framer Motion animations for transitions
- **Consistent spacing**: Standard spacing and layout patterns

## Styling Guidelines

### Content Cards
Use consistent card styling for content sections:

```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {/* Card content */}
</div>
```

### Action Buttons
Use consistent button styling:

```tsx
// Primary action
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
  Primary Action
</button>

// Secondary action
<button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
  Secondary Action
</button>

// Danger action
<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
  Delete
</button>
```

### Form Layouts
Use consistent form styling:

```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Label
    </label>
    <input
      type="text"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</div>
```

## Migration Guide

If you have existing pages that need to be updated to use the shared layout:

1. **Import the layout component**:
   ```tsx
   import DashboardLayout from "@/components/DashboardLayout";
   ```

2. **Wrap your content**:
   ```tsx
   // Before
   return (
     <div className="min-h-screen bg-gray-50">
       {/* Your content */}
     </div>
   );

   // After
   return (
     <DashboardLayout title="Page Title">
       {/* Your content */}
     </DashboardLayout>
   );
   ```

3. **Remove duplicate elements**:
   - Remove custom headers/topbars
   - Remove custom sidebars
   - Remove authentication logic (handled by layout)

4. **Update navigation**:
   - Use the layout's navigation system
   - Remove custom navigation code

## Best Practices

1. **Always use the shared layout** for consistency
2. **Use PageTemplate** for simple pages with actions
3. **Use DashboardLayout** for complex custom layouts
4. **Follow the styling guidelines** for consistent appearance
5. **Test on mobile** to ensure responsive behavior
6. **Use proper TypeScript types** for better development experience

## Troubleshooting

### Common Issues

1. **Layout not showing**: Make sure you're importing the correct component
2. **Sidebar not working**: Check if you're using the layout correctly
3. **Mobile issues**: Ensure the layout is properly wrapped
4. **Styling conflicts**: Use the provided CSS classes

### Getting Help

If you encounter issues:
1. Check the component imports
2. Verify the layout structure
3. Check the browser console for errors
4. Refer to existing working pages for examples







