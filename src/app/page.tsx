"use client";

import React from "react";
import Link from "next/link";
import { MatrixLogo } from "@/components/common/MatrixLogo";
import { Sparkles, Radio, Swords, ShieldCheck, Radar, ArrowRight, CheckCircle2, Lock, Mail, Building, User, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-card/80 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <MatrixLogo />

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2"
          >
            Sign In / 2FA
          </Link>
          <Link
            href="/onboarding"
            className="bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-2"
          >
            <span>Start Onboarding Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section featuring Prominent Top Onboarding Entry */}
      <main className="max-w-6xl mx-auto px-6 py-12 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-bold border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Matrix IoT Solutions • iOS-Style 7-Step Onboarding Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Social Media Intelligence, Reputation & Lead Generation Platform
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Transform fragmented online noise into 5-way visual benchmarking, Traffic-Light sentiment, explainable credibility risk scores, and high-intent sales leads.
        </p>

        {/* Prominent Top Onboarding Wizard Card Preview */}
        <div className="max-w-4xl mx-auto bg-card border-2 border-primary/40 rounded-3xl shadow-ios p-6 sm:p-8 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-primary text-white uppercase tracking-wider">
                FEATURED SETUP FLOW
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">iOS-Style 7-Step Onboarding Wizard</h2>
              <p className="text-xs text-slate-500">Configure your company, personal brand, or products in 2 minutes.</p>
            </div>

            <Link
              href="/onboarding"
              className="bg-primary text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <span>Launch Onboarding Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Wizard Steps Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">1. Target Select</strong>
              <span className="text-slate-500 text-[11px]">Company, Product, Individual</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">2. Entity Profile</strong>
              <span className="text-slate-500 text-[11px]">Website, Market, Country</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">3. 5-Way Arena</strong>
              <span className="text-slate-500 text-[11px]">Competitor Auto-Discovery</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">4. OAuth Connections</strong>
              <span className="text-slate-500 text-[11px]">LinkedIn, FB, IG, X, TikTok</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="bg-primary text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-3"
          >
            <span>Explore Executive Command Centre</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Core Pillars Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12 text-left">
          <div className="p-6 bg-card rounded-3xl border border-slate-200/80 shadow-ios space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">5-Way Competitor Arena</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare up to five companies or personal brands across Share of Voice, engagement, and topic ownership.
            </p>
          </div>

          <div className="p-6 bg-card rounded-3xl border border-slate-200/80 shadow-ios space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-light text-teal flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Traffic-Light Sentiment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multilingual sentiment analysis supporting English, Bahasa Malaysia, Mandarin, Tamil, and Manglish.
            </p>
          </div>

          <div className="p-6 bg-card rounded-3xl border border-slate-200/80 shadow-ios space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-light text-violet flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Credibility Risk Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explainable evidence scores & coordinated bot cluster detection without automatic unverified claims.
            </p>
          </div>

          <div className="p-6 bg-card rounded-3xl border border-slate-200/80 shadow-ios space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
              <Radar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Lead Generation Radar</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Convert public buying signals and competitor dissatisfaction conversations directly into sales leads.
            </p>
          </div>
        </div>
      </main>

      {/* Footer with Matrix IoT Copyright & Support */}
      <footer className="border-t border-slate-200 bg-card px-8 py-6 text-center text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© 2026 Matrix IoT Solutions Sdn Bhd. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-primary font-bold">
            <Lock className="w-3.5 h-3.5" /> PDPA 2.0 Compliance Verified
          </span>
          <span>•</span>
          <a
            href="mailto:support@matrix-iot.com"
            className="flex items-center gap-1 text-slate-700 font-semibold hover:text-primary transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-primary" /> support@matrix-iot.com
          </a>
        </div>
      </footer>
    </div>
  );
}
