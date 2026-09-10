"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import {
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Mail,
  Zap,
} from "lucide-react";

export const TrialUpgradePromptModal: React.FC = () => {
  const router = useRouter();
  const {
    isPaidUpgradeModalOpen,
    dismissPaidPrompt,
    updateTenantPlan,
    activeTenant,
    setIsContactModalOpen,
  } = useTenant();

  if (!isPaidUpgradeModalOpen) return null;

  const handleActivateBasic = () => {
    updateTenantPlan(activeTenant.id, "basic");
    dismissPaidPrompt();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-card border border-slate-200/90 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up relative">
        {/* Top Accent Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-primary to-teal-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 relative">
          <button
            onClick={dismissPaidPrompt}
            className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" /> Commercial SaaS Tier
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-primary-light text-primary rounded-full border border-primary/20">
              Basic Plan: RM 99 / Month
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            ArtEDGE Commercial SaaS Access
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Activate the <strong>RM99 Basic Version</strong> for single brand benchmarking or contact our team for enterprise multi-client credentials.
          </p>
        </div>

        {/* Value Proposition Highlights */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Basic Version (RM99/mo)</span>
              </div>
              <p className="text-[10px] text-slate-500">
                1 monitored brand, 5k monthly mentions, multilingual sentiment NLP & reports.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Multi-Client 2FA Security</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Secondary authentication (TOTP/SMS) enforcing zero-trust compliance.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>5-Way Competitor Arena</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Benchmark market share of voice and digital authority across ASEAN.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Direct Support Desk</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Quick assistance via support@matrix-iot.com with SLA compliance.
              </p>
            </div>
          </div>

          {/* Pricing Quick Summary */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="font-black text-slate-900 text-xs block">Basic Version Access</span>
              <span className="text-[11px] text-slate-600">RM 99 / month • Direct activation</span>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
              RM99 / mo
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={handleActivateBasic}
              className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <span>Activate RM99 Basic Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                dismissPaidPrompt();
                setIsContactModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us for Login Details</span>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400">
              For enterprise billing inquiries or custom multi-tenant setups, email <strong>support@matrix-iot.com</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
