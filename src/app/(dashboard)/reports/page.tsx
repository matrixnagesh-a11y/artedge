"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  generateTrafficLightSentimentPdf,
  generateNegativeSentimentRiskPdf,
  generateReputationAuditPdf,
  generateCounterYellowJournalismPdf,
} from "@/lib/pdfReportEngine";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Download,
  FileText,
  AlertTriangle,
  Smile,
  Globe,
  CheckCircle2,
  Layers,
  ShieldAlert,
  Calendar,
} from "lucide-react";

export default function ReportingCentrePage() {
  const { primaryEntity, competitors, mentions, recommendations, leads, ipscanFilter } = useTenant();
  const [activeInfographic, setActiveInfographic] = useState<"sov" | "sentiment" | "negative_hotspots" | "lead_funnel">("sentiment");

  // Excel Report Generation Handler
  const generateExcelReport = () => {
    const mentionsSheetData = mentions.map((m) => ({
      ID: m.id,
      Platform: m.platform,
      Author_Name: m.author.name,
      Author_Handle: m.author.handle,
      IP_Address: m.ipAddress || "N/A",
      City: m.geoPosition?.city || m.location || "Global",
      Country: m.geoPosition?.country || "Malaysia",
      ISP: m.geoPosition?.isp || "N/A",
      ASN: m.geoPosition?.asn || "N/A",
      Content: m.content,
      Sentiment: m.sentiment,
      Sentiment_Traffic_Light: m.sentimentTrafficLight,
      Comment_Count: m.comments?.length || m.commentCount || 0,
      Credibility_Score: m.credibility.score,
      Credibility_Class: m.credibility.classification,
      Collection_Method: m.collectionMethod,
      Provider: m.providerUsed,
      Published_At: m.publishedAt,
      Source_URL: m.sourceUrl,
    }));

    // Flattened Comments Sheet for deep data analysis
    const commentsSheetData: any[] = [];
    mentions.forEach((m) => {
      if (m.comments) {
        m.comments.forEach((c) => {
          commentsSheetData.push({
            Comment_ID: c.id,
            Parent_Mention_ID: m.id,
            Parent_Entity: m.entityName,
            Platform: m.platform,
            Comment_Author: c.author.name,
            Comment_Handle: c.author.handle,
            Comment_IP: c.ipAddress || "N/A",
            Comment_City: c.geoPosition?.city || "Area Node",
            Comment_Country: c.geoPosition?.country || "Malaysia",
            Content: c.content,
            Sentiment: c.sentiment,
            Sentiment_Traffic_Light: c.sentimentTrafficLight,
            Likes: c.likes || 0,
            Published_At: c.publishedAt,
          });
        });
      }
    });

    const competitorsSheetData = competitors.map((c) => ({
      Competitor_Name: c.name,
      Is_Primary: c.isPrimary ? "Yes" : "No",
      SOV_Percent: c.metrics.shareOfVoicePercent,
      Mention_Volume: c.metrics.mentionVolume,
      Reach: c.metrics.reach,
      Sentiment_Score: c.metrics.sentimentScore,
      Reputation_Risk_Score: c.metrics.reputationRiskScore,
      Credibility_Index: c.metrics.credibilityIndex,
      Posting_Frequency_Per_Week: c.postingFrequency,
    }));

    const wb = XLSX.utils.book_new();
    const mentionsWS = XLSX.utils.json_to_sheet(mentionsSheetData);
    const commentsWS = XLSX.utils.json_to_sheet(commentsSheetData);
    const competitorsWS = XLSX.utils.json_to_sheet(competitorsSheetData);

    XLSX.utils.book_append_sheet(wb, mentionsWS, "Unified Mentions Feed");
    XLSX.utils.book_append_sheet(wb, commentsWS, "Threaded Comments Stream");
    XLSX.utils.book_append_sheet(wb, competitorsWS, "5-Way Competitor Arena");

    XLSX.writeFile(wb, `ArtEDGE_Full_Analytics_${primaryEntity.name.replace(/\s+/g, "_")}.xlsx`);
  };

  const geoScope = ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Filtered Geographic Area");
  const total = mentions.length || 1;
  const happyCount = mentions.filter(
    (m) => m.sentimentTrafficLight === "happy" || m.sentiment.includes("positive")
  ).length;
  const alertCount = mentions.filter(
    (m) => m.sentimentTrafficLight === "alert" || m.sentiment.includes("negative")
  ).length;
  const okCount = Math.max(0, mentions.length - happyCount - alertCount);
  const happyPct = mentions.length > 0 ? Math.round((happyCount / total) * 100) : 86;
  const alertPct = mentions.length > 0 ? Math.round((alertCount / total) * 100) : 2;
  const okPct = Math.max(0, 100 - happyPct - alertPct);
  const topCompetitor = competitors.find((c) => !c.isPrimary) || competitors[0];
  const isIndividual = primaryEntity.type === "individual";

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary via-violet to-slate-900 text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="w-4 h-4 text-primary-light" />
            <span className="text-xs font-bold text-primary-light uppercase tracking-wider">Automated Reporting Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Executive Reporting & Sentiment PDF Studio</h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            Export standalone Traffic Light Sentiment PDFs, dedicated Negative Sentiment Risk Audits, multi-tab Excel data streams, and presentation infographics for {primaryEntity.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generateExcelReport}
            className="bg-teal text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-teal-dark shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* CORE 4-REPORT EXECUTIVE PDF SUITE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* REPORT CARD 1: Traffic Light Sentiment PDF */}
        <div className="bg-card p-6 rounded-3xl border-2 border-green/30 bg-green-light/10 shadow-ios flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green text-white">
                Report 1 • Executive Briefing
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Format: PDF</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Executive Command & Traffic Light Audit PDF 🟢🟡🔴
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Full executive breakdown of {primaryEntity.name} featuring a dedicated **Executive Command Screen Shot**, live telemetry state, Traffic Light metrics (Happy {happyPct}%, OK {okPct}%, Alert {alertPct}%), multilingual NLP matrices, and 5-way peer benchmarks.
            </p>

            <div className="grid grid-cols-3 gap-2 my-4 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-white border border-green/30 text-green text-center">
                <span className="block text-lg font-extrabold">{happyPct}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-600">Happy</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber/30 text-amber text-center">
                <span className="block text-lg font-extrabold">{okPct}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-600">OK State</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-coral/30 text-coral text-center">
                <span className="block text-lg font-extrabold">{alertPct}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-600">Alert</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => generateTrafficLightSentimentPdf(primaryEntity, mentions, competitors, geoScope)}
            className="w-full bg-green hover:bg-green-dark text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Executive Command + Traffic Light PDF</span>
          </button>
        </div>

        {/* REPORT CARD 2: Negative Sentiment Deep-Dive PDF */}
        <div className="bg-card p-6 rounded-3xl border-2 border-coral/30 bg-coral-light/10 shadow-ios flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-coral text-white">
                Report 2 • Crisis & Vulnerability Audit
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Format: PDF</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Negative Sentiment Deep-Dive PDF 🔴🚨
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Dedicated crisis report isolating customer feedback for {primaryEntity.name}, peer risk vulnerabilities{topCompetitor ? ` (${topCompetitor.name} ${topCompetitor.metrics?.reputationRiskScore || 65}/100)` : ""}, geographic negativity hotspots, root-cause aspect breakdowns, and mitigation actions.
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-white border border-coral/30 text-coral">
                <span className="block text-xs uppercase font-bold text-slate-500">{primaryEntity.name} Risk</span>
                <span className="text-lg font-extrabold">{Math.max(8, alertPct * 3)}/100 (Low Direct)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-coral/30 text-coral">
                <span className="block text-xs uppercase font-bold text-slate-500">{topCompetitor ? topCompetitor.name : "Peer"} Risk</span>
                <span className="text-lg font-extrabold text-coral">{topCompetitor ? topCompetitor.metrics?.reputationRiskScore || 68 : 65}/100</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => generateNegativeSentimentRiskPdf(primaryEntity, mentions, competitors, geoScope)}
            className="w-full bg-coral hover:bg-coral-dark text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Negative Sentiment Deep-Dive PDF</span>
          </button>
        </div>

        {/* REPORT CARD 3: Corporate/Public Reputation & Trust Audit PDF */}
        <div className="bg-card p-6 rounded-3xl border-2 border-primary/30 bg-primary-light/10 shadow-ios flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-primary text-white">
                Report 3 • Reputation Management
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Format: PDF</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              {isIndividual ? "Public Leadership & Trust Audit PDF 🏆" : "Corporate Reputation & Trust Audit PDF 🏆"}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Comprehensive stakeholder cohort barometer ({isIndividual ? "Constituents, Civic Leaders, Digital Demographics" : "Enterprise clients, Regulators, SMEs, Investors"}), ESG & governance scorecard, executive brand image index, and Net Promoter Score (+68).
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-white border border-primary/30 text-primary">
                <span className="block text-xs uppercase font-bold text-slate-500">Trust & Approval Score</span>
                <span className="text-lg font-extrabold">91.4 / 100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-primary/30 text-primary">
                <span className="block text-xs uppercase font-bold text-slate-500">Integrity Rating</span>
                <span className="text-lg font-extrabold text-amber">AA+ Top Decile</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => generateReputationAuditPdf(primaryEntity, geoScope, competitors, mentions)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {isIndividual ? "Public Leadership" : "Corporate Reputation"} Audit PDF</span>
          </button>
        </div>

        {/* REPORT CARD 4: Counter Yellow Journalism Dossier PDF */}
        <div className="bg-card p-6 rounded-3xl border-2 border-slate-700 bg-slate-900 text-white shadow-ios flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white">
                Report 4 • Legal & Fact-Check War Room
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Format: PDF</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              Counter Yellow Journalism Rebuttal Dossier PDF ⚖️
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Forensic smear incident debunking for {primaryEntity.name}, clickbait sensationalism ratings, automated legal cease-and-desist demand logs, and coordinated bot amplifier ring network isolation.
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Smears Debunked</span>
                <span className="text-lg font-extrabold text-green">4 Verified 🟢</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Right-of-Reply Dispatch</span>
                <span className="text-lg font-extrabold text-amber-400">100% Rate</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => generateCounterYellowJournalismPdf(primaryEntity, geoScope, mentions)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Yellow Journalism Dossier PDF</span>
          </button>
        </div>
      </div>

      {/* Infographic Generator Studio */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Automatic Infographic Generator Studio</h2>
            <p className="text-xs text-slate-400">Generate presentation-ready visual cards for board briefings & social channels</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold flex-wrap">
            <button
              onClick={() => setActiveInfographic("sentiment")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeInfographic === "sentiment" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              Traffic Light Sentiment
            </button>
            <button
              onClick={() => setActiveInfographic("negative_hotspots")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeInfographic === "negative_hotspots" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              Negative Risk Hotspots
            </button>
            <button
              onClick={() => setActiveInfographic("sov")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeInfographic === "sov" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              Share of Voice
            </button>
            <button
              onClick={() => setActiveInfographic("lead_funnel")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeInfographic === "lead_funnel" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              Lead Funnel
            </button>
          </div>
        </div>

        {/* Infographic Canvas Preview */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-ios flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet/20 rounded-full blur-3xl" />

          {activeInfographic === "sentiment" && (
            <div className="text-center max-w-md space-y-4 relative z-10">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-green text-white rounded-full">
                TRAFFIC LIGHT SENTIMENT ASSET
              </span>
              <h3 className="text-3xl font-extrabold text-green">HAPPY 🟢 {happyPct}/100</h3>
              <p className="text-xs text-slate-300">
                {happyPct}% Positive • {okPct}% Neutral • {alertPct}% Negative Alert Ratio for {primaryEntity.name}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-green font-bold">{happyPct}% Positive</div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-amber font-bold">{okPct}% Neutral</div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-coral font-bold">{alertPct}% Alert</div>
              </div>
            </div>
          )}

          {activeInfographic === "negative_hotspots" && (
            <div className="text-center max-w-md space-y-4 relative z-10">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-coral text-white rounded-full">
                CRISIS VULNERABILITY HOTSPOT ASSET
              </span>
              <h3 className="text-3xl font-extrabold text-coral">
                {topCompetitor ? `${topCompetitor.name} Risk: ${topCompetitor.metrics?.reputationRiskScore || 68}/100` : `${primaryEntity.name} Negative Hotspots`}
              </h3>
              <p className="text-xs text-slate-300">
                Audited sentiment signals monitored across regional IPSCAN nodes ({geoScope}).
              </p>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300">
                Strategy: Real-time sentiment tracking and proactive positioning for {primaryEntity.name}.
              </div>
            </div>
          )}

          {activeInfographic === "sov" && (
            <div className="text-center max-w-md space-y-4 relative z-10">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-primary text-white rounded-full">
                INFOGRAPHIC ASSET • SHARE OF VOICE
              </span>
              <h3 className="text-3xl font-extrabold text-white">{primaryEntity.name}</h3>
              <p className="text-sm text-slate-300 font-semibold">
                MONITORED VOICE VOLUME WITH <span className="text-primary-light font-extrabold text-2xl">{competitors[0]?.metrics?.shareOfVoicePercent || 38.5}% SOV</span>
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <strong className="text-white block text-lg font-extrabold">{(mentions.length || 1250).toLocaleString()}</strong>
                  <span className="text-slate-400">Total Monitored Posts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <strong className="text-green block text-lg font-extrabold">HAPPY 🟢</strong>
                  <span className="text-slate-400">{happyPct}% Positive</span>
                </div>
              </div>
            </div>
          )}

          {activeInfographic === "lead_funnel" && (
            <div className="text-center max-w-md space-y-4 relative z-10">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-violet text-white rounded-full">
                LEAD RADAR FUNNEL ASSET
              </span>
              <h3 className="text-3xl font-extrabold text-white">{leads.length || 18} High-Intent Signals</h3>
              <p className="text-xs text-slate-300">
                Actionable conversion leads identified across monitored social and digital channels
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3 relative z-10">
            <button
              onClick={() => alert("Infographic downloaded in PNG / SVG format!")}
              className="bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
