"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { MatrixLogo } from "@/components/common/MatrixLogo";
import {
  Sparkles,
  Building,
  User,
  Target,
  Globe,
  Swords,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Sliders,
  Layers,
  Cloud,
  Check,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { replenishTenantData } = useTenant();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [monitoringType, setMonitoringType] = useState<"individual" | "company">("individual");
  const [comparisonMode, setComparisonMode] = useState<"solo" | "multi">("solo");
  const [entityName, setEntityName] = useState("Xi Jinping");
  const [websiteUrl, setWebsiteUrl] = useState("https://xijinping.org");
  const [industry, setIndustry] = useState("Global Governance & Diplomacy");
  const [country, setCountry] = useState("Global / ASEAN");
  const [aliases, setAliases] = useState("Xi Jinping, General Secretary, State President");
  const [competitorList, setCompetitorList] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSelectMonitoringType = (typeId: string) => {
    const isInd = typeId === "individual";
    setMonitoringType(isInd ? "individual" : "company");
    if (isInd) {
      setEntityName("Xi Jinping");
      setWebsiteUrl("https://xijinping.org");
      setIndustry("Global Governance & Diplomacy");
      setCountry("Global / ASEAN");
      setAliases("Xi Jinping, General Secretary, State President");
      setComparisonMode("solo");
      setCompetitorList([]);
    } else {
      setEntityName("Maybank");
      setWebsiteUrl("https://maybank.com.my");
      setIndustry("Banking & Financial Services");
      setCountry("Malaysia");
      setAliases("Maybank, Malayan Banking, MAE");
      setComparisonMode("multi");
      setCompetitorList(["CIMB Regional", "Public Bank Bhd", "RHB Financial"]);
    }
  };

  const handleEntityNameChange = (val: string) => {
    setEntityName(val);
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (monitoringType === "individual") {
      setAliases(val ? `${val}, Leader, Keynote Speaker` : "");
      setWebsiteUrl(val ? `https://${clean || "leader"}.org` : "");
    } else {
      setAliases(val ? `${val}, ${val} Group, ${val} Asia` : "");
      setWebsiteUrl(val ? `https://${clean || "brand"}.com.my` : "");
    }
  };

  const addCompetitorSlot = () => {
    if (competitorList.length < 4) {
      setCompetitorList([...competitorList, ""]);
    }
  };

  const removeCompetitorSlot = (idx: number) => {
    setCompetitorList(competitorList.filter((_, i) => i !== idx));
  };

  const updateCompetitorSlot = (idx: number, val: string) => {
    const updated = [...competitorList];
    updated[idx] = val;
    setCompetitorList(updated);
  };

  const handleFinish = async () => {
    setIsDeploying(true);
    const targetBrand = entityName.trim() || (monitoringType === "individual" ? "Executive Leader" : "Enterprise Brand");
    const isSolo = comparisonMode === "solo" || competitorList.filter((c) => c.trim().length > 0).length === 0;

    const cleanedCompetitors = isSolo
      ? []
      : competitorList
          .map((c) =>
            c
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, "")
              .replace(/^(linkedin\.com\/in\/|x\.com\/)/, "")
              .replace(/\..*$/, "")
              .replace(/[-_]/g, " ")
              .trim()
          )
          .filter((c) => c.length > 0 && c.toLowerCase() !== targetBrand.toLowerCase());

    await replenishTenantData({
      brandName: targetBrand,
      industry,
      isSingleEntity: isSolo,
      competitorNames: isSolo ? [] : cleanedCompetitors,
      prompt: isSolo
        ? `Dedicated solo intelligence profile for ${targetBrand} in ${industry} across ${country}.`
        : `Multi-entity comparison benchmark for ${targetBrand} vs ${cleanedCompetitors.join(", ")} in ${industry} across ${country}.`,
      region: country,
      entityType: monitoringType,
      saveCurrentProject: false, // Ensure fresh start for onboarding (purge old workspace data)
    });

    setIsDeploying(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col items-center justify-start p-4 sm:p-8 select-none">
      {/* Top Brand & Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 mb-4">
        <Link href="/">
          <MatrixLogo />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Existing User? Sign In
          </Link>
          <span className="px-3 py-1 bg-green/10 text-green border border-green/30 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            AWS Production Connected
          </span>
        </div>
      </header>

      {/* Main Multi-Step Setup Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col">
        {/* Wizard Header Strip */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
              A
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white uppercase tracking-wider">
                  Setup & Deployment Wizard
                </span>
                <span className="text-xs text-slate-400">Step {currentStep} of 6</span>
              </div>
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">ArtEDGE Project Onboarding</h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  currentStep === s
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : currentStep > s
                    ? "bg-green text-white"
                    : "bg-white/10 text-slate-400 hover:bg-white/20"
                }`}
              >
                {currentStep > s ? "✓" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-r-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {/* Step Body Content */}
        <div className="p-6 sm:p-10 min-h-[440px] flex flex-col justify-between">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 1 • Target Selection
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Select Monitoring Type</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose the primary operational mode for your intelligence workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "individual",
                    title: "Personal Brand / Individual Leader",
                    desc: "Track executive, candidate, keynote speaker, or public figure reputation & leadership footprint (Solo or Comparative)",
                    icon: User,
                  },
                  {
                    id: "company",
                    title: "Company / Corporate Enterprise",
                    desc: "Track brand sentiment, digital customer experience, regulatory radar, and competitor benchmark arena",
                    icon: Building,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = monitoringType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectMonitoringType(item.id)}
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? "border-primary bg-primary-light/10 shadow-lg shadow-primary/10"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isSel ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        {isSel && <CheckCircle2 className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <strong className="text-base font-bold text-slate-900 block mb-1">{item.title}</strong>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 2 • Canonical Entity Profile
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Enter Primary Monitored Entity</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Specify official name, web address, industry sector, and geographical market.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {monitoringType === "individual" ? "Leader / Individual Name" : "Entity / Brand Name"}
                  </label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => handleEntityNameChange(e.target.value)}
                    placeholder="e.g. Xi Jinping, Satya Nadella, Maybank"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Official Website / Profile URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Industry Sector / Category</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Operating Country / Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 3 • Identity Resolution
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Identity Resolution & Aliases</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  System auto-detected abbreviations, handles, and keywords for {entityName}.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Known Aliases & Acronyms (Comma Separated)</label>
                  <input
                    type="text"
                    value={aliases}
                    onChange={(e) => setAliases(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="p-5 bg-green/5 border border-green/20 rounded-2xl text-slate-800 space-y-2">
                  <strong className="text-green font-bold text-xs block">
                    ✓ Auto-Discovered Channels for {entityName}:
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                      LinkedIn: linkedin.com/{monitoringType === "individual" ? "in" : "company"}/{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "profile"}
                    </p>
                    <p className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                      X (Twitter): @{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "handle"}
                    </p>
                    <p className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                      Facebook: facebook.com/{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "page"}
                    </p>
                    <p className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                      YouTube: youtube.com/@{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "channel"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 4 • Comparison Setup
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Comparison & Benchmark Scope</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose whether you want to track this individual alone (Solo Mode) or compare with rivals (up to 5 total).
                </p>
              </div>

              {/* Mode Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setComparisonMode("solo")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    comparisonMode === "solo"
                      ? "border-green bg-green/5 shadow-md shadow-green/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className={`w-5 h-5 ${comparisonMode === "solo" ? "text-green" : "text-slate-400"}`} />
                      <strong className="text-sm font-bold text-slate-900">Solo Profile (1 Individual Only)</strong>
                    </div>
                    {comparisonMode === "solo" && <Check className="w-5 h-5 text-green" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Zero comparative clutter. 100% Share of Voice and deep individual leadership standing gathered exclusively for {entityName}.
                  </p>
                </div>

                <div
                  onClick={() => setComparisonMode("multi")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    comparisonMode === "multi"
                      ? "border-primary bg-primary-light/10 shadow-md shadow-primary/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Swords className={`w-5 h-5 ${comparisonMode === "multi" ? "text-primary" : "text-slate-400"}`} />
                      <strong className="text-sm font-bold text-slate-900">Comparative Arena (2 to 5 Individuals)</strong>
                    </div>
                    {comparisonMode === "multi" && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Benchmark {entityName} against up to 4 rivals or industry peers with multi-entity radar comparisons.
                  </p>
                </div>
              </div>

              {/* Conditional Inputs */}
              {comparisonMode === "solo" ? (
                <div className="p-5 bg-green/10 border border-green/30 rounded-2xl text-xs text-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-green font-extrabold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Solo Mode Active: No Rival Data Will Be Injected</span>
                  </div>
                  <p className="text-slate-600">
                    All intelligence, fact-checking forensics, sentiment charts, and radar benchmarks will be focused 100% on <strong>{entityName}</strong>. No artificial rival records or unwanted profiles will be added.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Competitors / Peers ({competitorList.length + 1} of 5 Total):
                    </span>
                    {competitorList.length < 4 && (
                      <button
                        type="button"
                        onClick={addCompetitorSlot}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Individual
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-primary-light/20 border border-primary/20 rounded-xl flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-primary text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      ★
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{entityName} (Primary Monitored)</span>
                  </div>

                  {competitorList.map((comp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        #{idx + 2}
                      </span>
                      <input
                        type="text"
                        value={comp}
                        onChange={(e) => updateCompetitorSlot(idx, e.target.value)}
                        placeholder={`e.g. Peer Leader #${idx + 2} or rival name`}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeCompetitorSlot(idx)}
                        className="text-slate-400 hover:text-coral p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {competitorList.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      Click "+ Add Individual" to add up to 4 rivals, or leave empty to monitor {entityName} as a solo profile.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 5 • Keyword & Negative Exclusions
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Keyword Group Builder</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Define intent terms, narrative pillars, and negative exclusion rules for {entityName}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <strong className="text-slate-900 block font-bold">Leadership & Impact Phrases:</strong>
                  <p className="text-slate-600">"policy delivery", "bilateral meeting", "economic reform", "speech"</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <strong className="text-slate-900 block font-bold">Public Sentiment Aspects:</strong>
                  <p className="text-slate-600">"public approval", "trustworthiness", "media resonance", "governance"</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <strong className="text-slate-900 block font-bold">Exclusion Rules:</strong>
                  <p className="text-slate-600">"{entityName} Unrelated Homonyms", "Unverified Spam", "Parody Accounts"</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 6 • Connected Infrastructure & Launch
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Workspace Summary & Launch</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Verify your configuration. ArtEDGE is connected to AWS production infrastructure with automatic data isolation.
                </p>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                      in
                    </div>
                    <div>
                      <strong className="text-slate-900 block">LinkedIn Executive Profile Connector</strong>
                      <span className="text-slate-400">Official Profile & Mention Monitoring</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green/10 text-green font-extrabold rounded-xl">Authorized</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-light text-violet flex items-center justify-center font-bold">
                      f
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Meta Graph API & Social Channels</strong>
                      <span className="text-slate-400">Public Page & News Streams</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green/10 text-green font-extrabold rounded-xl">Authorized</span>
                </div>
              </div>

              {/* AWS Production Infrastructure Status Banner (No credentials requested) */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-teal" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      AWS Production Infrastructure
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-green/20 text-green-light border border-green/30 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Pre-Configured & Connected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Entity</span>
                    <strong className="text-white text-sm">{entityName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Monitoring Scope</span>
                    <strong className="text-teal">
                      {comparisonMode === "solo" || competitorList.length === 0 ? "Solo (No Comparison)" : `${competitorList.length + 1}-Way Arena`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">AWS Deployment</span>
                    <strong className="text-white">ap-southeast-1 (Singapore)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Compliance</span>
                    <strong className="text-green">PDPA 2.0 / KMS Encrypted</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || isDeploying}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all ${
                currentStep === 1 ? "opacity-30 cursor-not-allowed text-slate-400" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous Step
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                className="bg-primary text-white font-bold text-xs px-8 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary-dark shadow-md shadow-primary/20 transition-all"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isDeploying}
                className="bg-primary text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Launching Clean Workspace...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch Workspace</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
