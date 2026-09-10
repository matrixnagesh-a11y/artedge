"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import LoginPage from "./login/page";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useTenant();

  useEffect(() => {
    const hasSession =
      typeof window !== "undefined" &&
      !!localStorage.getItem("artedge_auth_session");
    if (hasSession || isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return <LoginPage />;
}
