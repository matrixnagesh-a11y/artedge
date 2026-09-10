"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TrialUpgradePromptModal } from "@/components/common/TrialUpgradePromptModal";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useTenant();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const hasSession = typeof window !== "undefined" && !!localStorage.getItem("artedge_auth_session");
    if (!hasSession && !isAuthenticated) {
      router.replace("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  if (isCheckingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Verifying credentials...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
        <TrialUpgradePromptModal />
      </div>
    </div>
  );
}

