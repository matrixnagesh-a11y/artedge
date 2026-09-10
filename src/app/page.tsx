"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { MatrixLogo } from "@/components/common/MatrixLogo";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Users,
  CheckCircle2,
  Layers,
  Key,
  Mail,
} from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    isContactModalOpen,
    setIsContactModalOpen,
  } = useTenant();

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryCompany, setInquiryCompany] = useState("");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsContactModalOpen(false);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryCompany("");
      setInquiryNotes("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between select-none">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MatrixLogo />
            <span className="hidden md:inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded-full">
              Multi-Client SaaS Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 mr-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PDPA 2.0 Certified • 2FA Enforced</span>
            </div>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Contact Us for Login Details
            </button>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold rounded-xl shadow-md shadow-primary/25 transition-all flex items-center gap-1.5"
              >
                <span>Enter Workspace ({user?.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold rounded-xl shadow-md shadow-primary/25 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Client Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 my-auto flex flex-col items-center text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">SaaS Multi-Tenant Architecture</span>
          <span className="text-slate-600">•</span>
          <span className="text-primary font-bold">Secondary Authentication (2FA)</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl text-white leading-tight mb-6">
          Ethical Social Intelligence & Competitive Benchmarking for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-teal-400">
            Multi-Client Enterprises
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Sovereign intelligence command center supporting multi-client workspaces, automated self-service registration, 2-step secondary authentication, and comprehensive 5-way competitor arenas.
        </p>

        {/* Primary CTA Grid */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mb-14">
          <Link
            href="/login"
            className="w-full sm:flex-1 py-3.5 px-6 bg-primary hover:bg-primary-dark text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Workspace</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/login?mode=signup"
            className="w-full sm:flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-teal-400" />
            <span>Register Client</span>
          </Link>
        </div>

        {/* Pricing Bar: RM99 Basic Version */}
        <div className="w-full max-w-3xl p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Commercial Entry Tier
              </span>
              <span className="text-xs text-slate-400 font-semibold">No Trial Required</span>
            </div>
            <h3 className="text-xl font-black text-white">Basic Version • RM 99 / Month</h3>
            <p className="text-xs text-slate-400">
              Full single-brand intelligence, 5,000 verified mentions, multilingual sentiment NLP, and report downloads.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full md:w-auto">
            <Link
              href="/login?mode=signup&plan=basic"
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Get Basic (RM99)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Request Login Details
            </button>
          </div>
        </div>

        {/* Key SaaS Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Multi-Client Tenancy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Isolated workspace domains for corporate brands, agencies, and public institutions with enterprise role-based access control.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Secondary Authentication (2FA)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mandatory two-factor verification step protecting executive data rooms, analyst workbenches, and counter-journalism debunks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Platform Superadmin Console</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated master administrator portal for system oversight, automated client provisioning, and global telemetry management.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Matrix IoT Solutions Sdn Bhd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Support: <strong className="text-slate-300">support@matrix-iot.com</strong></span>
            <span>•</span>
            <span>Malaysian PDPA 2.0 Certified</span>
          </div>
        </div>
      </footer>

      {/* Contact Us for Login Details Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up text-left">
            <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Contact Us for Login Details</h3>
                  <p className="text-[11px] text-slate-400">
                    Matrix IoT Solutions Client Success & Provisioning Desk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">Direct Enterprise Support Channel</span>
                <p className="text-[11px] text-slate-400">
                  Email us directly at{" "}
                  <a
                    href="mailto:support@matrix-iot.com"
                    className="text-primary font-bold hover:underline"
                  >
                    support@matrix-iot.com
                  </a>{" "}
                  to request client credentials, custom tenant setup, or invoicing for the RM99 Basic Version.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold text-xs block">Request Sent to support@matrix-iot.com</span>
                    <span className="text-[11px] text-emerald-400 block mt-0.5">
                      Our platform provisioning desk will deliver your workspace login details shortly.
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rachel Lim"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Corporate Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rachel@yourcompany.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Client Organization / Brand Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABC Holdings Bhd"
                      value={inquiryCompany}
                      onChange={(e) => setInquiryCompany(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Notes / Specific Workspace Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="Requesting login details for RM99 Basic Tier or Enterprise deployment..."
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Submit Request to support@matrix-iot.com</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
