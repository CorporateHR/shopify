"use client";

import AppLayout from "@/components/layout/app-layout";

export default function StoreConnectionLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
