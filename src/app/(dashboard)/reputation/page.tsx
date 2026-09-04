"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { generateReputationAuditPdf } from "@/lib/pdfReportEngine";
import {
  Award,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Sliders,
  Send,
  MessageSquare,
  RefreshCw,
  Globe,
  ShieldAlert,
  Zap,
  Scale,
  Eye,
  EyeOff,
  Filter,
  Check,
  Copy,
  Download,
  Flame,
  ArrowDownRight,
  CornerDownRight,
  Lock,
  UserX,
  Radio,
  Search,
  Layers,
  ThumbsDown,
  Terminal,
  Shield,
  FileSignature,
  FileCode,
  Share2,
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

interface NegativeIncident {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  platform: "x" | "facebook" | "tiktok" | "forum" | "news" | "linkedin";
  content: string;
  timestamp: string;
  sentimentScore: number;
  viralityRisk: number; // 0 - 100
  reach: number;
  category: "customer_complaint" | "defamation" | "botnet_smear" | "competitor_astroturf" | "product_outage";
  status: "pending" | "intercepted" | "deescalated_dm" | "takedown_sent" | "seo_diluted" | "rebuttal_posted";
  ipProvenance?: string;
  location?: string;
  suggestedAction: string;
  deescalationTemplate: {
    en: string;
    bm: string;
  };
  takedownReason: string;
}

const REPUTATION_TIMELINE = [
  { month: "Jan", reputationScore: 84, npsScore: 54, esgScore: 88 },
  { month: "Feb", reputationScore: 86, npsScore: 58, esgScore: 89 },
  { month: "Mar", reputationScore: 88, npsScore: 61, esgScore: 90 },
  { month: "Apr", reputationScore: 87, npsScore: 60, esgScore: 91 },
  { month: "May", reputationScore: 90, npsScore: 65, esgScore: 93 },
  { month: "Jun", reputationScore: 91.4, npsScore: 68, esgScore: 94 },
];

const STAKEHOLDER_COHORTS = [
  {
    id: "c1",
    name: "Tier-1 Enterprise Clients",
    trustIndex: 96.2,
    sentimentPositive: 94,
    nps: "+72",
    status: "Strong Advocacy 🟢",
    drivers: "99.99% uptime, zero data residency breaches, PDPA 2.0 readiness",
    action: "Upsell multi-region disaster recovery add-on",
  },
  {
    id: "c2",
    name: "Regulatory Authorities (BNM / MDEC)",
    trustIndex: 98.0,
    sentimentPositive: 98,
    nps: "Audit Clean",
    status: "Full Compliance 🟢",
    drivers: "KMS Customer-Managed Keys, automated SAR reporting in Malaysia",
    action: "Submit Q3 compliance audit ledger",
  },
  {
    id: "c3",
    name: "Retail SME Merchants & Developers",
    trustIndex: 88.5,
    sentimentPositive: 86,
    nps: "+58",
    status: "Moderate Growth 🟡",
    drivers: "Bahasa Malaysia NLP accuracy, affordable starter tier pricing",
    action: "Launch SME developer grant program",
  },
  {
    id: "c4",
    name: "Institutional Investors & Analysts",
    trustIndex: 92.4,
    sentimentPositive: 91,
    nps: "+64",
    status: "High Confidence 🟢",
    drivers: "34.2% Market SOV, ASEAN regional expansion strategy",
    action: "Publish quarterly sustainability & AI governance brief",
  },
  {
    id: "c5",
    name: "Tech Talent & Internal Employees",
    trustIndex: 89.0,
    sentimentPositive: 87,
    nps: "+60",
    status: "Top 5 Employer 🟢",
    drivers: "AI ethics charter, remote-friendly hybrid engineering culture",
    action: "Expand AI engineering graduate trainee program in KL",
  },
];

export default function SocialMediaReputationEnginePage() {
  const { primaryEntity, ipscanFilter, entityType } = useTenant();
  const [isMounted, setIsMounted] = useState(false);
  const [activeEngineTab, setActiveEngineTab] = useState<"suppression_queue" | "takedown_legal" | "seo_dilution" | "sandbox" | "dashboard">("suppression_queue");
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Negative Incidents State
  const [incidents, setIncidents] = useState<NegativeIncident[]>([
    {
      id: "inc-101",
      author: "Azlan Tech Reviewer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
      handle: "@azlan_reviews_my",
      platform: "x",
      content: `Extremely disappointed with ${primaryEntity.name}. Critical service was down for 3 hours during peak business hours and customer care bot just gave generic answers. Lost RM15k in orders!`,
      timestamp: "12 mins ago",
      sentimentScore: 12,
      viralityRisk: 88,
      reach: 42500,
      category: "customer_complaint",
      status: "pending",
      ipProvenance: "175.143.120.45 (Maxis Fiber, PJ)",
      location: "Petaling Jaya, Selangor",
      suggestedAction: "High Virality Risk: Dispatch VIP Private DM with immediate SLA incident compensation link to take conversation off public feed.",
      deescalationTemplate: {
        en: `Hi Azlan, we sincerely apologize for the disruption caused to your business today. Our Senior Engineering Director is reviewing your account directly. Please check your DM for a direct hotline and our immediate service credit assurance.`,
        bm: `Salam Azlan, kami memohon maaf atas kesulitan yang dialami pihak tuan hari ini. Pengarah Kejuruteraan kami sedang menyemak akaun tuan secara peribadi. Sila semak DM untuk talian hotline khas dan pampasan kredit perkhidmatan.`,
      },
      takedownReason: "High-virality customer escalation - Resolve via Private Channel (De-escalation protocol).",
    },
    {
      id: "inc-102",
      author: "KL_Whistleblower_99",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
      handle: "@kl_leaks_unfiltered",
      platform: "forum",
      content: `WARNING: ${primaryEntity.name} is secretly sharing client biometric data to overseas offshore servers without consent. Ex-employee confirmed! Stay away! #ScamAlert`,
      timestamp: "34 mins ago",
      sentimentScore: 4,
      viralityRisk: 94,
      reach: 68900,
      category: "defamation",
      status: "pending",
      ipProvenance: "103.24.110.15 (VPN Exit Node, Singapore)",
      location: "Anonymized Proxy",
      suggestedAction: "Severe Defamation / Yellow Journalism: Issue Section 233 CMA Legal Notice & deploy authoritative PDPA 2.0 Compliance Audit rebuttal.",
      deescalationTemplate: {
        en: `Official Notice: This claim is completely false and defamatory. ${primaryEntity.name} is 100% hosted in Cyberjaya Sovereign Cloud under BNM / PDPA 2.0 KMS encryption. Legal notice has been served to hosting provider under Section 233 CMA 1998.`,
        bm: `Kenyataan Rasmi: Dakwaan ini adalah palsu dan berunsur fitnah. ${primaryEntity.name} beroperasi 100% di Pusat Data Berdaulat Cyberjaya di bawah pematuhan PDPA 2.0 & BNM. Notis undang-undang Seksyen 233 Akta Komunikasi telah dikeluarkan.`,
      },
      takedownReason: "Defamation & False Information under Section 233 Communications and Multimedia Act 1998.",
    },
    {
      id: "inc-103",
      author: "CryptoBot_Alpha_4",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
      handle: "@bot_swarm_node44",
      platform: "tiktok",
      content: `${primaryEntity.name} is going bankrupt next week! Dump their stock and cancel your subscriptions immediately! #Boycott`,
      timestamp: "1 hour ago",
      sentimentScore: 2,
      viralityRisk: 76,
      reach: 31000,
      category: "botnet_smear",
      status: "pending",
      ipProvenance: "185.220.101.5 (TOR Network Relay)",
      location: "Coordinated Astroturf Swarm",
      suggestedAction: "Coordinated Botnet Smear: One-click Mass Flagging for Astroturfing & Inauthentic Behavior + Automated SEO Content Flood.",
      deescalationTemplate: {
        en: `Automated Botnet Smear detected by OmniPulse AI. Account flagged for inauthentic coordinated behavior.`,
        bm: `Serangan Botnet Automatik dikesan oleh OmniPulse AI. Akaun telah dilaporkan atas manipulasi maklumat palsu.`,
      },
      takedownReason: "Coordinated Inauthentic Behavior & Automated Astroturfing violation of Platform Terms of Service.",
    },
    {
      id: "inc-104",
      author: "Sara Lifestyle & Tech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
      handle: "@sara_mytech",
      platform: "facebook",
      content: `Tried signing up for ${primaryEntity.name} promo tier, but was billed full annual price instead. Support ticket still open after 48 hours without reply. Anyone else experiencing this?`,
      timestamp: "2 hours ago",
      sentimentScore: 24,
      viralityRisk: 62,
      reach: 18400,
      category: "customer_complaint",
      status: "pending",
      ipProvenance: "60.50.142.8 (Time dotCom, Penang)",
      location: "George Town, Penang",
      suggestedAction: "Billing Misunderstanding: Auto-refund trigger & dispatch instant voucher with empathetic reply.",
      deescalationTemplate: {
        en: `Hi Sara! So sorry for the billing confusion. We have immediately adjusted your invoice to the promotional rate and refunded the excess. Our team has DM-ed you the transaction receipt.`,
        bm: `Hai Sara! Maaf sangat atas kekeliruan caj tersebut. Pihak kami telah membetulkan invois kepada harga promosi dan memulangkan baki lebihan. Resit telah dihantar ke DM anda.`,
      },
      takedownReason: "Billing SLA Discontent - Private Resolution & Instant Refund Protocol.",
    },
  ]);

  // Sandbox State
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxPlatform, setSandboxPlatform] = useState<"x" | "facebook" | "tiktok" | "forum">("x");
  const [sandboxCategory, setSandboxCategory] = useState<"customer_complaint" | "defamation" | "botnet_smear">("defamation");
  const [sandboxResult, setSandboxResult] = useState<NegativeIncident | null>(null);
  const [isProcessingSandbox, setIsProcessingSandbox] = useState(false);

  // SEO Dilution Campaign State
  const [seoCampaigns, setSeoCampaigns] = useState([
    {
      id: "seo-1",
      keyword: `${primaryEntity.name} review & complaints`,
      status: "Active Suppression 🟢",
      targetRank: "Push negative forum threads to Page 3+",
      suppressionPower: "88.4%",
      deployedAssets: [
        "Forbes Asia Feature: AI Governance & Data Trust",
        "The Edge Malaysia: High Customer Retention Metrics",
        "Tech in Asia: Sovereign Infrastructure Case Study",
      ],
      progress: 92,
    },
    {
      id: "seo-2",
      keyword: `${primaryEntity.name} refund scam issue`,
      status: "Active Dilution 🟢",
      targetRank: "Suppress Lowyat negative thread",
      suppressionPower: "94.1%",
      deployedAssets: [
        "Official Trust Center & Instant SLA Guarantee Portal",
        "BNM Regulatory Compliance Whitepaper",
        "500+ Verified Enterprise Customer Endorsements",
      ],
      progress: 86,
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecuteAction = (id: string, newStatus: NegativeIncident["status"]) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
  };

  const handleSimulateCustomNegativePost = () => {
    if (!sandboxInput.trim()) return;
    setIsProcessingSandbox(true);

    setTimeout(() => {
      const isDefamation = sandboxInput.toLowerCase().includes("scam") || sandboxInput.toLowerCase().includes("bankrupt") || sandboxInput.toLowerCase().includes("illegal") || sandboxInput.toLowerCase().includes("cheat") || sandboxInput.toLowerCase().includes("tipu");
      const generated: NegativeIncident = {
        id: `inc-sim-${Date.now()}`,
        author: "Simulated Netizen / Detractor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
        handle: "@user_sample_rant",
        platform: sandboxPlatform,
        content: sandboxInput,
        timestamp: "Just now",
        sentimentScore: Math.floor(Math.random() * 20) + 5,
        viralityRisk: Math.floor(Math.random() * 30) + 70,
        reach: Math.floor(Math.random() * 50000) + 10000,
        category: isDefamation ? "defamation" : sandboxCategory,
        status: "pending",
        ipProvenance: "115.164.88.19 (Maxis Broadband, Selangor)",
        location: "Kuala Lumpur, Malaysia",
        suggestedAction: isDefamation
          ? "High Defamation Risk: Deploy Section 233 Legal Takedown Notice & launch Search Engine Positive Dilution Campaign."
          : "Customer Discontent: Intercept with Private DM De-escalation Protocol & VIP direct hotline token.",
        deescalationTemplate: {
          en: `Hi there, we hear your concerns regarding ${primaryEntity.name} and want to resolve this immediately. Please message us directly with your case ID so our Executive Care Team can assist you within 15 minutes.`,
          bm: `Salam, kami mengambil berat tentang maklum balas anda terhadap ${primaryEntity.name}. Sila DM kami no. rujukan anda agar Pasukan Pengurusan Eksekutif kami dapat menyelesaikan isu ini dalam masa 15 minit.`,
        },
        takedownReason: isDefamation
          ? "Defamatory allegations without factual foundation violating Section 233 Communications and Multimedia Act 1998."
          : "Customer SLA Escalation - Resolved via Private Fast-Track Channel.",
      };

      setSandboxResult(generated);
      setIncidents((prev) => [generated, ...prev]);
      setIsProcessingSandbox(false);
    }, 900);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      generateReputationAuditPdf(
        primaryEntity,
        ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Malaysia & ASEAN")
      );
      setIsGeneratingPdf(false);
    }, 600);
  };

  const filteredCohorts = selectedCohort === "all"
    ? STAKEHOLDER_COHORTS
    : STAKEHOLDER_COHORTS.filter((c) => c.id === selectedCohort);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-primary/95 text-white p-6 rounded-3xl shadow-ios border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-coral/30 text-coral-light border border-coral/40 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-coral" />
              Negative Post & Comment Suppression Engine
            </span>
            <span className="text-xs text-slate-300">Active De-escalation, Legal Takedown & SEO Dilution</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {primaryEntity.name} Social Media Reputation Shield
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Automated multi-layered defense to bring down viral negative comments, de-escalate public customer rage, generate MCMC Section 233 legal takedown notices, and push down defamatory search rankings.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-green" />
            <span>{isGeneratingPdf ? "Generating PDF..." : "Export Reputation Audit PDF"}</span>
          </button>
          <Link
            href="/counter-journalism"
            className="flex items-center gap-2 bg-coral hover:bg-coral-dark text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all"
          >
            <Scale className="w-4 h-4" />
            <span>Counter Yellow Media</span>
          </Link>
        </div>
      </div>

      {/* Suppression Engine Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: "suppression_queue", label: "🛡️ Negative Incident Suppression Queue", badge: `${incidents.filter(i => i.status === "pending").length} Pending` },
          { id: "takedown_legal", label: "⚖️ MCMC Section 233 & Platform Takedowns", badge: "Legal" },
          { id: "seo_dilution", label: "🌊 Positive SEO Flooding & Search Dilution", badge: "Page 1 Clean" },
          { id: "sandbox", label: "🧪 Live Negative Comment Simulator", badge: "Tester" },
          { id: "dashboard", label: "📊 Stakeholder Trust & Executive Equity", badge: "91.4 AA+" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveEngineTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeEngineTab === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${
              activeEngineTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* 4-Card Top Suppression Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Negative Post Neutralization Rate
            </span>
            <div className="w-9 h-9 rounded-2xl bg-green-light flex items-center justify-center text-green">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-green">89.4%</span>
            <span className="text-xs font-bold text-green flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">De-escalated offline or suppressed in &lt;15 mins</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Viral Rage De-escalation
            </span>
            <div className="w-9 h-9 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">42 Posts</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-light text-primary rounded-full">
              Taken to DM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Prevented public viral snowballing</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Legal Takedowns Dispatched
            </span>
            <div className="w-9 h-9 rounded-2xl bg-coral-light flex items-center justify-center text-coral">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">18 Notices</span>
            <span className="text-xs font-bold text-coral">Section 233 CMA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">100% compliance by local hostings & forums</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Reverse SEO Suppression
            </span>
            <div className="w-9 h-9 rounded-2xl bg-violet-light flex items-center justify-center text-violet">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">96.2%</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-light text-violet rounded-full">
              Page 1 Dominance
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Negative articles pushed below Page 2 of Google</p>
        </div>
      </div>

      {/* TAB 1: ACTIVE NEGATIVE INCIDENTS SUPPRESSION QUEUE */}
      {activeEngineTab === "suppression_queue" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-coral" />
                <span>Live Negative Comments & Threat Interception Queue</span>
              </h2>
              <p className="text-xs text-slate-400">
                Incoming critical posts prioritized by virality velocity and defamation severity with 1-click suppression actions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Showing {incidents.length} Monitored Threads</span>
            </div>
          </div>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`p-6 rounded-3xl border transition-all ${
                  incident.status === "pending"
                    ? "bg-white border-coral/40 shadow-ios"
                    : "bg-slate-50/80 border-slate-200 opacity-90"
                }`}
              >
                {/* Top Item Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={incident.avatar}
                      alt={incident.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{incident.author}</h3>
                        <span className="text-xs text-slate-400 font-mono">{incident.handle}</span>
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {incident.platform}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{incident.timestamp} • {incident.location || "Malaysia"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-coral-light text-coral flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Virality Risk: {incident.viralityRisk}%
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                      incident.status === "pending"
                        ? "bg-amber-light text-amber-dark border border-amber-300"
                        : "bg-green-light text-green border border-green-300"
                    }`}>
                      {incident.status === "pending" && "⚠️ Action Required"}
                      {incident.status === "deescalated_dm" && "✅ De-escalated (Private DM Active)"}
                      {incident.status === "takedown_sent" && "⚖️ MCMC Section 233 Notice Dispatched"}
                      {incident.status === "rebuttal_posted" && "🤖 Official Rebuttal Deployed"}
                      {incident.status === "seo_diluted" && "🌊 Positive SEO Flood Triggered"}
                    </span>
                  </div>
                </div>

                {/* Content Quote */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium mb-4">
                  "{incident.content}"
                </div>

                {/* Metadata Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] bg-white p-3 rounded-xl border border-slate-200/80 mb-4">
                  <div>
                    <span className="text-slate-400 block font-semibold">Incident Category:</span>
                    <strong className="text-slate-800 uppercase tracking-wide">{incident.category.replace("_", " ")}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Forensic IP Provenance:</span>
                    <strong className="text-slate-800 font-mono">{incident.ipProvenance}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Estimated Reach Velocity:</span>
                    <strong className="text-slate-800">{incident.reach.toLocaleString()} Impressions</strong>
                  </div>
                </div>

                {/* AI Suggested Strategy & 1-Click Action Buttons */}
                <div className="p-4 rounded-2xl bg-primary-light/20 border border-primary/20 space-y-3">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-primary block">AI Recommended Suppression Protocol:</span>
                      <p className="text-[11px] text-slate-700 font-medium">{incident.suggestedAction}</p>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-primary/20">
                    <button
                      onClick={() => handleExecuteAction(incident.id, "deescalated_dm")}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>⚡ 1-Click Private DM De-escalate</span>
                    </button>

                    <button
                      onClick={() => handleExecuteAction(incident.id, "rebuttal_posted")}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>🤖 Post Verified Fact Rebuttal</span>
                    </button>

                    <button
                      onClick={() => handleExecuteAction(incident.id, "takedown_sent")}
                      className="px-3.5 py-2 rounded-xl bg-coral text-white text-xs font-bold hover:bg-coral-dark shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>⚖️ Dispatch MCMC Section 233 Notice</span>
                    </button>

                    <button
                      onClick={() => handleExecuteAction(incident.id, "seo_diluted")}
                      className="px-3.5 py-2 rounded-xl bg-violet text-white text-xs font-bold hover:bg-violet-dark shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>🌊 Flood Positive SEO (Dilute)</span>
                    </button>
                  </div>
                </div>

                {/* Pre-Generated Dual-Language Empathy Response Box */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 truncate max-w-xl">
                    <strong className="text-slate-900 mr-1">Prepared Rebuttal (EN):</strong>
                    <span className="italic">{incident.deescalationTemplate.en}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(incident.deescalationTemplate.en, incident.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all"
                  >
                    {copiedId === incident.id ? <Check className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === incident.id ? "Copied!" : "Copy Response"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MCMC & REGULATORY TAKEDOWN GENERATOR */}
      {activeEngineTab === "takedown_legal" && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-coral" />
                  <span>Section 233 CMA 1998 & Platform Abuse Takedown Generator</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Instant legal notice compilation with forensic cryptographic hashes, server timestamps, and MCMC / Meta / X / TikTok compliance packets.
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-coral-light text-coral rounded-full">
                Formal Regulatory Dispatch
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-4 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-coral-light font-bold flex items-center gap-1.5">
                  <FileSignature className="w-4 h-4" /> FORMAL LEGAL NOTICE OF DEFAMATION & TAKEDOWN DEMAND
                </span>
                <span className="text-[10px] text-slate-400">REF: ART-LEGAL-2026-KL-092</span>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed text-slate-300">
                <p><strong className="text-white">TO:</strong> Legal Operations & Abuse Enforcement (Meta / X / TikTok / Forum Host)</p>
                <p><strong className="text-white">GOVERNING LAW:</strong> Communications and Multimedia Act 1998 (Act 588) Section 233 (Malaysia) & Global Defamation Tort</p>
                <p><strong className="text-white">AGGRIEVED PARTY:</strong> {primaryEntity.name} (Corporate / Executive Persona)</p>
                <p className="pt-2">
                  Take notice that the publication located at URL identifiers and referenced below contains false, unsubstantiated, and highly defamatory statements designed to cause severe commercial disruption and reputational harm.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-amber-300">
                  <strong>FORENSIC EVIDENCE PACKET:</strong><br />
                  - IP Provenance: 103.24.110.15 (ASN4788 Verified)<br />
                  - Cryptographic Hash (SHA-256): 9f8a84b2c12948bb82e718a38c...<br />
                  - MCMC Complaint Category: Dissemination of False and Menacing Content (Section 233)
                </div>
                <p>
                  You are hereby required to IMMEDIATELY CEASE, REMOVE, AND DE-INDEX the said defamatory publications within twenty-four (24) hours of receipt of this notice, failing which legal proceedings for injunctive relief and aggravated damages will commence.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified by ArtEDGE Automated Legal Compliance Module
                </span>
                <button
                  onClick={() => handleCopy("FORMAL LEGAL NOTICE OF DEFAMATION...\nREF: ART-LEGAL-2026-KL-092", "legal-notice")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {copiedId === "legal-notice" ? <Check className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === "legal-notice" ? "Copied Legal Packet" : "Copy Legal Dispatch"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POSITIVE SEO FLOODING & SEARCH REVERSE DILUTION */}
      {activeEngineTab === "seo_dilution" && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-violet" />
                  <span>Reverse Search Engine Optimization (SEO) & Dilution Shield</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Pushes negative search results, forum threads, and smear campaigns off Google Page 1 by deploying authoritative positive content blitzes.
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-violet-light text-violet rounded-full">
                Active Algorithmic Suppression
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {seoCampaigns.map((camp) => (
                <div key={camp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-violet-light text-violet">
                        {camp.status}
                      </span>
                      <span className="text-xs font-extrabold text-green">{camp.suppressionPower} Clean Rate</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mb-1">Target Keyword: <span className="font-mono text-primary">"{camp.keyword}"</span></h3>
                    <p className="text-[11px] text-slate-500 mb-3">{camp.targetRank}</p>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1 mb-3">
                      <strong className="text-slate-800 block text-[10px] uppercase tracking-wider">Top Flooded Authority Media:</strong>
                      {camp.deployedAssets.map((asset, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-1 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                          <span className="truncate">{asset}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>SERP Suppression Progress</span>
                        <span>{camp.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-violet h-full rounded-full" style={{ width: `${camp.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Deployed fresh high-DA positive press release for keyword "${camp.keyword}".`)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl mt-3 transition-all"
                  >
                    ⚡ Boost Positive Flood (+5 Press Releases)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE NEGATIVE COMMENT SIMULATOR / TESTER */}
      {activeEngineTab === "sandbox" && (
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span>Interactive Negative Post Suppression Sandbox & Tester</span>
            </h2>
            <p className="text-xs text-slate-400">
              Input any customer rant, troll comment, or smear post to test how the engine intercepts, analyzes risk, and formulates instant suppression protocols.
            </p>
          </div>

          {/* Input Sandbox Form */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Target Social Platform
                </label>
                <select
                  value={sandboxPlatform}
                  onChange={(e) => setSandboxPlatform(e.target.value as any)}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="x">X / Twitter</option>
                  <option value="facebook">Facebook Post / Group</option>
                  <option value="tiktok">TikTok Video / Comment</option>
                  <option value="forum">Lowyat / Reddit Forum</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Incident Threat Type
                </label>
                <select
                  value={sandboxCategory}
                  onChange={(e) => setSandboxCategory(e.target.value as any)}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="defamation">Defamation / False Allegation</option>
                  <option value="customer_complaint">Severe Customer Rage / Outage</option>
                  <option value="botnet_smear">Coordinated Botnet Smear</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Paste / Enter Negative Comment or Post Text
              </label>
              <textarea
                rows={3}
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                placeholder={`e.g. "${primaryEntity.name} is a complete scam, customer support is unresponsive and my data got stolen!"`}
                className="w-full text-xs text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSandboxInput(`${primaryEntity.name} is cheating consumers! Their refund policy is fake and customer service never answers!`)}
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  Load Sample Customer Rant
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setSandboxInput(`Whistleblower alert: ${primaryEntity.name} executive team is involved in money laundering and data leak!`)}
                  className="text-[11px] text-coral font-bold hover:underline"
                >
                  Load Sample Defamation Smear
                </button>
              </div>

              <button
                onClick={handleSimulateCustomNegativePost}
                disabled={isProcessingSandbox || !sandboxInput.trim()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessingSandbox ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
                <span>{isProcessingSandbox ? "Analyzing Threat & Compiling Protocol..." : "Execute Suppression Engine"}</span>
              </button>
            </div>
          </div>

          {/* Sandbox Live Output Card */}
          {sandboxResult && (
            <div className="p-6 rounded-3xl bg-white border-2 border-primary/30 shadow-ios space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green" /> Threat Intercepted & Suppression Protocol Ready
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-coral-light text-coral">
                  Virality Risk: {sandboxResult.viralityRisk}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 italic">
                "{sandboxResult.content}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-green-light/20 border border-green/30 space-y-2">
                  <strong className="text-green block font-bold">1. Recommended First Response (English):</strong>
                  <p className="text-slate-700 text-[11px]">{sandboxResult.deescalationTemplate.en}</p>
                </div>
                <div className="p-4 rounded-xl bg-violet-light/20 border border-violet/30 space-y-2">
                  <strong className="text-violet block font-bold">2. Recommended First Response (Bahasa Malaysia):</strong>
                  <p className="text-slate-700 text-[11px]">{sandboxResult.deescalationTemplate.bm}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  {sandboxResult.suggestedAction}
                </span>
                <button
                  onClick={() => {
                    setActiveEngineTab("suppression_queue");
                    alert("Added to Live Incident Suppression Queue!");
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-dark transition-all"
                >
                  Add to Active Queue
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: STAKEHOLDER TRUST & EXECUTIVE EQUITY DASHBOARD */}
      {activeEngineTab === "dashboard" && (
        <div className="space-y-8">
          {/* Reputation Trend Chart & Executive Image Scorecards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">6-Month Reputation & Trust Trajectory</h2>
                  <p className="text-xs text-slate-400">Monthly evolution of Brand Score, NPS, and ESG Governance Index</p>
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-green-light text-green rounded-full">
                  +7.4 Points Growth
                </span>
              </div>

              <div className="h-64 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REPUTATION_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorNps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4C7FF7" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4C7FF7" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} domain={[40, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderRadius: "16px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="reputationScore"
                        stroke="#22C55E"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRep)"
                        name="Brand Reputation Score"
                      />
                      <Area
                        type="monotone"
                        dataKey="npsScore"
                        stroke="#4C7FF7"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorNps)"
                        name="Net Promoter Index"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
                )}
              </div>
            </div>

            {/* Executive Leadership Image Index */}
            <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">Executive Image Index</h2>
                  <span className="text-xs font-bold text-slate-400">Q3 Audit</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {entityType === "individual" ? primaryEntity.name : "Group CEO & Managing Director"}
                      </span>
                      <span className="text-xs font-extrabold text-green">94.8/100</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Keynote on AI Sovereignty & ASEAN data trust at KL Summit</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Chief Technology Officer</span>
                      <span className="text-xs font-extrabold text-green">96.2/100</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Zero-trust cryptographic architecture patents certified</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Chief Compliance Officer</span>
                      <span className="text-xs font-extrabold text-green">98.5/100</span>
                    </div>
                    <p className="text-[10px] text-slate-500">PDPA 2.0 readiness praised by regulatory bodies</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadPdf}
                className="w-full text-center py-2.5 mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
              >
                Export Leadership Scorecard
              </button>
            </div>
          </div>

          {/* Stakeholder Cohort Trust Barometer */}
          <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Stakeholder Cohort Trust Barometer</h2>
                <p className="text-xs text-slate-400">Continuous sentiment and advocacy tracking segmented across 5 core stakeholder groups</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
                >
                  <option value="all">All Stakeholders ({STAKEHOLDER_COHORTS.length})</option>
                  {STAKEHOLDER_COHORTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCohorts.map((cohort) => (
                <div key={cohort.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-ios transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-900">{cohort.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-200 text-slate-800">
                        NPS {cohort.nps}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-2xl font-black text-slate-900">{cohort.trustIndex} <span className="text-xs text-slate-400 font-medium">/ 100</span></span>
                      <span className="text-xs font-bold text-green">{cohort.status}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600 mb-3 space-y-1">
                      <p><strong className="text-slate-800">Key Drivers:</strong> {cohort.drivers}</p>
                      <p><strong className="text-primary">Recommended Action:</strong> {cohort.action}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Positive Sentiment: <strong className="text-slate-700">{cohort.sentimentPositive}%</strong></span>
                    <Link href="/listening" className="text-primary font-bold hover:underline flex items-center gap-0.5">
                      View Feed ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
