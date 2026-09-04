"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { generateCounterYellowJournalismPdf } from "@/lib/pdfReportEngine";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Search,
  Scale,
  Send,
  Copy,
  Check,
  Radio,
  Newspaper,
  Flame,
  Zap,
  Globe,
  Share2,
  Sparkles,
} from "lucide-react";

const MEDIA_OUTLETS_INTEGRITY = [
  {
    outlet: "The Edge Malaysia",
    tier: "Tier-1 Financial Press",
    credibilityScore: 98,
    stance: "Balanced & Objective",
    protocol: "Direct Press Release Wire & Executive Briefings",
    badge: "Reputable 🟢",
  },
  {
    outlet: "Bernama News Agency",
    tier: "National News Wire",
    credibilityScore: 99,
    stance: "Official Record",
    protocol: "Government & Regulatory Disclosures",
    badge: "Reputable 🟢",
  },
  {
    outlet: "Verified Tech Reviewers & News",
    tier: "Verified Reviewers",
    credibilityScore: 92,
    stance: "Product & Technical Focus",
    protocol: "Feature Briefings & Sandbox Access",
    badge: "High Credibility 🟢",
  },
  {
    outlet: "ViralTek & Blogspots",
    tier: "Unregulated Tabloids",
    credibilityScore: 24,
    stance: "Sensationalist / Clickbait",
    protocol: "Immediate Cease-and-Desist + Right of Reply",
    badge: "Yellow Journalism 🔴",
  },
  {
    outlet: "Anonymous Forum Rings",
    tier: "Community Discussion",
    credibilityScore: 38,
    stance: "Speculative / Sockpuppets",
    protocol: "Forensic IP Provenance Tracking & Pin Rebuttals",
    badge: "High Smear Risk 🟡",
  },
];

export default function CounterYellowJournalismPage() {
  const { primaryEntity, ipscanFilter } = useTenant();
  const isIndividual = primaryEntity.type === "individual";

  const smearIncidents = React.useMemo(() => {
    if (isIndividual) {
      return [
        {
          id: "sm1",
          headline: `Sensationalist Tabloid: 'Unverified speculation regarding ${primaryEntity.name} development commitments'`,
          outlet: "ViralTek Tabloid & Anonymous Blog",
          outletType: "Sensationalist Yellow Media (Credibility: 24/100)",
          status: "Debunked & Rebutted 🟢",
          publishedDate: "2026-08-28",
          viralityScore: 78,
          claimSummary: `Unverified anonymous post alleging delays on regional public welfare and development projects.`,
          factCheckProof: "Independent constituency audit and verified government development disclosures attached. Zero discrepancy recorded.",
          legalActionTaken: "Formal Cease-and-Desist + Right-of-Reply dispatched. Retraction statement posted by editor.",
          rebuttalStatement: `${primaryEntity.name} operates with transparent public accountability and verified grassroots delivery records. Claims of non-delivery are verifiably false.`,
          botAmplification: "18 duplicate bot accounts detected originating from AS13335 (Cloudflare proxy). Platform abuse ticket filed.",
        },
        {
          id: "sm2",
          headline: `Speculative Community Thread: 'Fabricated statements regarding ${primaryEntity.name} regional policy support'`,
          outlet: "Regional Community Forum",
          outletType: "Anonymous Community Forum (Credibility: 42/100)",
          status: "Clarified with Official Transcript 🟢",
          publishedDate: "2026-08-29",
          viralityScore: 45,
          claimSummary: "Forum rumor quoting an out-of-context video clip regarding local economic policies.",
          factCheckProof: "Full unedited video recording and signed public transcript published on official channels.",
          legalActionTaken: "Community moderator pinned verified official clarification response.",
          rebuttalStatement: `The circulating clip was heavily edited. The complete speech transcript and authentic recording are available at ${primaryEntity.websiteUrl || "official channels"}.`,
          botAmplification: "Organic discussion with 4 competitor sockpuppet accounts identified.",
        },
        {
          id: "sm3",
          headline: `Clickbait Portal: 'Misleading claims regarding political alliances in regional constituency'`,
          outlet: "BizBuzz Asia Portal",
          outletType: "Aggregator Clickbait (Credibility: 35/100)",
          status: "Firm Rebuttal Issued 🟢",
          publishedDate: "2026-08-30",
          viralityScore: 62,
          claimSummary: "Fabricated alliance rumors designed to create public confusion ahead of key constituency votes.",
          factCheckProof: "Official party secretariat signed declaration confirming independent electoral stance.",
          legalActionTaken: "Official clarification disclosure released via national press wire.",
          rebuttalStatement: `${primaryEntity.name} maintains a clear and principled commitment to the constituency. Official announcements are released exclusively through verified channels.`,
          botAmplification: "Coordinated cross-posting across 6 social groups.",
        },
      ];
    }

    return [
      {
        id: "sm1",
        headline: `Sensationalist Tabloid: '${primaryEntity.name} faces catastrophic regional data leakage risk'`,
        outlet: "ViralTek Tabloid & Anonymous Blog",
        outletType: "Sensationalist Yellow Media (Credibility: 24/100)",
        status: "Debunked & Rebutted 🟢",
        publishedDate: "2026-08-28",
        viralityScore: 78,
        claimSummary: "Unverified anonymous post alleging customer records unencrypted on cloud database.",
        factCheckProof: "Independent cybersecurity audit certificate verified AES-256 KMS customer encryption. Zero breaches recorded.",
        legalActionTaken: "Formal Cease-and-Desist + Right-of-Reply dispatched. Retraction statement posted by editor.",
        rebuttalStatement: `${primaryEntity.name} operates exclusively on secure customer-managed KMS encryption compliant with data protection guidelines. Claims of unencrypted storage are verifiably false.`,
        botAmplification: "18 duplicate bot accounts detected originating from AS13335 (Cloudflare proxy). Platform abuse ticket filed.",
      },
      {
        id: "sm2",
        headline: `Speculative Thread: '${primaryEntity.name} quietly implementing 40% hidden fee hikes'`,
        outlet: "Community Tech Forum",
        outletType: "Anonymous Community Forum (Credibility: 42/100)",
        status: "Clarified with Public SLA 🟢",
        publishedDate: "2026-08-29",
        viralityScore: 45,
        claimSummary: "Forum rumor claiming existing annual contracts will face mid-term price increases.",
        factCheckProof: "Official 3-year pricing freeze contract policy published on official portal with transparent tier breakdown.",
        legalActionTaken: "Community moderator pinned verified official clarification response.",
        rebuttalStatement: `All active enterprise contracts carry a guaranteed price lock. Transparent pricing tiers are publicly published on our verified portal.`,
        botAmplification: "Organic discussion with 4 competitor sockpuppet accounts identified.",
      },
      {
        id: "sm3",
        headline: `Clickbait Portal: 'Market rumors claim ${primaryEntity.name} facing hostile asset restructuring'`,
        outlet: "BizBuzz Asia Portal",
        outletType: "Aggregator Clickbait (Credibility: 35/100)",
        status: "Firm Rebuttal Issued 🟢",
        publishedDate: "2026-08-30",
        viralityScore: 62,
        claimSummary: "Fabricated corporate rumor designed to create uncertainty among clients.",
        factCheckProof: "Official regulatory corporate disclosure confirming 100% stable ownership and zero restructuring discussions.",
        legalActionTaken: "Official regulatory clarification disclosure released via news wire.",
        rebuttalStatement: `${primaryEntity.name} remains completely independent and financially sound. No restructuring or unannounced divestment is under discussion.`,
        botAmplification: "Coordinated cross-posting across 6 social groups.",
      },
    ];
  }, [primaryEntity, isIndividual]);

  const [selectedIncident, setSelectedIncident] = useState<string>("sm1");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<{ [key: string]: boolean }>({});

  const activeIncident = smearIncidents.find((i) => i.id === selectedIncident) || smearIncidents[0];

  const handleCopyRebuttal = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDispatchNotice = (id: string) => {
    setDispatchStatus((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert(`Legal Right-of-Reply & Cease-and-Desist Notice dispatched to editors and legal counsel for incident: ${id}`);
    }, 400);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      generateCounterYellowJournalismPdf(
        primaryEntity,
        ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Malaysia & ASEAN")
      );
      setIsGeneratingPdf(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white p-6 rounded-3xl shadow-ios border border-red-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-coral/30 text-coral-light border border-coral/30 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-coral-light" />
              Counter Yellow Journalism & Smear Defense
            </span>
            <span className="text-xs text-slate-300">Forensic Fact-Check & Legal War Room</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {primaryEntity.name} Smear Neutralization War Room
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time clickbait detection, sensationalist tabloid debunking, automated legal demand letter dispatcher, and coordinated bot amplifier ring neutralization.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-coral hover:bg-coral-dark text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>{isGeneratingPdf ? "Generating Dossier..." : "Rebuttal Dossier PDF"}</span>
          </button>
          <Link
            href="/reputation"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all border border-white/10"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Reputation Command</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Unrebutted Smears
            </span>
            <div className="w-9 h-9 rounded-2xl bg-green-light flex items-center justify-center text-green">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-green">0</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-green-light text-green rounded-full">
              100% Contained
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">All yellow journalism neutralized within &lt;1 hour</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fact-Check Debunked Claims
            </span>
            <div className="w-9 h-9 rounded-2xl bg-coral-light flex items-center justify-center text-coral">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">4 <span className="text-xs text-slate-400 font-medium">Claims</span></span>
            <span className="text-xs font-bold text-coral">Evidentiary Proof</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Backed by MCMC & CyberSecurity Malaysia audits</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Right-of-Reply Dispatch
            </span>
            <div className="w-9 h-9 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">100%</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-light text-primary rounded-full">
              Automated
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Legal letters dispatched to editors & publishers</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bot Amplifier Ring Status
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-light flex items-center justify-center text-amber">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">18 <span className="text-xs text-slate-400 font-medium">Bots</span></span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-coral-light text-coral rounded-full">
              Flagged & Suspended
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">AS13335 network sockpuppets reported to X/FB</p>
        </div>
      </div>

      {/* Claim-by-Claim Forensic Fact-Checking & Rebuttal Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smear List */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <h2 className="text-base font-bold text-slate-900 mb-2">Detected Smear Incidents</h2>
          <p className="text-xs text-slate-400 mb-4">Select an incident to view forensic proof and legal rebuttal</p>

          <div className="space-y-3">
            {smearIncidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(inc.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedIncident === inc.id
                    ? "bg-red-50 border-coral shadow-sm ring-1 ring-coral/40"
                    : "bg-slate-50/70 border-slate-200/70 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {inc.publishedDate}
                  </span>
                  <span className="text-[10px] font-bold text-coral flex items-center gap-1">
                    <Flame className="w-3 h-3 text-coral" /> Virality: {inc.viralityScore}/100
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5 leading-snug">
                  {inc.headline}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate max-w-[160px]">{inc.outlet}</span>
                  <span className="text-green font-bold">Debunked 🟢</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Forensic Rebuttal Detail View */}
        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-coral-light text-coral uppercase tracking-wider">
                  Forensic Claim Analysis
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-1">
                  {activeIncident.headline}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Source: {activeIncident.outlet} ({activeIncident.outletType})</p>
              </div>

              <span className="px-3 py-1 text-xs font-extrabold bg-green-light text-green rounded-full self-start sm:self-center">
                {activeIncident.status}
              </span>
            </div>

            {/* Allegation vs Truth Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-coral mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Sensationalist Allegation:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{activeIncident.claimSummary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-green-50/60 border border-green-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Forensic Fact-Check:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{activeIncident.factCheckProof}</p>
              </div>
            </div>

            {/* Official Rebuttal Press Release */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" /> Official Rebuttal & Cease-and-Desist Statement
                </span>
                <button
                  onClick={() => handleCopyRebuttal(activeIncident.rebuttalStatement, activeIncident.id)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
                >
                  {copiedId === activeIncident.id ? <Check className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === activeIncident.id ? "Copied!" : "Copy Statement"}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                "{activeIncident.rebuttalStatement}"
              </p>
            </div>

            {/* Bot Amplifier Detection */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 mb-4 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber mt-0.5 shrink-0" />
              <div>
                <strong>Coordinated Inauthentic Behavior (CIB) Tracing:</strong>
                <p className="text-[11px] text-amber-800 mt-0.5">{activeIncident.botAmplification}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Legal Action: {activeIncident.legalActionTaken}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDispatchNotice(activeIncident.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-coral-light" />
                <span>{dispatchStatus[activeIncident.id] ? "Notice Dispatched" : "Dispatch Legal Demand"}</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-coral hover:bg-coral-dark text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>Export Dossier PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Outlet Credibility & Yellow Journalism Filter Matrix */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white shadow-md">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Media Outlet Credibility & Yellow Journalism Filter</h2>
              <p className="text-xs text-slate-400">Automated classification of regional publications and engagement protocols</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
            5 Monitored Tiers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MEDIA_OUTLETS_INTEGRITY.map((outlet, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-ios transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{outlet.outlet}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${outlet.credibilityScore >= 80 ? "bg-green-light text-green" : outlet.credibilityScore >= 50 ? "bg-amber-light text-amber" : "bg-coral-light text-coral"}`}>
                    {outlet.badge}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-2">{outlet.tier}</span>

                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-black text-slate-900">{outlet.credibilityScore} <span className="text-xs text-slate-400 font-medium">/ 100</span></span>
                  <span className="text-xs font-semibold text-slate-600">Stance: {outlet.stance}</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 text-[10px] text-slate-600 mb-3">
                  <strong className="text-primary block">Engagement Protocol:</strong>
                  {outlet.protocol}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Automated NLP Filter</span>
                <Link href="/listening" className="text-primary font-bold hover:underline">
                  Filter Feed ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Award(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
