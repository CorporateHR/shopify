"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DebugDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current Pathname:", pathname);
    console.log("Attempting to access dashboard");
    
    // Log routing details
    const logRoutingDetails = () => {
      console.log("Window Location:", window.location);
      console.log("Router Object:", router);
    };

    logRoutingDetails();

    // Simulate a delay to check async routing
    const timer = setTimeout(() => {
      logRoutingDetails();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  return (
    <div>
      <h1>Dashboard Debug Page</h1>
      <p>Current Pathname: {pathname}</p>
    </div>
  );
}
