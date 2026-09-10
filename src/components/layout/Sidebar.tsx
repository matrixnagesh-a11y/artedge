"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { UserRole } from "@/types";
import { MatrixLogo } from "@/components/common/MatrixLogo";
import {
  LayoutDashboard,
  Radio,
  Swords,
  Smile,
  ShieldCheck,
  AlertTriangle,
  Megaphone,
  Radar,
  FileSpreadsheet,
  Building2,
  Share2,
  Settings,
  Sparkles,
  ChevronDown,
  UserCheck,
  ShieldAlert,
  Lock,
  LogIn,
  Award,
  Scale,
  Palette,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    activeTenant,
    setActiveTenant,
    tenants,
    user,
    setUserRole,
    currentTenantSaaSConfig,
    startNewComparisonPrompt,
    competitors,
    entityType,
  } = useTenant();

  const isSolo = competitors.length <= 1;

  const navItems = [
    { href: "/dashboard", label: "Executive Command", icon: LayoutDashboard, badge: null, iosBg: "from-blue-500 to-blue-600" },
    { href: "/listening", label: "Universal Listening", icon: Radio, badge: "Live", iosBg: "from-indigo-500 to-purple-600" },
    {
      href: "/competitors",
      label: isSolo
        ? `Solo ${entityType === "individual" ? "Leader" : "Brand"} Profile`
        : `${competitors.length}-Way Arena`,
      icon: Swords,
      badge: isSolo ? "Solo" : `${competitors.length} Peers`,
      iosBg: "from-orange-500 to-rose-500",
    },
    { href: "/sentiment", label: "Sentiment & Emotion", icon: Smile, badge: null, iosBg: "from-emerald-400 to-teal-600" },
    { href: "/reputation", label: "Reputation Command", icon: Award, badge: "91.4 AA+", iosBg: "from-amber-400 to-yellow-500" },
    { href: "/counter-journalism", label: "Counter Yellow Media", icon: Scale, badge: "Debunk 🟢", iosBg: "from-teal-500 to-cyan-600" },
    { href: "/saas", label: "SaaS & White-Label", icon: Palette, badge: "Plans", iosBg: "from-purple-500 to-fuchsia-600" },
    { href: "/access-control", label: "Access Control & Users", icon: UserCheck, badge: "Self-Service", iosBg: "from-sky-500 to-blue-600" },
    { href: "/credibility", label: "Credibility Risk Engine", icon: ShieldCheck, badge: "AI Risk", iosBg: "from-amber-500 to-orange-600" },
    { href: "/crisis", label: "Crisis War Room", icon: AlertTriangle, badge: "1 Active", alert: true, iosBg: "from-red-500 to-rose-600" },
    { href: "/campaigns", label: "AI Campaign Planner", icon: Megaphone, badge: null, iosBg: "from-pink-500 to-rose-500" },
    { href: "/leads", label: "Lead Radar", icon: Radar, badge: "3 New", iosBg: "from-cyan-500 to-blue-600" },
    { href: "/reports", label: "Reports & Infographics", icon: FileSpreadsheet, badge: "PDF/XLS", iosBg: "from-slate-600 to-slate-800" },
    { href: "/compliance", label: "PDPA 2.0 Compliance", icon: ShieldAlert, badge: "PDPA 2.0", iosBg: "from-emerald-600 to-teal-800" },
    { href: "/connectors", label: "Source Connectors", icon: Share2, badge: "7 APIs", iosBg: "from-blue-600 to-cyan-600" },
    { href: "/onboarding", label: "Onboarding Wizard", icon: Sparkles, badge: "Setup", iosBg: "from-violet-500 to-purple-600" },
    { href: "/login", label: "Client Auth & 2FA", icon: LogIn, badge: "2FA", iosBg: "from-slate-700 to-slate-900" },
  ];

  const rolesList: { role: UserRole; label: string }[] = [
    { role: "platform_super_admin", label: "Platform Super Admin" },
    { role: "agency_admin", label: "Agency Admin" },
    { role: "client_admin", label: "Client Admin" },
    { role: "marketing_manager", label: "Marketing Manager" },
    { role: "analyst", label: "Analyst" },
    { role: "sales_user", label: "Sales User" },
    { role: "executive_viewer", label: "Executive Viewer" },
    { role: "compliance_auditor", label: "Compliance Auditor" },
  ];

  return (
    <aside className="w-72 bg-card border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header with Dynamic Product Name or Gold Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/">
            <MatrixLogo />
          </Link>
          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-primary-light text-primary border border-primary/20 rounded-full uppercase tracking-wider">
            Multi-Client SaaS
          </span>
        </div>

        {/* Tenant Switcher Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Active Workspace
          </label>
          <div className="relative">
            <select
              value={activeTenant.id}
              onChange={(e) => {
                const found = tenants.find((t) => t.id === e.target.value);
                if (found) setActiveTenant(found);
              }}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.mode.replace("_", " ")})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* New Comparison Action in Sidebar */}
          <button
            onClick={() => startNewComparisonPrompt(entityType)}
            className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm shadow-primary/20 transition-all cursor-pointer"
            title="Clear old data and compare 1 to 5 individuals or brands"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>New Comparison</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "text-slate-700 hover:bg-slate-100/90 hover:text-slate-950"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-[8px] bg-gradient-to-b ${item.iosBg} flex items-center justify-center text-white shadow-xs shadow-black/15 shrink-0 transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-4 h-4 text-white stroke-[2.2]" />
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.alert
                        ? "bg-coral text-white animate-pulse"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/70 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & Dynamic SaaS Branding Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-medium flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-primary" /> Active RBAC Role:
            </span>
          </div>
          <select
            value={user.role}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 appearance-none cursor-pointer focus:outline-none"
          >
            {rolesList.map((r) => (
              <option key={r.role} value={r.role}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-1">
          <div className="flex items-center justify-between font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-primary">
              <Lock className="w-3 h-3" /> PDPA 2.0 Certified
            </span>
          </div>
          <p className="text-[9px] text-slate-500 font-semibold">
            {currentTenantSaaSConfig?.branding?.customFooterText || "© 2026 Matrix IoT Solutions Sdn Bhd"}
          </p>
          {!currentTenantSaaSConfig?.branding?.hideMatrixIoTPoweredBy && (
            <p className="text-[8.5px] text-slate-400">
              Powered by <strong>Matrix IoT Solutions Sdn Bhd</strong>
            </p>
          )}
          <p className="text-[9px] text-slate-400 font-medium">
            Enterprise Cloud Active • 99.9% SLA
          </p>
        </div>
      </div>
    </aside>
  );
};
