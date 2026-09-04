"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import {
  Search,
  Calendar,
  AlertOctagon,
  Download,
  Building,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  RefreshCw,
  X,
  Zap,
  CheckCircle2,
  Sliders,
  Globe,
  Radio,
  Users,
  FolderArchive,
  Trash2,
  RotateCcw,
  Plus,
  History,
  Check,
  Layers,
  ArrowRight,
  Save,
  AlertTriangle,
  HelpCircle,
  Clock,
  Terminal,
  Loader2,
  MapPin,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    primaryEntity,
    crisis,
    user,
    dateRange,
    setDateRange,
    entityType,
    setEntityType,
    replenishTenantData,
    isReplenishing,
    replenishPhase,
    replenishProgress,
    replenishStatus,
    replenishTimeRemaining,
    replenishLogs,
    lastReplenishSummary,
    clearLastReplenishSummary,
    cleanDataMode,
    setCleanDataMode,
    clearWorkspaceData,
    isPromptModalOpen,
    setIsPromptModalOpen,
    isPastProjectsModalOpen,
    setIsPastProjectsModalOpen,
    pastProjects,
    activeProjectId,
    restorePastProject,
    deletePastProject,
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalMode, setModalMode] = useState<"company" | "individual">(entityType || "company");

  // Save Confirmation Dialog State (ask_save -> reconfirm_delete)
  const [confirmSaveModal, setConfirmSaveModal] = useState<"none" | "ask_save" | "reconfirm_delete">("none");

  // Modal Form State
  const [promptInput, setPromptInput] = useState("");
  const [brandInput, setBrandInput] = useState(primaryEntity?.name || "Nikhil Kumaraswamy");
  const [industryInput, setIndustryInput] = useState("Electoral Benchmarking & Constituency");
  const [competitorsInput, setCompetitorsInput] = useState("C.P. Yogeshwara, D.K. Suresh, H.D. Kumaraswamy, A. Manjunath");
  const [locationInput, setLocationInput] = useState("Ramanagara, Karnataka, India");
  const [regionInput, setRegionInput] = useState("India");
  const [sourcesInput, setSourcesInput] = useState("https://x.com/nikhilkumaraswamy, https://facebook.com/nikhilkumaraswamy, https://karnatakatoday.in");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "x",
    "news",
    "facebook",
    "youtube",
    "forums",
  ]);

  const toggleChannel = (channelKey: string) => {
    if (selectedChannels.includes(channelKey)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== channelKey));
    } else {
      setSelectedChannels([...selectedChannels, channelKey]);
    }
  };

  const companyPresets = [
    {
      label: "🏦 5 Malaysian Banks",
      brand: "Maybank",
      industry: "Banking & Fintech",
      competitors: "CIMB, Public Bank, RHB, Hong Leong Bank",
      location: "Kuala Lumpur, Malaysia",
      region: "Malaysia",
      sources: "https://maybank2u.com.my, https://x.com/mymaybank, https://thestar.com.my",
      prompt: "Compare public customer sentiment regarding mobile app reliability, transaction fees, interest rates, and SME loan approvals across all 5 banking giants.",
    },
    {
      label: "⚡ 5 EV Automotive Brands",
      brand: "Tesla Malaysia",
      industry: "Automotive & EV",
      competitors: "BYD Auto, Proton e.MAS, Smart Malaysia, Hyundai Ioniq",
      location: "Cyberjaya & Selangor, Malaysia",
      region: "Malaysia",
      sources: "https://tesla.com/en_my, https://x.com/teslamalaysia, https://paultan.org",
      prompt: "Benchmark public sentiment and owner reviews on charging network, delivery waiting time, build quality, and resale confidence across 5 EV brands.",
    },
    {
      label: "✈️ 5 Commercial Airlines",
      brand: "AirAsia",
      industry: "Aviation & Travel",
      competitors: "Malaysia Airlines, Singapore Airlines, Batik Air, Scoot Aviation",
      location: "KLIA Sepang & ASEAN",
      region: "Malaysia",
      sources: "https://airasia.com, https://x.com/airasia, https://facebook.com/airasia",
      prompt: "Analyze passenger discussions on flight delays, refund portal speed, baggage handling, airfares, and customer service satisfaction across 5 airlines.",
    },
    {
      label: "📱 5 Telecom Operators",
      brand: "Maxis",
      industry: "Telecommunications & 5G",
      competitors: "CelcomDigi, U Mobile, Unifi Mobile, Yoodo",
      location: "Kuala Lumpur & National, Malaysia",
      region: "Malaysia",
      sources: "https://maxis.com.my, https://x.com/maxis, https://lowyat.net",
      prompt: "Track 5G coverage perception, data package value, network latency complaints, and customer service responsiveness across 5 telcos.",
    },
    {
      label: "🛍️ 5 E-Commerce Platforms",
      brand: "Shopee Malaysia",
      industry: "E-Commerce & Retail",
      competitors: "Lazada ASEAN, TikTok Shop MY, Zalora, PG Mall",
      location: "Kuala Lumpur & Regional ASEAN",
      region: "Malaysia",
      sources: "https://shopee.com.my, https://x.com/shopeemy, https://facebook.com/ShopeeMY",
      prompt: "Benchmark seller fees, shipping speed, return/refund dispute resolution, and campaign voucher discounts across 5 shopping platforms.",
    },
  ];

  const individualPresets = [
    {
      label: "🗳️ 5 Political Contestants (Ramanagara)",
      brand: "Nikhil Kumaraswamy",
      industry: "Electoral Benchmarking & Constituency",
      competitors: "C.P. Yogeshwara, D.K. Suresh, H.D. Kumaraswamy, A. Manjunath",
      location: "Ramanagara, Karnataka, India",
      region: "India",
      sources: "https://x.com/nikhilkumaraswamy, https://facebook.com/nikhilkumaraswamy, https://karnatakatoday.in",
      prompt: "Compare constituency voter sentiment, campaign rally reach, infrastructure development promises, and public trust across all 5 political candidates.",
    },
    {
      label: "✈️ 5 Malaysian Public Figures",
      brand: "Tan Sri Tony Fernandes",
      industry: "Executive Leadership & Public Affairs",
      competitors: "Khairy Jamaluddin, Syed Saddiq, Rafizi Ramli, Anthony Loke",
      location: "Kuala Lumpur, Malaysia",
      region: "Malaysia",
      sources: "https://x.com/tonyfernandes, https://linkedin.com/in/tonyfernandes, https://capitala.com",
      prompt: "Compare public trust, quote virality, policy discussion sentiment, and media admiration metrics across 5 prominent figures.",
    },
    {
      label: "⚡ 5 Global Tech CEOs",
      brand: "Elon Musk",
      industry: "Global Tech Titans",
      competitors: "Sundar Pichai, Satya Nadella, Jensen Huang, Sam Altman",
      location: "San Francisco & Austin, United States",
      region: "Global",
      sources: "https://x.com/elonmusk, https://x.com/sundarpichai, https://x.com/sama",
      prompt: "Benchmark executive quote frequency, AI breakthrough perception, developer community sentiment, and leadership trust across 5 Big Tech CEOs.",
    },
    {
      label: "🏛️ 5 Governance & Policy Leaders",
      brand: "Dato' Seri Anwar Ibrahim",
      industry: "National Governance & Economy",
      competitors: "Anthony Loke, Rafizi Ramli, Tengku Zafrul, Ahmad Zahid",
      location: "Putrajaya, Malaysia",
      region: "Malaysia",
      sources: "https://x.com/anwaribrahim, https://facebook.com/anwaribrahimofficial",
      prompt: "Monitor economic reform approval sentiment, foreign direct investment speeches, and regional diplomacy reach across 5 ministers.",
    },
  ];

  const handleApplyPreset = (preset: typeof companyPresets[0]) => {
    setBrandInput(preset.brand);
    setIndustryInput(preset.industry);
    setCompetitorsInput(preset.competitors);
    setLocationInput(preset.location);
    setRegionInput(preset.region);
    setSourcesInput(preset.sources);
    setPromptInput(preset.prompt);
  };

  // Step 1 Trigger: Initiates replenishment and checks if we need to ask to save
  const handleInitiateReplenishment = () => {
    if (!brandInput.trim()) return;

    if (primaryEntity?.name && primaryEntity.name !== brandInput.trim()) {
      setConfirmSaveModal("ask_save");
    } else {
      executeReplenishment(true);
    }
  };

  const executeReplenishment = async (saveData: boolean) => {
    setConfirmSaveModal("none");
    setIsPromptModalOpen(false);

    await replenishTenantData({
      brandName: brandInput.trim(),
      industry: industryInput,
      competitorNames: competitorsInput.split(",").map((s) => s.trim()).filter(Boolean),
      prompt: promptInput,
      location: locationInput,
      region: regionInput,
      sourceChannels: selectedChannels,
      customSourceUrls: sourcesInput.split(",").map((s) => s.trim()).filter(Boolean),
      entityType: modalMode,
      saveCurrentProject: saveData,
    });
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
        {/* Entity Context & Global Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={() => {
              setModalMode(entityType);
              setIsPromptModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary-light hover:bg-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 border border-primary/30 transition-all cursor-pointer shadow-2xs"
            title="Click to replenish data or switch brand prompt"
          >
            {entityType === "individual" ? (
              <User className="w-4 h-4 text-primary" />
            ) : (
              <Building className="w-4 h-4 text-primary" />
            )}
            <span className="truncate max-w-[120px]">{primaryEntity?.name || "Active Target"}</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              ({entityType === "individual" ? "Individual" : "Company"})
            </span>
            <RefreshCw className="w-3 h-3 text-primary animate-spin-slow opacity-80" />
          </button>

          {/* Company vs Individual Segmented Control */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/80">
            <button
              onClick={() => setEntityType("company")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                entityType === "company"
                  ? "bg-white text-primary font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Compare with other Companies & Corporate Brands"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Company</span>
            </button>
            <button
              onClick={() => setEntityType("individual")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                entityType === "individual"
                  ? "bg-white text-primary font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Compare with other Individuals, Executives & Public Figures"
            >
              <User className="w-3.5 h-3.5" />
              <span>Individual</span>
            </button>
          </div>

          {/* AI Prompt Bar Trigger */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Ask AI or type ${entityType === "individual" ? "individual executive" : "company brand"} prompt...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  setPromptInput(searchQuery);
                  setBrandInput(searchQuery.split(" ")[0]);
                  setModalMode(entityType);
                  setIsPromptModalOpen(true);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-24 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  setPromptInput(searchQuery);
                  setBrandInput(searchQuery.split(" ")[0]);
                }
                setModalMode(entityType);
                setIsPromptModalOpen(true);
              }}
              className="absolute right-1.5 top-1 px-2.5 py-1 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>Replenish</span>
            </button>
          </div>
        </div>

        {/* Date Range Selector, Clean Data Switch & Past Projects */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Clean Data Switch Toggle */}
          <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span>🧹 Clean Data:</span>
              <span className={cleanDataMode ? "text-green font-black" : "text-slate-400"}>
                {cleanDataMode ? "ON" : "OFF"}
              </span>
            </span>
            <button
              onClick={() => setCleanDataMode(!cleanDataMode)}
              className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                cleanDataMode ? "bg-green" : "bg-slate-300"
              }`}
              title="When enabled, each prompt runs on a clean slate and archives prior prompt data to Past Projects"
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  cleanDataMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Past Projects Archive Button */}
          <button
            onClick={() => setIsPastProjectsModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer"
            title="View and restore archived past prompt projects"
          >
            <FolderArchive className="w-3.5 h-3.5 text-primary" />
            <span>Past Projects ({pastProjects.length})</span>
          </button>

          {/* + New Clean Comparison Button */}
          <button
            onClick={() => {
              clearWorkspaceData();
              setBrandInput("");
              setPromptInput("");
              setCompetitorsInput("");
              setModalMode(entityType);
              setIsPromptModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-light text-teal-dark hover:bg-teal hover:text-white text-xs font-bold border border-teal/30 transition-all shadow-2xs cursor-pointer"
            title="Wipe workspace and start fresh comparison prompt"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Comparison</span>
          </button>

          {/* Quick AI Replenish Data Pill */}
          <button
            onClick={() => {
              setModalMode(entityType);
              setIsPromptModalOpen(true);
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-500/30 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Replenish</span>
          </button>

          {/* Global Interactive Date Range Pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200/80">
            {(["today", "7d", "30d", "quarter", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  dateRange === range
                    ? "bg-white text-slate-900 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Live Crisis Banner Link */}
          {crisis && crisis.status === "active" && (
            <Link
              href="/crisis"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral-light text-coral text-xs font-bold animate-pulse border border-coral/30 hover:bg-coral hover:text-white transition-all"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Crisis ({crisis.mentionVelocitySpike}%)</span>
            </Link>
          )}

          {/* Export Quick Action */}
          <Link
            href="/reports"
            className="flex items-center gap-2 bg-primary text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Link>
        </div>
      </header>

      {/* TOP COMPLETION NOTIFICATION TOAST */}
      {lastReplenishSummary && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md text-xs font-semibold animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black">
              ✓
            </span>
            <span>
              <strong>Clean Replenish Complete:</strong> Wiped {lastReplenishSummary.purgedMentionsCount} old items & populated {lastReplenishSummary.populatedMentionsCount} fresh records for <strong>{lastReplenishSummary.brand}</strong> in {lastReplenishSummary.durationSeconds}s ({lastReplenishSummary.completedAt}).
            </span>
          </div>
          <button
            onClick={clearLastReplenishSummary}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Dismiss</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2-PHASE REPLENISH PROGRESS OVERLAY HUD */}
      {isReplenishing && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            {/* Modal Header with Live Time Remaining */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Cleaning & Replenishing Workspace</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary animate-pulse">
                      {replenishProgress}%
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Executing clean prompt isolation & real-time telemetry crawler.
                  </p>
                </div>
              </div>

              {/* Time Remaining Countdown Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold shrink-0">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>
                  {replenishTimeRemaining > 0
                    ? `~${replenishTimeRemaining.toFixed(1)}s left`
                    : "Finalizing..."}
                </span>
              </div>
            </div>

            {/* 2-Phase Visual Stage Tracker */}
            <div className="grid grid-cols-2 gap-3">
              {/* Phase 1 Box: Purging Old Data */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  replenishPhase === "purging"
                    ? "bg-coral-light/30 border-coral shadow-xs"
                    : replenishProgress >= 45
                    ? "bg-slate-50 border-slate-200 opacity-90"
                    : "bg-slate-50 border-slate-200/60 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <span>Phase 1</span>
                  </span>
                  {replenishProgress >= 45 ? (
                    <span className="text-[10px] font-bold text-green flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-green" /> Cleared
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-coral flex items-center gap-0.5 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Purging...
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🧹 Purge Old Data</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Wipes prior mentions, competitor models & caches
                </p>
              </div>

              {/* Phase 2 Box: Populating Clean Data */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  replenishPhase === "populating" || replenishPhase === "complete"
                    ? "bg-teal-light/30 border-teal shadow-xs"
                    : "bg-slate-50 border-slate-200/60 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Phase 2
                  </span>
                  {replenishPhase === "complete" ? (
                    <span className="text-[10px] font-bold text-green flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-green" /> Populated
                    </span>
                  ) : replenishPhase === "populating" ? (
                    <span className="text-[10px] font-bold text-teal flex items-center gap-0.5 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Crawling...
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Waiting</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>⚡ Populate Clean Data</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Synthesizes 6 channels, 5-way arena & sentiment NLP
                </p>
              </div>
            </div>

            {/* Live Progress Bar & Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Progress</span>
                <span className="text-primary font-black">{replenishProgress}% Complete</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-coral via-amber-500 to-teal h-2 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${replenishProgress}%` }}
                />
              </div>
              <p className="text-xs font-bold text-slate-800 bg-slate-100/90 p-2.5 rounded-xl border border-slate-200/80 text-center">
                {replenishStatus || "Processing prompt telemetry..."}
              </p>
            </div>

            {/* Live Terminal Console Log Stream */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Real-Time Operation Feed</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">LIVE CRAWLER</span>
              </div>

              <div className="bg-slate-950 text-slate-300 font-mono text-[11px] p-3 rounded-2xl border border-slate-800 max-h-32 overflow-y-auto space-y-1 shadow-inner">
                {replenishLogs.length === 0 ? (
                  <p className="text-slate-500 italic">Initializing execution stream...</p>
                ) : (
                  replenishLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-teal font-bold">{">"}</span>
                      <span className={log.includes("✓") ? "text-green-400 font-semibold" : log.includes("Purging") ? "text-amber-300 font-semibold" : "text-slate-300"}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI PROMPT & DATA REPLENISH MODAL */}
      {isPromptModalOpen && !isReplenishing && (
        <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-card border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Sticky Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Start New 5-Entity Benchmark Comparison
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Compare 5 new companies or 5 new individuals. Location & data sources are customizable.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

            {/* Mode Tabs: 5 Companies vs 5 Individuals */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setModalMode("company");
                  handleApplyPreset(companyPresets[0]);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  modalMode === "company"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>🏢 5 Companies Comparison</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMode("individual");
                  handleApplyPreset(individualPresets[0]);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  modalMode === "individual"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <User className="w-4 h-4" />
                <span>👤 5 Individuals Comparison</span>
              </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ⚡ Quick 1-Click 5-Entity Presets ({modalMode === "company" ? "5 Companies" : "5 Individuals"})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(modalMode === "company" ? companyPresets : individualPresets).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      brandInput === preset.brand
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-primary-light hover:border-primary/40"
                    }`}
                  >
                    <div className="font-bold">{preset.label}</div>
                    <div className={`text-[10px] truncate ${brandInput === preset.brand ? "text-white/80" : "text-slate-500"}`}>
                      {preset.brand}, {preset.competitors}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom 5-Entity Inputs Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    1. Primary Entity Name ({modalMode === "company" ? "Target Company" : "Target Individual"})
                  </label>
                  <input
                    type="text"
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="e.g. Maybank / Tesla / Tony Fernandes / D.K. Suresh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Industry / Sector / Election Category
                  </label>
                  <input
                    type="text"
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    placeholder="e.g. Banking & Fintech, Automotive EV, Politics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  2 to 5. The Other 4 Comparison Entities (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={competitorsInput}
                  onChange={(e) => setCompetitorsInput(e.target.value)}
                  placeholder="e.g. C.P. Yogeshwara, D.K. Suresh, H.D. Kumaraswamy, A. Manjunath"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Total of 5 entities will be benchmarked: {brandInput || "Primary Target"} + 4 peers.
                </p>
              </div>

              {/* LOCATION & GEOGRAPHIC SCOPE SECTION */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal" />
                  <span className="text-xs font-bold text-slate-900">
                    📍 Target Location & Geographic Scope
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      City / Constituency / District / State
                    </label>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="e.g. Ramanagara, Karnataka / Kuala Lumpur"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Country / National Territory
                    </label>
                    <select
                      value={regionInput}
                      onChange={(e) => setRegionInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
                    >
                      <option value="India">India (Karnataka / National)</option>
                      <option value="Malaysia">Malaysia (ASEAN Sovereign Hub)</option>
                      <option value="Singapore">Singapore (Regional APAC)</option>
                      <option value="United States">United States & North America</option>
                      <option value="Global">Global / Worldwide</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SOURCES FOR THE PERSON / MONITORED DATA STREAMS */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-slate-900">
                      📡 Monitored Data Sources & Profile URLs for {brandInput || "the Person"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedChannels.length} Channels Active
                  </span>
                </div>

                {/* Source Channel Toggles */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "x", label: "🐦 X (Twitter) Feeds" },
                    { id: "news", label: "📰 Regional News & Press Wires" },
                    { id: "facebook", label: "📸 Meta (Facebook & Instagram)" },
                    { id: "youtube", label: "📺 YouTube Speeches & Transcripts" },
                    { id: "forums", label: "💬 Local Community Forums & Web" },
                  ].map((ch) => {
                    const isChecked = selectedChannels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => toggleChannel(ch.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? "bg-primary text-white shadow-2xs"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{isChecked ? "✓" : "+"}</span>
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Specific URLs and Handles input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Specific Source URLs, Handles, or Portals for the Person (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={sourcesInput}
                    onChange={(e) => setSourcesInput(e.target.value)}
                    placeholder="e.g. https://x.com/nikhilkumaraswamy, https://facebook.com/nikhilkumaraswamy, https://karnatakatoday.in"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Crawlers and IPSCAN telemetry will prioritize posts and sentiment directly from these sources.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Comparison Prompt / Strategic Objective
                </label>
                <textarea
                  rows={2}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Compare public voter sentiment, ground rally turnout, public trust index, and manifesto development promises across all 5 candidates."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Clean Data Switch on Prompt Generation */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-light flex items-center justify-center text-teal font-bold text-xs">
                  🧹
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Clean Workspace for New Comparison
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Wipes previous data from memory and prompts to archive or delete as per your selection.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCleanDataMode(!cleanDataMode)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  cleanDataMode ? "bg-green" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    cleanDataMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sticky Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPromptModalOpen(false);
                    setIsPastProjectsModalOpen(true);
                  }}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Past Projects ({pastProjects.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => executeReplenishment(false)}
                  disabled={!brandInput.trim()}
                  title="Wipe previous data and start fresh comparison immediately without saving snapshot"
                  className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Wipe & Start Fresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleInitiateReplenishment}
                  disabled={!brandInput.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white text-xs font-extrabold rounded-xl shadow-md shadow-primary/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Start Comparison</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: ASK TO SAVE EXISTING PROJECT DIALOG */}
      {confirmSaveModal === "ask_save" && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-light text-teal-dark flex items-center justify-center shrink-0 shadow-xs">
                <Save className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Save Existing Project Data?
                </h3>
                <p className="text-xs text-slate-500">
                  Active Workspace Snapshot Check
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <p>
                You have active comparison data for <strong className="text-slate-900">{primaryEntity?.name}</strong> ({entityType === "individual" ? "Individual" : "Company"}).
              </p>
              <p className="text-[11px] text-slate-500">
                Would you like to save this project snapshot into your <strong>Past Projects Archive</strong> before launching the new prompt for <strong className="text-primary">{brandInput}</strong>?
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => executeReplenishment(true)}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Yes, Save to Past Projects & Continue</span>
              </button>

              <button
                onClick={() => setConfirmSaveModal("reconfirm_delete")}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>No, Don't Save (Discard)</span>
              </button>

              <button
                onClick={() => setConfirmSaveModal("none")}
                className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: RECONFIRM PERMANENT DATA DELETION / DISCARD DIALOG */}
      {confirmSaveModal === "reconfirm_delete" && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border-2 border-coral/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-coral-light text-coral flex items-center justify-center shrink-0 shadow-xs animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-coral">
                  Confirm Permanent Data Deletion
                </h3>
                <p className="text-xs text-slate-500">
                  Irreversible Action Warning
                </p>
              </div>
            </div>

            <div className="p-4 bg-coral-light/20 rounded-2xl border border-coral/30 text-xs text-slate-700 space-y-2">
              <p className="font-bold text-coral-dark">
                Are you sure you want to permanently discard the current project data for {primaryEntity?.name}?
              </p>
              <p className="text-[11px] text-slate-600">
                If you proceed without saving, all current mentions, competitor benchmarks, sentiment graphs, and leads for <strong>{primaryEntity?.name}</strong> will be permanently deleted and cannot be recovered.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => executeReplenishment(false)}
                className="w-full py-2.5 px-4 bg-coral hover:bg-coral-dark text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Permanently Delete & Start New Comparison</span>
              </button>

              <button
                onClick={() => executeReplenishment(true)}
                className="w-full py-2.5 px-4 bg-teal-light text-teal-dark hover:bg-teal hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Wait, Save Project First</span>
              </button>

              <button
                onClick={() => setConfirmSaveModal("none")}
                className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                Abort & Keep Current Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAST PROJECTS & BENCHMARK ARCHIVE MODAL */}
      {isPastProjectsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Past Projects & Benchmark Archive</span>
                    <span className="px-2.5 py-0.5 text-xs font-extrabold bg-primary/10 text-primary rounded-full">
                      {pastProjects.length} Projects
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Each prompt execution is preserved as an isolated past project snapshot that you can restore or compare.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPastProjectsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Past Projects List */}
            {pastProjects.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <FolderArchive className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-xs font-medium">No past projects archived yet.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {pastProjects.map((project) => {
                  const isActive = activeProjectId === project.id;
                  return (
                    <div
                      key={project.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-primary-light/30 border-primary shadow-xs"
                          : "bg-slate-50 hover:bg-white border-slate-200/80 hover:shadow-ios"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider ${
                            project.entityType === "individual" ? "bg-violet-light text-violet" : "bg-teal-light text-teal-dark"
                          }`}>
                            {project.entityType}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{project.projectName}</h4>
                          {isActive && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-green-light text-green rounded-full flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Active in Workspace
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {project.createdAt}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 italic mb-3 bg-white p-2.5 rounded-xl border border-slate-200/60 line-clamp-2">
                        "{project.prompt}"
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] pt-2 border-t border-slate-200/60">
                        <div className="text-slate-500 truncate max-w-sm">
                          <strong className="text-slate-700">Competitors:</strong> {project.competitors.join(", ") || "None"}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              restorePastProject(project.id);
                              setIsPastProjectsModalOpen(false);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isActive
                                ? "bg-primary text-white"
                                : "bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
                            }`}
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isActive ? "Currently Active" : "Restore Project"}</span>
                          </button>

                          <button
                            onClick={() => deletePastProject(project.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-coral hover:bg-coral-light/30 transition-all"
                            title="Delete Past Project Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">
                Clean Data mode keeps past comparisons preserved here safely.
              </span>
              <button
                onClick={() => {
                  setIsPastProjectsModalOpen(false);
                  clearWorkspaceData();
                  setIsPromptModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-teal-light text-teal-dark font-bold hover:bg-teal hover:text-white transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start New Clean Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
