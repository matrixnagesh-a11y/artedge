"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import {
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
} from "lucide-react";

export const TrialUpgradePromptModal: React.FC = () => {
  const router = useRouter();
  const {
    isPaidUpgradeModalOpen,
    dismissPaidPrompt,
    trialStartedAt,
    trialExpiresAt,
    trialDaysRemaining,
    trialDaysElapsed,
  } = useTenant();

  if (!isPaidUpgradeModalOpen) return null;

  const startDateFormatted = new Date(trialStartedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const expiryDateFormatted = new Date(trialExpiresAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-card border border-slate-200/90 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up relative">
        {/* Top Gold & Blue Ambient Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-gold via-primary to-teal" />

        {/* Modal Header */}
        <div className="p-6 pb-4 relative">
          <button
            onClick={dismissPaidPrompt}
            className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Remind me in 2 days"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 text-[10px] font-black uppercase bg-primary-light text-primary rounded-full border border-primary/20 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Day {trialDaysElapsed} of 14 Free Version
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-800 rounded-full border border-amber-500/20">
              Prompted Every 2 Days
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Register for ArtEDGE Paid Version
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            You are currently on the <strong>14-day free evaluation version</strong>. Unlock full enterprise capabilities and sovereign white-labeling.
          </p>
        </div>

        {/* Active Timestamp & Progress Details */}
        <div className="px-6 py-3 bg-slate-50 border-y border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              Started: <strong>{startDateFormatted}</strong>
            </span>
          </div>
          <div className="text-slate-600">
            Expires: <strong className="text-coral">{expiryDateFormatted}</strong> ({trialDaysRemaining} days left)
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Paid Version Unlocks:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                  <span>Full White-Label SaaS</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Remove Matrix IoT watermark and connect your custom corporate domain (CNAME).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                  <span>Unlimited 5-Way Arena</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Monitor all competitors with real-time sentiment alerts and counter-journalism triage.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                  <span>Dedicated S3 Residency</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Encrypted Malaysian PDPA 2.0 data vault with sovereign audit logs and KMS keys.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                  <span>Priority 24/7 SLA</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Crisis War Room escalation dispatch and dedicated threat intelligence engineering.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Quick Summary */}
          <div className="p-3.5 rounded-2xl bg-primary-light/40 border border-primary/20 flex items-center justify-between">
            <div>
              <span className="font-black text-slate-900 text-xs block">Pro Growth Subscription</span>
              <span className="text-[11px] text-slate-500">RM 1,499 / month • Cancel anytime</span>
            </div>
            <span className="text-[10px] font-black uppercase text-primary bg-white px-2.5 py-1 rounded-xl border border-primary/20">
              Popular Choice
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={() => {
                dismissPaidPrompt();
                router.push("/saas");
              }}
              className="w-full sm:flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-2xl shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <span>Register for Paid Version Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={dismissPaidPrompt}
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-xs cursor-pointer"
            >
              Remind Me in 2 Days
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400">
              Free version maintains full functionality for {trialDaysRemaining} more days.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
