"use client";

import { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";

interface PageTemplateProps {
  title: string;
  showBackButton?: boolean;
  children: ReactNode;
  actions?: ReactNode;
}

export default function PageTemplate({ 
  title, 
  showBackButton = false, 
  children, 
  actions 
}: PageTemplateProps) {
  return (
    <DashboardLayout title={title} showBackButton={showBackButton}>
      <div className="space-y-6">
        {/* Page Actions */}
        {actions && (
          <div className="flex justify-end">
            {actions}
          </div>
        )}
        
        {/* Page Content */}
        {children}
      </div>
    </DashboardLayout>
  );
}




