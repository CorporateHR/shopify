"use client";

import { Card } from "@/components/ui/card";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in fade-in-50 duration-300">
        {children}
      </Card>
    </div>
  );
}