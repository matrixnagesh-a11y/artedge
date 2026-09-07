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
  UserCheck,
  Swords,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    primaryEntity,
    competitors,
    crisis,
    user,
    dateRange,
    setDateRange,
    entityType,
    setEntityType,
    replenishTenantData,
    refreshCurrentData,
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
    promptModalScope,
    setPromptModalScope,
    isPastProjectsModalOpen,
    setIsPastProjectsModalOpen,
    pastProjects,
    activeProjectId,
    restorePastProject,
    deletePastProject,
    trialDaysRemaining,
    trialDaysElapsed,
    setIsPaidUpgradeModalOpen,
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalMode, setModalMode] = useState<"company" | "individual">(entityType || "individual");

  // Individuals list (Slots 1 to 5) - Supports 1 individual (solo) up to 5 individuals
  const [individuals, setIndividuals] = useState<string[]>(() => {
    if (!primaryEntity?.name) return ["Nikhil Kumaraswamy", "C.P. Yogeshwara", "D.K. Suresh", "H.D. Kumaraswamy", "A. Manjunath"];
    const rivals = competitors.filter((c) => !c.isPrimary).map((c) => c.name);
    return [primaryEntity.name, ...rivals, "", "", "", ""].slice(0, 5);
  });

  const [commaInput, setCommaInput] = useState(() => {
    if (!primaryEntity?.name) return "Nikhil Kumaraswamy, C.P. Yogeshwara, D.K. Suresh, H.D. Kumaraswamy, A. Manjunath";
    const rivals = competitors.filter((c) => !c.isPrimary).map((c) => c.name);
    return [primaryEntity.name, ...rivals].join(", ");
  });

  // Modal Form Details
  const [promptInput, setPromptInput] = useState("");
  const [industryInput, setIndustryInput] = useState("Constituency Leadership & Representation");
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

  const updateIndividualSlot = (index: number, value: string) => {
    setIndividuals((prev) => {
      const next = [...prev];
      next[index] = value;
      setCommaInput(next.filter(Boolean).join(", "));
      return next;
    });
  };

  const handleCommaInputChange = (value: string) => {
    setCommaInput(value);
    const parsed = value.split(",").map((s) => s.trim());
    setIndividuals([parsed[0] || "", parsed[1] || "", parsed[2] || "", parsed[3] || "", parsed[4] || ""]);
  };

  const clearAllIndividuals = () => {
    setIndividuals(["", "", "", "", ""]);
    setCommaInput("");
  };

  const individualPresets = [
    {
      label: "👤 Solo: Nikhil Kumaraswamy",
      names: ["Nikhil Kumaraswamy"],
      industry: "Constituency Leadership & Youth Representation",
      location: "Ramanagara, Karnataka, India",
      region: "India",
      prompt: "Audit ground public sentiment, youth support, constituency development work, and silk weaver subsidies for Nikhil Kumaraswamy.",
    },
    {
      label: "👤 Solo: C.P. Yogeshwara",
      names: ["C.P. Yogeshwara"],
      industry: "Senior Regional Governance",
      location: "Channapatna, Karnataka, India",
      region: "India",
      prompt: "Track public perception on Channapatna tank filling projects, legislative experience, and local voter support for C.P. Yogeshwara.",
    },
    {
      label: "👤 Solo: D.K. Shivakumar",
      names: ["D.K. Shivakumar"],
      industry: "State Governance & Deputy Chief Minister",
      location: "Kanakapura, Karnataka, India",
      region: "India",
      prompt: "Audit voter perception on Brand Bangalore initiatives, Mekedatu project, water security, and party organization leadership.",
    },
    {
      label: "👤 Solo: Elon Musk",
      names: ["Elon Musk"],
      industry: "Technology & Autonomous AI",
      location: "Austin, Texas, United States",
      region: "Global",
      prompt: "Track global executive mindshare, developer reception, product vision credibility, and controversy risk metrics for Elon Musk.",
    },
    {
      label: "⚔️ 2 Rivals: Nikhil vs Yogeshwara",
      names: ["Nikhil Kumaraswamy", "C.P. Yogeshwara"],
      industry: "Electoral Head-to-Head Benchmarking",
      location: "Channapatna & Ramanagara, Karnataka",
      region: "India",
      prompt: "Direct 2-way head-to-head comparison between Nikhil Kumaraswamy and C.P. Yogeshwara on local standing, ground popularity, and public support.",
    },
    {
      label: "🏛️ 3 Leaders: Nikhil vs Yogeshwara vs D.K. Suresh",
      names: ["Nikhil Kumaraswamy", "C.P. Yogeshwara", "D.K. Suresh"],
      industry: "Tri-Corner Regional Representation",
      location: "Ramanagara District, Karnataka",
      region: "India",
      prompt: "3-way comparison evaluating public support, grassroots reach, and constituency development delivery across all 3 key candidates.",
    },
    {
      label: "🗳️ 5 Candidates: Ramanagara Battle",
      names: ["Nikhil Kumaraswamy", "C.P. Yogeshwara", "D.K. Suresh", "H.D. Kumaraswamy", "A. Manjunath"],
      industry: "Full 5-Way Constituency Arena",
      location: "Ramanagara & Channapatna, Karnataka",
      region: "India",
      prompt: "Comprehensive 5-way candidate benchmark tracking Local Standing, Support to Public, Popularity, Public Status, and Constituency Delivery.",
    },
    {
      label: "⚡ 5 Global Tech CEOs",
      names: ["Elon Musk", "Sundar Pichai", "Satya Nadella", "Jensen Huang", "Sam Altman"],
      industry: "Global Tech Titans",
      location: "San Francisco & Austin, United States",
      region: "Global",
      prompt: "Benchmark executive quote frequency, AI breakthrough perception, developer community sentiment, and leadership trust across 5 Big Tech CEOs.",
    },
  ];

  const companyPresets = [
    {
      label: "🏢 Solo: Maybank",
      names: ["Maybank"],
      industry: "Banking & Financial Services",
      location: "Kuala Lumpur, Malaysia",
      region: "Malaysia",
      prompt: "Deep-dive brand sentiment, MAE mobile banking uptime, customer support satisfaction, and retail banking reputation.",
    },
    {
      label: "🏢 Solo: Tesla Malaysia",
      names: ["Tesla Malaysia"],
      industry: "Automotive EV & Energy",
      location: "Cyberjaya, Selangor, Malaysia",
      region: "Malaysia",
      prompt: "Monitor Supercharger network reliability, vehicle delivery feedback, build quality, and customer brand loyalty.",
    },
    {
      label: "🏦 5 Malaysian Banks",
      names: ["Maybank", "CIMB", "Public Bank", "RHB", "Hong Leong Bank"],
      industry: "Banking & Fintech",
      location: "Kuala Lumpur, Malaysia",
      region: "Malaysia",
      prompt: "Compare public customer sentiment regarding mobile app reliability, transaction fees, interest rates, and SME loan approvals across all 5 banking giants.",
    },
    {
      label: "⚡ 5 EV Automotive Brands",
      names: ["Tesla Malaysia", "BYD Auto", "Proton e.MAS", "Smart Malaysia", "Hyundai Ioniq"],
      industry: "Automotive & EV",
      location: "Cyberjaya & Selangor, Malaysia",
      region: "Malaysia",
      prompt: "Benchmark public sentiment and owner reviews on charging network, delivery waiting time, build quality, and resale confidence across 5 EV brands.",
    },
  ];

  const handleApplyPreset = (preset: typeof individualPresets[0] | typeof companyPresets[0]) => {
    const padded = [preset.names[0] || "", preset.names[1] || "", preset.names[2] || "", preset.names[3] || "", preset.names[4] || ""];
    setIndividuals(padded);
    setCommaInput(preset.names.join(", "));
    setIndustryInput(preset.industry);
    setLocationInput(preset.location);
    setRegionInput(preset.region);
    setPromptInput(preset.prompt);
  };

  const executeReplenishment = async () => {
    setIsPromptModalOpen(false);

    const activeList = individuals.map((s) => s.trim()).filter(Boolean);
    const primaryName = activeList[0] || (modalMode === "individual" ? "Nikhil Kumaraswamy" : "Maybank");
    const rivals = activeList.slice(1);
    const isSingle = rivals.length === 0;

    await replenishTenantData({
      brandName: primaryName,
      industry: industryInput || (modalMode === "individual" ? "Constituency Leadership & Representation" : "Corporate Banking"),
      isSingleEntity: isSingle,
      competitorNames: isSingle ? [] : rivals,
      prompt: promptInput || (isSingle
        ? `Clean solo telemetry, 5-pillar standing and sentiment audit for ${primaryName}`
        : `Comparative benchmark across all ${activeList.length} entities: ${activeList.join(", ")}`),
      location: locationInput || (modalMode === "individual" ? "Ramanagara, Karnataka, India" : "Kuala Lumpur, Malaysia"),
      region: regionInput || (modalMode === "individual" ? "India" : "Malaysia"),
      sourceChannels: selectedChannels,
      customSourceUrls: sourcesInput.split(",").map((s) => s.trim()).filter(Boolean),
      entityType: modalMode,
      saveCurrentProject: true, // Automatically auto-archives previous snapshot to Past Projects
    });
  };

  const activeIndividuals = individuals.map((s) => s.trim()).filter(Boolean);
  const isSoloMode = activeIndividuals.length <= 1;

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
            title="Click to view or switch active target"
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
          </button>

          {/* Direct Live Refresh Data Button */}
          <button
            onClick={() => refreshCurrentData()}
            disabled={isReplenishing}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Live re-scan & refresh current data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isReplenishing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Scope Status Badge */}
          {isSoloMode ? (
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-bold">
              <UserCheck className="w-3 h-3" /> Solo Profile
            </span>
          ) : (
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-bold">
              <Swords className="w-3 h-3" /> {activeIndividuals.length}-Way Comparison
            </span>
          )}

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

          {/* Search bar with quick prompt trigger */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Ask AI or type ${entityType === "individual" ? "individual executive" : "company brand"} prompt...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  const names = searchQuery.split(",").map((s) => s.trim());
                  setIndividuals([names[0] || "", names[1] || "", names[2] || "", names[3] || "", names[4] || ""]);
                  setCommaInput(searchQuery);
                  setModalMode(entityType);
                  setIsPromptModalOpen(true);
                }
              }}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-9 pr-24 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  const names = searchQuery.split(",").map((s) => s.trim());
                  setIndividuals([names[0] || "", names[1] || "", names[2] || "", names[3] || "", names[4] || ""]);
                  setCommaInput(searchQuery);
                }
                setModalMode(entityType);
                setIsPromptModalOpen(true);
              }}
              className="absolute right-1.5 top-1 px-2.5 py-1 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs hover:opacity-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Scan</span>
            </button>
          </div>
        </div>

        {/* Header Actions: Past Projects & New Comparison */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Past Projects Archive Button */}
          <button
            onClick={() => setIsPastProjectsModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer"
            title="View and restore archived past prompt projects"
          >
            <FolderArchive className="w-3.5 h-3.5 text-primary" />
            <span className="hidden md:inline">Past Projects</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              {pastProjects.length}
            </span>
          </button>

          {/* DEDICATED NEW COMPARISON BUTTON */}
          <button
            onClick={() => {
              clearAllIndividuals();
              setModalMode(entityType);
              setIsPromptModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white text-xs font-black shadow-sm shadow-primary/20 transition-all cursor-pointer"
            title="Clear old data and run a fresh comparison (1 to 5 individuals or brands)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>New Comparison</span>
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

          {/* 14-Day Free Version Badge / Upgrade Trigger */}
          <button
            onClick={() => setIsPaidUpgradeModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-gold/15 to-primary/10 border border-gold/40 hover:border-gold text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="14-Day Free Trial Evaluation. Click to register for Paid Version."
          >
            <Clock className="w-3.5 h-3.5 text-gold-dark shrink-0" />
            <span className="text-[11px] font-extrabold text-slate-900">
              Day {trialDaysElapsed}/14 Free
            </span>
            <span className="hidden md:inline text-[10px] text-primary font-bold underline ml-0.5">
              Upgrade
            </span>
          </button>

          {/* User Profile & Access Control Pill */}
          <Link
            href="/access-control"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/90 transition-all text-xs shadow-2xs cursor-pointer"
            title={`Active User: ${user.name} (${user.role}). Click to manage Access Control, Self-Service & Optional MFA.`}
          >
            <img
              src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-extrabold text-[11px] text-slate-900 leading-tight">{user.name}</span>
              <span className="text-[9px] text-slate-500 font-semibold leading-none">{user.role.replace("_", " ")}</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
              user.mfaEnabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}>
              {user.mfaEnabled ? `2FA ${user.mfaMethod || "TOTP"}` : "2FA Opt"}
            </span>
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

      {/* NEW COMPARISON MODAL (1 TO 5 ENTITIES, AUTOMATIC CLEAN DATA) */}
      {isPromptModalOpen && !isReplenishing && (
        <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-card border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Sticky Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      New Comparison
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Auto-Clean Data
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Wipes old telemetry and runs fresh listening for 1 to 5 {modalMode === "individual" ? "individuals" : "companies"}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer shrink-0 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Entity Mode Tabs: Individual vs Company */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode("individual");
                    handleApplyPreset(individualPresets[0]);
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    modalMode === "individual"
                      ? "bg-white text-primary shadow-xs border border-primary/20"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>👤 Individual Leaders & Figures</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode("company");
                    handleApplyPreset(companyPresets[0]);
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    modalMode === "company"
                      ? "bg-white text-primary shadow-xs border border-primary/20"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>🏢 Corporate Companies & Brands</span>
                </button>
              </div>

              {/* Real-Time Detection Banner (Solo vs Comparison) */}
              {isSoloMode ? (
                <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-900 block">
                      1 Individual Detected: Solo Mode (No Comparison)
                    </span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      ArtEDGE will clear previous data completely and fetch 100% of telemetry, 5-pillar standing, credibility, and mentions exclusively for <strong>{activeIndividuals[0] || "this figure"}</strong>. No comparison contenders will be created.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50/90 border border-purple-200 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Swords className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-purple-900 block">
                      {activeIndividuals.length}-Way Comparison Arena Active
                    </span>
                    <p className="text-[11px] text-purple-700 mt-0.5">
                      ArtEDGE will clear previous data and benchmark <strong>{activeIndividuals[0]}</strong> against {activeIndividuals.slice(1).join(", ")} across Share of Voice, Grassroots Standing, and Multilingual Sentiment.
                    </p>
                  </div>
                </div>
              )}

              {/* 1 to 5 Individuals Form Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Enter {modalMode === "individual" ? "Individuals" : "Companies"} (1 to 5 targets)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      • Enter 1 for Solo, or 2 to 5 to Compare
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={clearAllIndividuals}
                    className="text-[11px] font-bold text-slate-400 hover:text-coral transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Comma-separated Quick Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={commaInput}
                    onChange={(e) => handleCommaInputChange(e.target.value)}
                    placeholder="e.g. Nikhil Kumaraswamy, C.P. Yogeshwara, D.K. Suresh..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Tip: Type comma-separated names above, or fill the slots below individually.
                  </span>
                </div>

                {/* Slots 1 to 5 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isPrimary
                            ? "bg-primary-light/20 border-primary/40 col-span-1 sm:col-span-2"
                            : individuals[idx]
                            ? "bg-slate-50 border-slate-300"
                            : "bg-slate-50/50 border-dashed border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                            isPrimary
                              ? "bg-primary text-white"
                              : individuals[idx]
                              ? "bg-slate-800 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={individuals[idx] || ""}
                            onChange={(e) => updateIndividualSlot(idx, e.target.value)}
                            placeholder={
                              isPrimary
                                ? `Target #1 (${modalMode === "individual" ? "Primary Leader - Required" : "Primary Brand - Required"})`
                                : `Target #${idx + 1} (Optional contender)`
                            }
                            className="w-full bg-transparent text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none"
                          />
                        </div>
                        {individuals[idx] && !isPrimary && (
                          <button
                            type="button"
                            onClick={() => updateIndividualSlot(idx, "")}
                            className="text-slate-400 hover:text-coral p-1 cursor-pointer"
                            title="Remove target"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick 1-Click Presets */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  ⚡ Quick Presets (Solo & Comparative)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(modalMode === "individual" ? individualPresets : companyPresets).map((preset, idx) => {
                    const isSelected =
                      activeIndividuals.length === preset.names.length &&
                      activeIndividuals.every((name, i) => name.toLowerCase() === preset.names[i]?.toLowerCase());
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-primary-light hover:border-primary/40"
                        }`}
                      >
                        <div className="font-bold">{preset.label}</div>
                        <div className={`text-[10px] truncate ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                          {preset.names.join(" vs ") || "Solo Profile"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industry & Geographic Scope Details */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal" />
                  <span className="text-xs font-bold text-slate-900">
                    📍 Industry & Geographic Scope
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Industry / Focus
                    </label>
                    <input
                      type="text"
                      value={industryInput}
                      onChange={(e) => setIndustryInput(e.target.value)}
                      placeholder="e.g. Governance, Tech"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal/30"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      City / Constituency
                    </label>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="e.g. Ramanagara, Karnataka"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal/30"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Country
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

              {/* Strategic Objective or Prompt */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Comparison Prompt / Objective (Optional)
                </label>
                <textarea
                  rows={2}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={
                    isSoloMode
                      ? `Audit voter perception, youth support, constituency development work, and silk weaver subsidies for ${activeIndividuals[0] || "this figure"}...`
                      : `Compare public voter sentiment, ground rally reach, public trust index, and promises across all ${activeIndividuals.length} candidates...`
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white resize-none"
                />
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

              {/* Direct Execution Button - Wipes Old Data Clean Without Confirmation Dialogs */}
              <button
                type="button"
                onClick={executeReplenishment}
                disabled={activeIndividuals.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md shadow-primary/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {isSoloMode
                    ? `Clear Old Data & Scan Solo ${modalMode === "individual" ? "Individual" : "Company"}`
                    : `Clear Old Data & Compare ${activeIndividuals.length} ${modalMode === "individual" ? "Individuals" : "Companies"}`}
                </span>
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
