"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PerformanceWidgets } from "@/components/dashboard/performance-widgets";
import { StoreManagement } from "@/components/dashboard/store-management";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Dashboard Page Mounted");
    console.log("Current Pathname:", pathname);
    console.log("Window Location:", window.location);
  }, [pathname]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Debug Information</h1>
            <p>Current Pathname: {pathname}</p>
          </div>

          <QuickActions />
          
          <PerformanceWidgets />
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RecentActivity />
            </div>
            
            <div>
              <StoreManagement />
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}