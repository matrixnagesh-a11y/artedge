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
  Key,
  Share2,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Sliders,
  Layers,
  Cloud,
  Server,
  Lock,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  AlertCircle,
  Database,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { addEntity, replenishTenantData, isReplenishing, replenishStatus } = useTenant();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [monitoringType, setMonitoringType] = useState("individual");
  const [entityName, setEntityName] = useState("Nikhil Kumaraswamy");
  const [websiteUrl, setWebsiteUrl] = useState("https://nikhilkumaraswamy.in");
  const [industry, setIndustry] = useState("Electoral Benchmarking & Governance");
  const [country, setCountry] = useState("India");
  const [aliases, setAliases] = useState("Nikhil Kumaraswamy, Nikhil Gowda, JD(S) Leader");
  const [competitorUrls, setCompetitorUrls] = useState([
    "https://x.com/cpyogeshwara",
    "https://x.com/dksureshinc",
    "https://x.com/hdkumaraswamy",
    "https://x.com/amanjunath",
  ]);

  const handleSelectMonitoringType = (typeId: string) => {
    setMonitoringType(typeId);
    if (typeId === "individual") {
      setEntityName("Nikhil Kumaraswamy");
      setWebsiteUrl("https://nikhilkumaraswamy.in");
      setIndustry("Electoral Benchmarking & Governance");
      setCountry("India");
      setAliases("Nikhil Kumaraswamy, Nikhil Gowda, JD(S) Leader");
      setCompetitorUrls([
        "https://x.com/cpyogeshwara",
        "https://x.com/dksureshinc",
        "https://x.com/hdkumaraswamy",
        "https://x.com/amanjunath",
      ]);
    } else {
      setEntityName("");
      setWebsiteUrl("");
      setIndustry("");
      setCountry("India");
      setAliases("");
      setCompetitorUrls(["", "", "", ""]);
    }
  };

  const handleEntityNameChange = (val: string) => {
    setEntityName(val);
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (monitoringType === "individual") {
      setAliases(`${val}, Leader, Keynote Speaker`);
      setWebsiteUrl(`https://${clean || "leader"}.com`);
    } else {
      setAliases(`${val}, ${val} Group, ${val} MY`);
      setWebsiteUrl(`https://${clean || "brand"}.com.my`);
    }
  };

  // AWS Cloud Deployment State
  const [awsAccessKeyId, setAwsAccessKeyId] = useState("AKIAIOSFODNN7EXAMPLE");
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [awsRegion, setAwsRegion] = useState("ap-southeast-5"); // Malaysia Sovereign Cloud
  const [awsServiceTarget, setAwsServiceTarget] = useState("ecs_fargate");
  const [s3BucketName, setS3BucketName] = useState("artedge-data-vault-asean");
  const [iamRoleArn, setIamRoleArn] = useState("arn:aws:iam::849201938472:role/ArtEdgeProductionDeployer");
  const [isAwsTesting, setIsAwsTesting] = useState(false);
  const [awsVerified, setAwsVerified] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleTestAwsCredentials = () => {
    setIsAwsTesting(true);
    setTimeout(() => {
      setIsAwsTesting(false);
      setAwsVerified(true);
    }, 1000);
  };

  const handleFinish = async () => {
    setIsDeploying(true);
    const parsedCompetitors = competitorUrls
      .map((u) =>
        u
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .replace(/^(linkedin\.com\/in\/|x\.com\/)/, "")
          .replace(/\..*$/, "")
          .replace(/[-_]/g, " ")
          .trim()
      )
      .filter(Boolean);

    await replenishTenantData({
      brandName: entityName,
      industry,
      competitorNames: parsedCompetitors.length >= 2 ? parsedCompetitors : undefined,
      prompt: `Onboarding intelligence scan for ${entityName} in ${industry} across ${country}. Monitored keywords: ${aliases}.`,
      region: country,
      entityType: monitoringType === "individual" ? "individual" : "company",
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
        </div>
      </header>

      {/* Prominent iOS-Style Onboarding Wizard Card */}
      <div className="w-full max-w-5xl bg-card border border-slate-200/80 rounded-3xl shadow-ios overflow-hidden mb-8">
        {/* iOS Header Strip */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-gold-dark flex items-center justify-center font-bold text-xl text-white shadow-lg">
              A
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white uppercase tracking-wider">
                  Setup & Deployment Wizard
                </span>
                <span className="text-xs text-slate-400">Step {currentStep} of 7</span>
              </div>
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">ArtEDGE Project Onboarding</h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
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
            style={{ width: `${(currentStep / 7) * 100}%` }}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: "company", title: "Company / Corporate", desc: "Track company, branches & competitors", icon: Building },
                  { id: "individual", title: "Personal Brand", desc: "Track executive, speaker, or public figure reputation", icon: User },
                  { id: "product", title: "Product / Service", desc: "Track customer reviews & launch campaigns", icon: Target },
                  { id: "campaign", title: "Campaign / Hashtag", desc: "Track specific marketing hashtags & events", icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = monitoringType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectMonitoringType(item.id)}
                      className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between min-h-[160px] ${
                        isSel
                          ? "bg-primary-light/50 border-primary text-primary font-bold shadow-md shadow-primary/10"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isSel ? "bg-primary text-white" : "bg-slate-200 text-slate-600"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-[11px] text-slate-500 font-normal leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
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
                  Specify official web address, industry sector, and geographical market.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Entity / Brand Name</label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => handleEntityNameChange(e.target.value)}
                    placeholder="e.g. Maybank, AirAsia, D.K. Suresh, Tony Fernandes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Official Website URL</label>
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
                  System auto-detected abbreviations, misspellings, and social handles for {entityName}. Please approve.
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
                <div className="p-5 bg-green-light/40 border border-green/30 rounded-2xl text-slate-800 space-y-2">
                  <strong className="text-green font-bold text-xs block">
                    ✓ Auto-Discovered {monitoringType === "individual" ? "Personal Leader" : "Corporate"} Channels for {entityName}:
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p className="p-2 bg-white rounded-xl border border-slate-200 font-mono">
                      LinkedIn: linkedin.com/{monitoringType === "individual" ? "in" : "company"}/{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "profile"}
                    </p>
                    <p className="p-2 bg-white rounded-xl border border-slate-200 font-mono">
                      X (Twitter): @{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "handle"}
                    </p>
                    <p className="p-2 bg-white rounded-xl border border-slate-200 font-mono">
                      Facebook: facebook.com/{entityName.toLowerCase().replace(/[^a-z0-9]/g, "") || "page"}
                    </p>
                    <p className="p-2 bg-white rounded-xl border border-slate-200 font-mono">
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
                  Step 4 • Competitor Selection
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">5-Way Competitor Discovery</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter or approve up to four regional competitors for 5-Way Arena benchmarking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competitorUrls.map((url, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      #{idx + 2}
                    </span>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const updated = [...competitorUrls];
                        updated[idx] = e.target.value;
                        setCompetitorUrls(updated);
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
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
                  Define purchase intent terms, complaint terms, and negative exclusion rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <strong className="text-slate-900 block font-bold">Purchase-Intent Phrases:</strong>
                  <p className="text-slate-600">"looking for supplier", "recommendation for SaaS", "quotation request"</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <strong className="text-slate-900 block font-bold">Complaint Phrases:</strong>
                  <p className="text-slate-600">"dissatisfied with competitor", "SLA delay", "switching provider"</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <strong className="text-slate-900 block font-bold">Exclusion Rules:</strong>
                  <p className="text-slate-600">"{entityName} Unrelated Homonyms", "Unrelated Acronyms", "Historical Reposts"</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Step 6 • OAuth Account Authorization
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Connect Owned Accounts</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Authorize customer-controlled social media pages via official OAuth tokens.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                      in
                    </div>
                    <div>
                      <strong className="text-slate-900 block">LinkedIn Organization Page OAuth</strong>
                      <span className="text-slate-400">Official Page API Integration</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-light text-green font-extrabold rounded-xl">Authorized</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-light text-violet flex items-center justify-center font-bold">
                      f
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Meta Graph API (FB & Instagram)</strong>
                      <span className="text-slate-400">Business & Creator Account Access</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-light text-green font-extrabold rounded-xl">Authorized</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: FINAL AWS CLOUD DEPLOYMENT & CREDENTIALS */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                    Step 7 • Final Cloud Deployment
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-amber-500 text-white rounded">
                    AWS Production Infrastructure
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Amazon Web Services (AWS) Deployment & Credentials
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Please provide your AWS credentials to provision dedicated tenant containers, S3 data residency storage vaults, and IPSCAN monitoring nodes.
                </p>
              </div>

              {/* AWS Credentials Form Grid */}
              <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Cloud className="w-5 h-5 text-primary-light" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      AWS Authentication & IAM Handshake
                    </span>
                  </div>
                  {awsVerified && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-green/20 text-green-light border border-green/30 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Credentials Verified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  {/* AWS Access Key ID */}
                  <div>
                    <label className="text-slate-300 font-sans font-bold block mb-1">
                      AWS Access Key ID <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      value={awsAccessKeyId}
                      onChange={(e) => {
                        setAwsAccessKeyId(e.target.value);
                        setAwsVerified(false);
                      }}
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* AWS Secret Access Key */}
                  <div>
                    <label className="text-slate-300 font-sans font-bold block mb-1">
                      AWS Secret Access Key <span className="text-coral">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSecretKey ? "text" : "password"}
                        value={awsSecretAccessKey}
                        onChange={(e) => {
                          setAwsSecretAccessKey(e.target.value);
                          setAwsVerified(false);
                        }}
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* AWS Region */}
                  <div>
                    <label className="text-slate-300 font-sans font-bold block mb-1">
                      Target AWS Deployment Region <span className="text-coral">*</span>
                    </label>
                    <select
                      value={awsRegion}
                      onChange={(e) => setAwsRegion(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans cursor-pointer text-xs"
                    >
                      <option value="ap-southeast-1">ap-southeast-1 (Singapore - ASEAN Data Residency Hub)</option>
                      <option value="ap-southeast-3">ap-southeast-3 (Jakarta, Indonesia)</option>
                      <option value="ap-southeast-4">ap-southeast-4 (Melbourne, Australia)</option>
                      <option value="ap-northeast-1">ap-northeast-1 (Tokyo, Japan)</option>
                      <option value="us-east-1">us-east-1 (US East, N. Virginia)</option>
                      <option value="eu-west-1">eu-west-1 (Europe, Ireland)</option>
                    </select>
                  </div>

                  {/* AWS Deployment Service Target */}
                  <div>
                    <label className="text-slate-300 font-sans font-bold block mb-1">
                      AWS Container Service Target
                    </label>
                    <select
                      value={awsServiceTarget}
                      onChange={(e) => setAwsServiceTarget(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans cursor-pointer text-xs"
                    >
                      <option value="ecs_fargate">AWS ECS Fargate (Serverless Containers - Recommended)</option>
                      <option value="eks_cluster">AWS EKS (Managed Kubernetes Cluster)</option>
                      <option value="app_runner">AWS App Runner (Auto-scaled Gateway)</option>
                    </select>
                  </div>

                  {/* S3 Evidence Bucket Name */}
                  <div>
                    <label className="text-slate-300 font-sans font-bold block mb-1">
                      S3 Data Vault Bucket Name
                    </label>
                    <input
                      type="text"
                      value={s3BucketName}
                      onChange={(e) => setS3BucketName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* IAM Role ARN */}
                  <div>
                    <label className="text-slate-300 font-sans font-bold block mb-1">
                      IAM Role ARN (Zero-Trust Role)
                    </label>
                    <input
                      type="text"
                      value={iamRoleArn}
                      onChange={(e) => setIamRoleArn(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Handshake Tester & Live Verification Status */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-teal" />
                    <span>Malaysian PDPA 2.0 & ASEAN Cross-Border Encryption Enforced</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestAwsCredentials}
                    disabled={isAwsTesting}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    {isAwsTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Validating with AWS STS...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5 text-primary" />
                        <span>Test AWS Credential Handshake</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Workspace Configuration Summary */}
              <div className="p-4 bg-primary-light/40 border border-primary/20 rounded-2xl text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Monitored Entity</span>
                  <strong>{entityName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Deployment Region</span>
                  <strong className="text-teal">{awsRegion}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Service Target</span>
                  <strong>{awsServiceTarget.toUpperCase()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Data Compliance</span>
                  <strong className="text-green">PDPA 2.0 / KMS Encrypted</strong>
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

            {currentStep < 7 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
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
                    <span>Provisioning AWS Infrastructure...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>Deploy to AWS & Launch Workspace</span>
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
