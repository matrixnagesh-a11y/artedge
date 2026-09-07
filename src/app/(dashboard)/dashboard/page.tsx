"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { formatNumber, formatPercent } from "@/lib/utils";
import { generateTrafficLightSentimentPdf, generateNegativeSentimentRiskPdf } from "@/lib/pdfReportEngine";
import { generateTimelineSeries } from "@/lib/dataGenerator";
import {
  TrendingUp,
  Users,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Radio,
  Swords,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  FileText,
  Cloud,
  MapPin,
  Globe,
  Building,
  User,
  RotateCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const {
    primaryEntity,
    competitors,
    recommendations,
    mentions,
    crisis,
    ipscanFilter,
    dateRange,
    setDateRange,
    entityType,
    startNewComparisonPrompt,
    refreshCurrentData,
    isReplenishing,
  } = useTenant();

  // Dynamically generated time series based on selected date range (Today, 7D, 30D, Quarter, Year)
  const trendData = useMemo(() => {
    return generateTimelineSeries(dateRange, primaryEntity?.name || (entityType === "individual" ? "Nikhil Kumaraswamy" : "Maybank"));
  }, [dateRange, primaryEntity?.name, entityType]);

  const dateRangeLabel = {
    today: "Today (24 Hours)",
    "7d": "Rolling 7-Day Window",
    "30d": "Last 30 Days (Weekly Buckets)",
    quarter: "Quarterly Trends (90 Days)",
    year: "Annual View (12 Months)",
  }[dateRange] || "Rolling 7-Day Window";

  return (
    <div id="executive-command-container" className="space-y-8 pb-16">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-primary/90 text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Link
              href="/dashboard"
              className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-green text-white flex items-center gap-1.5 shadow-sm hover:bg-green-dark transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Workspace Active (Port 3001)</span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/30 text-primary-light border border-primary/30 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              AWS: ap-southeast-5
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20 flex items-center gap-1">
              {entityType === "individual" ? (
                <>
                  <User className="w-3.5 h-3.5 text-teal-light" />
                  <span>Individual Leader Mode</span>
                </>
              ) : (
                <>
                  <Building className="w-3.5 h-3.5 text-primary-light" />
                  <span>Corporate Company Mode</span>
                </>
              )}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {primaryEntity.name} Intelligence Command
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time multi-channel listening across {competitors.length <= 1 ? "solo individual profile telemetry" : `5-way ${entityType === "individual" ? "peer executives" : "regional competitors"}`}, Malaysian sentiment analytics, IPSCAN network routing, and explainable credibility risk scores.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={async () => {
              setIsGeneratingPdf(true);
              try {
                await generateTrafficLightSentimentPdf(
                  primaryEntity,
                  mentions,
                  competitors,
                  ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Filtered Area")
                );
              } catch (err) {
                console.error("Traffic Light PDF generation error:", err);
              } finally {
                setIsGeneratingPdf(false);
              }
            }}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-md hover:bg-slate-100 transition-all disabled:opacity-60 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-green" />
            <span>{isGeneratingPdf ? "Capturing Screenshot & PDF..." : "Traffic Light PDF + Screen"}</span>
          </button>
          <button
            onClick={() =>
              generateNegativeSentimentRiskPdf(
                primaryEntity,
                mentions,
                competitors,
                ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Filtered Area")
              )
            }
            className="flex items-center gap-1.5 bg-coral text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-md hover:bg-coral-dark transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>Negative PDF</span>
          </button>
          <Link
            href="/listening"
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>IPSCAN Feed</span>
          </Link>
        </div>
      </div>

      {/* 🎯 Active 5-Entity Comparison Arena Banner */}
      <div className="bg-white border-2 border-primary/20 rounded-3xl p-5 shadow-ios">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${competitors.length <= 1 ? "bg-emerald-600 text-white" : "bg-primary text-white"}`}>
                {competitors.length <= 1 ? "👤 Solo Profile Active (1 Entity)" : `Active ${competitors.length}-Entity Benchmark`}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {competitors.length <= 1
                  ? (entityType === "individual" ? "Single Figure Analysis" : "Single Brand Focus")
                  : (entityType === "individual" ? `👤 ${competitors.length} Individuals Compared` : `🏢 ${competitors.length} Companies Compared`)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="px-3 py-1.5 rounded-xl bg-primary-light text-primary text-xs font-extrabold flex items-center gap-1.5 border border-primary/20 shadow-xs">
                <span>★</span> {primaryEntity.name} {competitors.length <= 1 ? "(Solo Target)" : "(Primary)"}
              </span>
              {competitors
                .filter((c) => !c.isPrimary)
                .slice(0, 4)
                .map((comp, idx) => (
                  <span
                    key={comp.id || idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200"
                  >
                    <span className="text-slate-400 font-mono">#{idx + 2}</span>
                    <span>{comp.name}</span>
                  </span>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => refreshCurrentData(false)}
              disabled={isReplenishing}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
              title="Refresh and recalculate live metrics for current target"
            >
              <RotateCw className={`w-3.5 h-3.5 text-primary ${isReplenishing ? "animate-spin" : ""}`} />
              <span>{isReplenishing ? "Refreshing..." : "Refresh Data"}</span>
            </button>
            <button
              onClick={() => startNewComparisonPrompt(entityType, competitors.length <= 1 ? "multi" : "single")}
              className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white text-xs font-black rounded-2xl shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{competitors.length <= 1 ? "Compare with Others (2-5)" : `Compare New ${entityType === "individual" ? "People" : "Companies"}`}</span>
            </button>
            <Link
              href="/competitors"
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all"
            >
              <Swords className="w-4 h-4 text-primary" />
              <span>{competitors.length <= 1 ? "Solo Profile / Arena" : `${competitors.length}-Way Arena`}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Mentions */}
        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios hover:shadow-ios-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Mentions
            </span>
            <div className="w-9 h-9 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatNumber(trendData.reduce((acc, curr) => acc + curr.mentions, 0) || 14250)}
            </span>
            <span className="text-xs font-bold text-green flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Vs. previous period ({dateRangeLabel})</p>
        </div>

        {/* Card 2: Share of Voice */}
        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios hover:shadow-ios-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Share of Voice (SOV)
            </span>
            <div className="w-9 h-9 rounded-2xl bg-violet-light flex items-center justify-center text-violet">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">
              {competitors[0]?.metrics.shareOfVoicePercent || (competitors.length <= 1 ? 100 : 36.8)}%
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-light text-violet rounded-full">
              {competitors.length <= 1 ? "Solo Target (100%)" : `Rank #1 of ${competitors.length}`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {competitors.length <= 1
              ? "100% total profile ownership (no active contenders)"
              : `Outperforming ${competitors[1]?.name || "Competitor"} (${competitors[1]?.metrics.shareOfVoicePercent || 24.5}%)`}
          </p>
        </div>

        {/* Card 3: Sentiment Health Traffic Light */}
        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios hover:shadow-ios-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sentiment Health
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-green">Happy</span>
              <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center text-[10px] text-white font-bold">
                ●
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-900">
              {competitors[0]?.metrics.sentimentScore || 86}/100
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-green to-amber h-2 rounded-full" style={{ width: `${competitors[0]?.metrics.sentimentScore || 86}%` }} />
          </div>
        </div>

        {/* Card 4: Reputation Risk Score */}
        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios hover:shadow-ios-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reputation Risk Score
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-light flex items-center justify-center text-teal">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">
              {competitors[0]?.metrics.reputationRiskScore || 18} <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-green-light text-green rounded-full">
              Low Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Zero unmitigated critical incidents</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Volume Trend */}
        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {dateRange.toUpperCase()} Sentiment & Volume Velocity
              </h2>
              <p className="text-xs text-slate-400">
                Real-time mention volume vs. positive sentiment curve ({dateRangeLabel})
              </p>
            </div>
            {/* Interactive Local Date Switcher on the Card */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(["today", "7d", "30d", "quarter", "year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    dateRange === r
                      ? "bg-primary text-white shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4C7FF7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4C7FF7" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38A169" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38A169" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: string) => [
                    formatNumber(Number(value) || 0),
                    name === "mentions" ? "Total Mentions" : name === "positive" ? "Positive Sentiment" : name,
                  ]}
                  labelFormatter={(label) => `Timeframe: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="mentions"
                  stroke="#4C7FF7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMentions)"
                  name="mentions"
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stroke="#38A169"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPositive)"
                  name="positive"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Way Competitor SOV Mini-Table */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {competitors.length <= 1 ? "Share of Voice Ownership" : `${competitors.length}-Way Share of Voice`}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {competitors.length <= 1 ? "Solo Profile" : (entityType === "individual" ? "Leaders" : "Brands")}
                </span>
              </div>
              <Link href="/competitors" className="text-xs font-bold text-primary hover:underline">
                {competitors.length <= 1 ? "Profile ↗" : "Arena ↗"}
              </Link>
            </div>

            <div className="space-y-3">
              {competitors.map((comp) => (
                <div key={comp.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {comp.logoUrl ? (
                      <img src={comp.logoUrl} alt={comp.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full ${comp.isPrimary ? "bg-primary ring-2 ring-primary/30" : "bg-slate-300"}`} />
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-[140px]">{comp.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {comp.metrics.shareOfVoicePercent}% SOV {comp.titleOrRole ? `• ${comp.titleOrRole}` : ""}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold ${comp.metrics.sentimentScore >= 80 ? "text-green" : comp.metrics.sentimentScore >= 50 ? "text-amber" : "text-coral"}`}>
                    {comp.metrics.sentimentScore}/100
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/competitors"
            className="w-full text-center py-2.5 mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all block"
          >
            {competitors.length <= 1 ? "Open Solo Profile / Add Rivals" : `Open ${competitors.length}-Way Arena Analysis`}
          </Link>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet to-primary flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Competitive Edge Recommendations</h2>
              <p className="text-xs text-slate-400">Prioritized opportunities detected by OmniPulse Intelligence Engine</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-violet-light text-violet rounded-full">
            {recommendations.length} Action Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:border-primary/40 hover:shadow-ios transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${rec.priority === "Critical" ? "bg-coral-light text-coral" : "bg-amber-light text-amber"}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Effort: {rec.estimatedEffort}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">{rec.title}</h3>
                <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">{rec.description}</p>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-700 font-medium mb-3">
                  <strong className="text-primary block">Expected Benefit:</strong>
                  {rec.expectedBenefit}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Owner: {rec.suggestedOwner}</span>
                <span className="font-bold text-slate-700">Due: {rec.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Mentions Preview Feed with Confirm URL Buttons */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Verified High-Impact Mentions</h2>
            <p className="text-xs text-slate-400">Verified posts with direct clickable source URLs for instant confirmation</p>
          </div>
          <Link href="/listening" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All Mentions ({mentions.length}) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {mentions.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <img src={item.author.avatarUrl} alt={item.author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{item.author.name}</span>
                    <span className="text-[11px] text-slate-400">{item.author.handle}</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-200 text-slate-700">
                      {item.platform}
                    </span>
                    <span className="text-[10px] font-mono text-teal">IP: {item.ipAddress}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 line-clamp-2">"{item.content}"</p>

                  <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                    <span>Source: {item.providerUsed}</span>
                    <span>Confidence: {item.confidenceScore}%</span>
                    <span>Credibility: {item.credibility.classification.replace(/_/g, " ")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-xl ${item.sentimentTrafficLight === "happy" ? "bg-green-light text-green" : "bg-coral-light text-coral"}`}>
                  {item.sentiment.replace("_", " ").toUpperCase()}
                </span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  title="Open source post URL to audit and confirm content"
                >
                  <span>Confirm Post URL</span>
                  <ExternalLink className="w-3.5 h-3.5 text-primary-light" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
