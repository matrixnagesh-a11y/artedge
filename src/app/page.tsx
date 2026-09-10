"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";

export default function RootPage() {
  const router = useRouter();
  const { startOrRefreshFreeTrial, setActiveTenant, tenants } = useTenant();

  useEffect(() => {
    // Automatically initialize session and redirect straight to dashboard
    startOrRefreshFreeTrial();
    if (tenants && tenants.length > 0) {
      setActiveTenant(tenants[0]);
    }
    router.replace("/dashboard");
  }, [router, setActiveTenant, startOrRefreshFreeTrial, tenants]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 select-none">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-extrabold tracking-tight text-white">
            Entering ArtEDGE Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Auto-logging into the system & loading executive command center...
          </p>
        </div>
      </div>
    </div>
  );
}
