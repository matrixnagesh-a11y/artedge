"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { SubscriptionPlanId, OnboardingMethodology } from "@/types";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Building,
  CreditCard,
  Sliders,
  Palette,
  Globe,
  Settings,
  HelpCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Zap,
  Radio,
  Check,
  Mail,
  UserCheck,
} from "lucide-react";

export default function SaaSManagementPage() {
  const {
    activeTenant,
    user,
    subscriptionPlans,
    currentTenantSaaSConfig,
    updateTenantBranding,
    updateTenantPlan,
    updateOnboardingMethodology,
    extendTenantTrial,
  } = useTenant();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [activeTab, setActiveTab] = useState<"plans" | "branding" | "superuser">("plans");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Live Branding
  const [formData, setFormData] = useState({
    productName: currentTenantSaaSConfig.branding.productName || "ArtEDGE Intelligence",
    tagline: currentTenantSaaSConfig.branding.tagline || "Social Media Intelligence & Benchmarking",
    primaryColor: currentTenantSaaSConfig.branding.primaryColor || "#4C7FF7",
    accentColor: currentTenantSaaSConfig.branding.accentColor || "#E8A317",
    darkNavyColor: currentTenantSaaSConfig.branding.darkNavyColor || "#0F172A",
    customDomain: currentTenantSaaSConfig.branding.customDomain || "",
    supportEmail: currentTenantSaaSConfig.branding.supportEmail || "support@matrix-iot.com",
    customFooterText: currentTenantSaaSConfig.branding.customFooterText || "© Matrix IoT Solutions Sdn Bhd",
    hideMatrixIoTPoweredBy: currentTenantSaaSConfig.branding.hideMatrixIoTPoweredBy || false,
  });

  const isFreeTrial = currentTenantSaaSConfig.currentPlanId === "free_trial";
  const currentPlan = subscriptionPlans.find((p) => p.id === currentTenantSaaSConfig.currentPlanId) || subscriptionPlans[0];
  const isSuperUser = user.role === "platform_super_admin" || user.role === "agency_admin";

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantBranding({
      ...formData,
      hideMatrixIoTPoweredBy: isFreeTrial ? false : formData.hideMatrixIoTPoweredBy,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    updateTenantPlan(activeTenant.id, planId);
    if (planId === "free_trial") {
      setFormData((prev) => ({ ...prev, hideMatrixIoTPoweredBy: false }));
    } else {
      setFormData((prev) => ({ ...prev, hideMatrixIoTPoweredBy: true }));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 text-white p-6 rounded-3xl shadow-ios border border-primary/20">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/30 text-primary-light border border-primary/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SaaS & White-Label Architecture
            </span>
            <span className="text-xs text-slate-300">
              Active Tier: <strong className="text-white">{currentPlan.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {activeTenant.name} Subscription & Branding Command
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Configure white-label branding, select from 3 commercial subscription modules with a 14-day free trial, and manage super user onboarding methodologies.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === "plans" ? "bg-white text-slate-900 shadow-md" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === "branding" ? "bg-white text-slate-900 shadow-md" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            White-Label Studio
          </button>
          <button
            onClick={() => setActiveTab("superuser")}
            className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === "superuser" ? "bg-amber text-slate-950 shadow-md font-extrabold" : "bg-amber/20 text-amber-300 hover:bg-amber/30"
            }`}
          >
            Super User Config
          </button>
        </div>
      </div>

      {/* Free Tier Mandatory Watermark Warning Banner */}
      {isFreeTrial && (
        <div className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-amber-800 font-bold block">Free 14-Day Evaluation Notice: Mandatory Matrix IoT Branding Enforced</strong>
              <p className="text-slate-600 text-[11px] mt-0.5">
                The free tier cannot be white-labeled and strictly displays the <strong>Matrix IoT Solutions Sdn Bhd</strong> watermark. Upgrade to Pro or Enterprise to remove watermarks and use your custom corporate domain.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSelectPlan("pro_growth")}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shrink-0 shadow-sm transition-all cursor-pointer"
          >
            Upgrade to Pro (RM 1,499/mo)
          </button>
        </div>
      )}

      {/* TAB 1: 3 SUBSCRIPTION MODULES + FREE 14-DAY OPTION */}
      {activeTab === "plans" && (
        <div className="space-y-8">
          {/* Billing Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
            <div>
              <h2 className="text-lg font-black text-slate-900">Commercial Subscription Modules</h2>
              <p className="text-xs text-slate-500">Transparent pricing for Malaysian & ASEAN enterprises with 14-day free evaluation</p>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  billingCycle === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "bg-primary text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>Annual (Save ~17%)</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-amber text-slate-950 font-black rounded-md">2 Mos Free</span>
              </button>
            </div>
          </div>

          {/* 3 Subscription Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const isCurrent = currentTenantSaaSConfig.currentPlanId === plan.id;
              const isEnterprise = plan.id === "enterprise_sovereign";
              const isPro = plan.id === "pro_growth";

              return (
                <div
                  key={plan.id}
                  className={`bg-card rounded-3xl p-6 border-2 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? "border-primary shadow-xl ring-2 ring-primary/20 bg-primary/5"
                      : isEnterprise
                      ? "border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-ios"
                      : "border-slate-200/80 shadow-ios hover:border-primary/40"
                  }`}
                >
                  <div>
                    {/* Top Tag & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isCurrent
                            ? "bg-primary text-white"
                            : isEnterprise
                            ? "bg-amber text-slate-950"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {isCurrent ? "Current Active Plan" : plan.badge}
                      </span>
                      {plan.allowCustomBranding ? (
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${isEnterprise && !isCurrent ? "text-teal-300" : "text-green-600"}`}>
                          <Unlock className="w-3 h-3" /> White-Label Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Matrix IoT Watermark
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xl font-black mb-1 ${isEnterprise && !isCurrent ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>

                    {/* Price Display */}
                    <div className={`my-5 pb-5 border-b flex items-baseline gap-1 ${isEnterprise && !isCurrent ? "border-slate-800" : "border-slate-200"}`}>
                      {plan.monthlyPriceMYR === 0 ? (
                        <div>
                          <span className={`text-4xl font-black ${isEnterprise && !isCurrent ? "text-white" : "text-slate-900"}`}>RM 0</span>
                          <span className={`text-xs font-semibold ml-1.5 ${isEnterprise && !isCurrent ? "text-slate-400" : "text-slate-500"}`}>/ 14-day trial</span>
                        </div>
                      ) : billingCycle === "monthly" ? (
                        <div>
                          <span className={`text-4xl font-black ${isEnterprise && !isCurrent ? "text-white" : "text-slate-900"}`}>
                            RM {plan.monthlyPriceMYR.toLocaleString()}
                          </span>
                          <span className={`text-xs font-semibold ml-1.5 ${isEnterprise && !isCurrent ? "text-slate-400" : "text-slate-500"}`}>/ month</span>
                          <p className={`text-[11px] font-medium mt-1 ${isEnterprise && !isCurrent ? "text-slate-400" : "text-slate-500"}`}>
                            Approx. ${plan.monthlyPriceUSD} USD / mo
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className={`text-4xl font-black ${isEnterprise && !isCurrent ? "text-white" : "text-slate-900"}`}>
                            RM {Math.round(plan.annualPriceMYR / 12).toLocaleString()}
                          </span>
                          <span className={`text-xs font-semibold ml-1.5 ${isEnterprise && !isCurrent ? "text-slate-400" : "text-slate-500"}`}>/ month</span>
                          <p className="text-[11px] text-green-600 font-bold mt-1">
                            billed RM {plan.annualPriceMYR.toLocaleString()} / year
                          </p>
                          <p className={`text-[10.5px] mt-0.5 ${isEnterprise && !isCurrent ? "text-slate-400" : "text-slate-500"}`}>
                            Approx. ${Math.round(plan.monthlyPriceUSD * 0.83)} USD / mo
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-6">
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${isEnterprise && !isCurrent ? "text-slate-400" : "text-slate-500"}`}>
                        Included Capabilities:
                      </p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isEnterprise && !isCurrent ? "text-teal-400" : "text-primary"}`} />
                            <span className={isEnterprise && !isCurrent ? "text-slate-300" : "text-slate-700"}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Plan Action Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-slate-200 text-slate-500 cursor-default"
                        : isEnterprise
                        ? "bg-amber hover:bg-amber-light text-slate-950 shadow-lg shadow-amber/20 font-black"
                        : "bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20"
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-4 h-4" /> Active Plan
                      </>
                    ) : (
                      <>
                        Select {plan.name} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WHITE-LABEL BRANDING STUDIO */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customizer Form */}
          <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">White-Label Brand Customizer</h2>
                <p className="text-xs text-slate-400">Rebrand the interface with your agency, company, or product identity</p>
              </div>
              {isFreeTrial ? (
                <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Free Tier (Branding Locked)
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-bold bg-green-light text-green rounded-full flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> White-Label Active
                </span>
              )}
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Title / Portal Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="e.g. NexusPulse AI"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="e.g. Enterprise Social Listening"
                  />
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Accent Gold Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dark Navy Surface</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.darkNavyColor}
                      onChange={(e) => setFormData({ ...formData, darkNavyColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={formData.darkNavyColor}
                      onChange={(e) => setFormData({ ...formData, darkNavyColor: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Domain & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Custom Subdomain / CNAME</label>
                  <input
                    type="text"
                    value={formData.customDomain}
                    disabled={isFreeTrial}
                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 disabled:opacity-60 focus:bg-white focus:outline-none"
                    placeholder="e.g. app.myagency.com"
                  />
                  {isFreeTrial && <span className="text-[10px] text-amber-600 block mt-1">Requires Pro or Enterprise tier</span>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Support Contact Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                    placeholder="support@yourbrand.com"
                  />
                </div>
              </div>

              {/* Custom Footer */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Custom Copyright & Legal Notice</label>
                <input
                  type="text"
                  value={formData.customFooterText}
                  onChange={(e) => setFormData({ ...formData, customFooterText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  placeholder="© 2026 Your Enterprise Sdn Bhd. All rights reserved."
                />
              </div>

              {/* Watermark Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">Hide "Powered by Matrix IoT Solutions" Watermark</strong>
                  <p className="text-[11px] text-slate-500">Completely remove vendor references from all dashboards, reports, and emails.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hideWatermark"
                    disabled={isFreeTrial}
                    checked={formData.hideMatrixIoTPoweredBy}
                    onChange={(e) => setFormData({ ...formData, hideMatrixIoTPoweredBy: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                  />
                  {isFreeTrial && <span className="text-[10px] font-bold text-coral">Locked (Free Trial)</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Branding Configuration
                </button>
                {saveSuccess && (
                  <span className="text-xs font-bold text-green flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Branding applied live!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Live Mockup Preview Card */}
          <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">Live UI Preview</h2>
              <p className="text-xs text-slate-400 mb-4">Real-time simulation of your branded interface header & footer</p>

              {/* Simulated Header */}
              <div
                className="p-4 rounded-2xl text-white mb-4 shadow-sm"
                style={{ backgroundColor: formData.darkNavyColor }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-sm"
                      style={{ backgroundColor: formData.accentColor, color: "#000" }}
                    >
                      {formData.productName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block leading-tight">{formData.productName}</span>
                      <span className="text-[9px] text-slate-300">{formData.tagline}</span>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Live Portal
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10 text-[10px] text-slate-200 backdrop-blur-xs flex items-center justify-between">
                  <span>Custom URL:</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {formData.customDomain || (isFreeTrial ? "app.artedge.app (Free Trial)" : "app.yourbrand.com")}
                  </span>
                </div>
              </div>

              {/* Simulated Footer */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1.5">
                <p className="font-semibold">{formData.customFooterText}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px]">
                  <span>Support: <strong className="text-slate-800">{formData.supportEmail}</strong></span>
                  {formData.hideMatrixIoTPoweredBy ? (
                    <span className="text-green font-bold">100% White-Labeled ✅</span>
                  ) : (
                    <span className="text-slate-500 font-bold">Powered by Matrix IoT Solutions Sdn Bhd</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 text-center font-medium">
              💡 Changes update client dashboards and export reports automatically.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPER USER & ONBOARDING METHODOLOGY CONFIG */}
      {activeTab === "superuser" && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-3xl border-2 border-amber-400/40 bg-amber-50/20 shadow-ios">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber" />
                <h2 className="text-base font-bold text-slate-900">Platform Super User Control Panel</h2>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber text-slate-950 rounded-full">
                Super Admin Authorized
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-6">
              Configure tenant subscription states, override trial limits, and set the default onboarding methodology for new organizations.
            </p>

            {/* Onboarding Methodology Picker */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Active Tenant Onboarding Methodology
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Methodology 1 */}
                <div
                  onClick={() => updateOnboardingMethodology(activeTenant.id, "ios_wizard")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentTenantSaaSConfig.onboardingMethodology === "ios_wizard"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">1. iOS-Style 7-Step Wizard</span>
                    {currentTenantSaaSConfig.onboardingMethodology === "ios_wizard" && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Automated self-service flow: target select, profile discovery, 5-way competitors, and instant OAuth connection.
                  </p>
                  <span className="text-[10px] font-bold text-primary block mt-2">Recommended for SME & Pro</span>
                </div>

                {/* Methodology 2 */}
                <div
                  onClick={() => updateOnboardingMethodology(activeTenant.id, "enterprise_assisted")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentTenantSaaSConfig.onboardingMethodology === "enterprise_assisted"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">2. White-Glove Enterprise Setup</span>
                    {currentTenantSaaSConfig.onboardingMethodology === "enterprise_assisted" && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Assisted onboarding with AWS ap-southeast-5 S3 KMS data residency handshake, DPO verification, and custom model training.
                  </p>
                  <span className="text-[10px] font-bold text-amber block mt-2">Recommended for Enterprise Banks</span>
                </div>

                {/* Methodology 3 */}
                <div
                  onClick={() => updateOnboardingMethodology(activeTenant.id, "agency_bulk_csv")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentTenantSaaSConfig.onboardingMethodology === "agency_bulk_csv"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">3. Agency Multi-Client Bulk CSV</span>
                    {currentTenantSaaSConfig.onboardingMethodology === "agency_bulk_csv" && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Batch provision up to 50 client workspaces simultaneously with automated brand mapping and shared billing.
                  </p>
                  <span className="text-[10px] font-bold text-violet block mt-2">Recommended for PR Agencies</span>
                </div>
              </div>
            </div>

            {/* Trial Override Actions */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Trial Expiry Extension Control</strong>
                <p className="text-[11px] text-slate-500">Current trial expiry: {new Date(currentTenantSaaSConfig.trialExpiresAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    extendTenantTrial(activeTenant.id, 14);
                    alert("Added +14 days to tenant trial window.");
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  +14 Days Trial
                </button>
                <button
                  onClick={() => {
                    extendTenantTrial(activeTenant.id, 30);
                    alert("Added +30 days to tenant trial window.");
                  }}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  +30 Days Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
