"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import { ShieldCheck, AlertTriangle, Search, CheckCircle2, Network, ExternalLink, HelpCircle, UserCheck, RotateCw } from "lucide-react";

export default function CredibilityRiskPage() {
  const { mentions, primaryEntity, refreshCurrentData, isReplenishing } = useTenant();
  const isIndividual = primaryEntity.type === "individual";
  const [factCheckQuery, setFactCheckQuery] = useState(`${primaryEntity.name} verification query`);
  const [factCheckResults, setFactCheckResults] = useState<Array<{
    claim: string;
    publisher: string;
    rating: string;
    url: string;
    date: string;
  }>>([]);

  // Automatically refresh credibility and fact-check records when primaryEntity changes or is updated
  useEffect(() => {
    setFactCheckQuery(`${primaryEntity.name} verification query`);
    setFactCheckResults([
      {
        claim: isIndividual
          ? `Unverified speculation regarding ${primaryEntity.name} constituency welfare delivery and funding`
          : `Unsubstantiated operational security rumor targeting ${primaryEntity.name}`,
        publisher: isIndividual ? "Regional Electoral & Development Verification Desk" : "Independent Cyber Security Audit Desk",
        rating: "FALSE (Unsubstantiated Rumor)",
        url: "https://artedge.app/fact-check",
        date: "2026-09-02",
      },
      {
        claim: isIndividual
          ? `${primaryEntity.name} official civic roadmap and community initiatives verified`
          : `${primaryEntity.name} verified enterprise partnership and service expansion`,
        publisher: "Official State News & Verified Press Wire",
        rating: "TRUE (Verified Official Press Release)",
        url: "https://artedge.app/press",
        date: "2026-09-05",
      },
      {
        claim: isIndividual
          ? `Allegations of unauthorized rally endorsement by ${primaryEntity.name}`
          : `Market rumor regarding supply chain suspension for ${primaryEntity.name}`,
        publisher: "FactCheck National Bureau",
        rating: "MISLEADING (Out of Context Video)",
        url: "https://artedge.app/fact-check",
        date: "2026-09-06",
      },
    ]);
  }, [primaryEntity.name, isIndividual]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-violet to-primary text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-violet-light" />
            <span className="text-xs font-bold text-violet-light uppercase tracking-wider">Explainable AI Risk Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Credibility & Manipulation Risk: {primaryEntity.name}</h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            Dual-metric explainable risk assessment evaluating evidence corroboration, source transparency, and bot network amplification without automatic legal judgements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshCurrentData(false)}
            disabled={isReplenishing}
            className="px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-60"
            title="Re-run credibility verification analysis"
          >
            <RotateCw className={`w-3.5 h-3.5 text-primary ${isReplenishing ? "animate-spin" : ""}`} />
            <span>{isReplenishing ? "Scanning..." : "Re-scan Target"}</span>
          </button>
          <div className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20">
            Fact Check Tools API Integrated
          </div>
        </div>
      </div>

      {/* Dual Scores KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Evidence & Credibility Score
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-green-light text-green rounded-full">
              92 / 100 (High Trust)
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Evaluates original source transparency, author history, primary evidence presence, and independent corroboration.
          </p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-green h-full rounded-full" style={{ width: "92%" }} />
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              2. Manipulation Risk Score
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-green-light text-green rounded-full">
              12 / 100 (Low Risk)
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Detects sensational headline mismatch, coordinated posting velocity, new bot account clusters, and deepfake signals.
          </p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-teal h-full rounded-full" style={{ width: "12%" }} />
          </div>
        </div>
      </div>

      {/* Coordinated Activity Network Visualizer Simulation */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-light text-coral flex items-center justify-center font-bold">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Coordinated Amplification Network Detector</h2>
              <p className="text-xs text-slate-400">Cluster detection based on temporal posting window, hash similarity & bot networks</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-coral-light text-coral rounded-full">
            1 Cluster Flagged
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-coral uppercase tracking-wider">Cluster #8812 - Unverified Data Leak Bot Wave</span>
              <p className="text-xs text-slate-600 mt-0.5">520 retweets/posts generated within a 3-minute window across 48 automated accounts.</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-coral text-white rounded-xl">
              Possible Coordinated Amplification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Account Creation Pattern:</strong>
              <span className="text-slate-600">89% accounts created within last 14 days without bio or profile photo.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Text Hash Match:</strong>
              <span className="text-slate-600">Identical 140-character phrase repeated word-for-word across all 48 posts.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Human Review Status:</strong>
              <span className="font-bold text-green">Human Analyst Reviewed & Flagged False</span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Fact Check Tools API Integration Simulator */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900">Google Fact Check Tools Query Simulator</h2>
          <p className="text-xs text-slate-400">Search verified fact-checking databases for claims and news assertions</p>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={factCheckQuery}
            onChange={(e) => setFactCheckQuery(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => alert(`Queried Google Fact Check API for: "${factCheckQuery}"`)}
            className="bg-primary text-white font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-primary-dark"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Claims</span>
          </button>
        </div>

        <div className="space-y-3">
          {factCheckResults.map((fc, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{fc.claim}</span>
                <span className="text-[11px] text-slate-500">Publisher: {fc.publisher} • {fc.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-xl ${fc.rating.includes("TRUE") ? "bg-green-light text-green" : "bg-coral-light text-coral"}`}>
                  {fc.rating}
                </span>
                <a href={fc.url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
