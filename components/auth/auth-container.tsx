"use client";

import { Card } from "@/components/ui/card";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in fade-in-50 duration-300 bg-[#1A1A1A] border-[#2A2A2A] rounded-lg">
        {children}
      </Card>
    </div>
  );
}