"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { formatNumber } from "@/lib/utils";
import {
  Swords,
  PieChart,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#4C7FF7", "#8069F2", "#36A69A", "#E8A317", "#E86A6A"];

export default function FiveWayCompetitorArenaPage() {
  const {
    competitors,
    recommendations,
    addEntity,
    entityType,
    startNewComparisonPrompt,
    primaryEntity,
    refreshCurrentData,
    isReplenishing,
  } = useTenant();
  const isSolo = competitors.length <= 1;
  const [newCompetitorUrl, setNewCompetitorUrl] = useState("");

  // Prepare dynamic radar dataset from active competitors array
  const radarSubjects = entityType === "individual"
    ? [
        { key: "localStanding", label: "📍 Local Standing" },
        { key: "publicSupport", label: "🤝 Support to Public" },
        { key: "popularity", label: "🌟 Popularity" },
        { key: "publicStatus", label: "🏛️ Public Status" },
        { key: "serviceToSociety", label: "🏗️ Service to Society" },
      ]
    : [
        { key: "visibility", label: "Market Visibility" },
        { key: "engagement", label: "Engagement" },
        { key: "sentiment", label: "Sentiment" },
        { key: "content", label: "Content Mix" },
        { key: "reputation", label: "Trust & Reputation" },
      ];

  const radarMetrics = radarSubjects.map((sub) => {
    const row: Record<string, any> = { subject: sub.label };
    competitors.forEach((c) => {
      if (entityType === "individual" && c.individualPillars) {
        row[c.name] = c.individualPillars[sub.key as keyof typeof c.individualPillars] ?? c.metrics.sentimentScore;
      } else {
        row[c.name] = c.radarScores?.[sub.key as keyof typeof c.radarScores] ?? c.metrics.sentimentScore;
      }
    });
    return row;
  });

  const pieData = competitors.map((c) => ({
    name: c.name,
    value: c.metrics.shareOfVoicePercent,
  }));

  // Unique topics aggregated from all competitors
  const allTopics = Array.from(
    new Set(competitors.flatMap((c) => c.topTopics || ["Market Sentiment", "Innovation", "Reliability"]))
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet via-primary to-slate-900 text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isSolo ? (
              <UserCheck className="w-4 h-4 text-teal-light" />
            ) : (
              <Swords className="w-4 h-4 text-teal-light" />
            )}
            <span className="text-xs font-bold text-teal-light uppercase tracking-wider">
              {isSolo
                ? `Solo ${entityType === "individual" ? "Individual" : "Brand"} Profile & Standing Audit`
                : `${competitors.length}-Way ${entityType === "individual" ? "Leadership & Candidate" : "Corporate"} Benchmarking`}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {isSolo
              ? `Public Standing & Leadership: ${primaryEntity?.name}`
              : `${competitors.length}-Way ${entityType === "individual" ? "Candidate & Leader" : "Competitor"} Arena`}
          </h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            {isSolo
              ? `Detailed telemetry tracking Local Standing, Support to Public, Popularity, Public Status, and Constituency Delivery for ${primaryEntity?.name} without comparing against others.`
              : entityType === "individual"
              ? `Comprehensive multi-axis benchmark tracking Local Standing, Support to Public, Popularity, Public Status, and Service to Society across all ${competitors.length} leaders.`
              : `Simultaneous multi-axis analysis comparing ${competitors.length} corporate brands across Share of Voice, sentiment momentum, and market whitespace.`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Data Button */}
          <button
            onClick={() => refreshCurrentData()}
            disabled={isReplenishing}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            title="Refresh old data and re-scan live telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-light ${isReplenishing ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>

          {isSolo ? (
            <button
              onClick={() => startNewComparisonPrompt(entityType, "multi")}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Compare with Others (2-5)</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => startNewComparisonPrompt(entityType, "multi")}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Compare New Individuals</span>
              </button>
              <button
                onClick={() => startNewComparisonPrompt(entityType, "single")}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 cursor-pointer transition-all"
                title="Switch to 1-person solo audit mode"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-light" />
                <span>Solo (1 Person)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Competitor Cards Header Bar */}
      {isSolo ? (
        <div className="bg-card p-6 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary-light/25 via-white to-card shadow-ios space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-primary text-white font-black text-sm flex items-center justify-center shadow-md">
                #1
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {competitors[0]?.name || primaryEntity.name}
                  </h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-primary text-white rounded-full uppercase">
                    Solo Monitored Figure
                  </span>
                </div>
                <p className="text-xs text-slate-500">{competitors[0]?.titleOrRole || "Primary Leader & Figure"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-primary block leading-none">100%</span>
                <span className="text-[10px] text-slate-400 font-medium">Focused Mindshare SOV</span>
              </div>
              <button
                onClick={() => startNewComparisonPrompt(entityType, "multi")}
                className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-primary-dark transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Comparison Peers</span>
              </button>
            </div>
          </div>

          {/* 5-Pillar Score Cards for the Single Individual */}
          {entityType === "individual" && competitors[0]?.individualPillars ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">📍 Local Standing</span>
                <span className="text-xl font-extrabold text-primary">
                  {competitors[0].individualPillars.localStanding}/100
                </span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${competitors[0].individualPillars.localStanding}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">🤝 Public Support</span>
                <span className="text-xl font-extrabold text-teal">
                  {competitors[0].individualPillars.publicSupport}/100
                </span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-teal h-full rounded-full" style={{ width: `${competitors[0].individualPillars.publicSupport}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">🌟 Popularity</span>
                <span className="text-xl font-extrabold text-purple-700">
                  {competitors[0].individualPillars.popularity}/100
                </span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${competitors[0].individualPillars.popularity}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">🏛️ Public Status</span>
                <span className="text-xl font-extrabold text-amber-700">
                  {competitors[0].individualPillars.publicStatus}/100
                </span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${competitors[0].individualPillars.publicStatus}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">🏗️ Constituency Service</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {competitors[0].individualPillars.serviceToSociety}/100
                </span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${competitors[0].individualPillars.serviceToSociety}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Mentions Volume</span>
                <span className="text-xl font-extrabold text-slate-900">{formatNumber(competitors[0]?.metrics.mentionVolume || 24500)}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Sentiment Score</span>
                <span className="text-xl font-extrabold text-green">{competitors[0]?.metrics.sentimentScore || 85}/100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Credibility Index</span>
                <span className="text-xl font-extrabold text-primary">{competitors[0]?.metrics.credibilityIndex || 95}/100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Reputation Risk</span>
                <span className="text-xl font-extrabold text-teal">{competitors[0]?.metrics.reputationRiskScore || 16}/100</span>
              </div>
            </div>
          )}

          {competitors[0]?.individualPillars?.constituencyFocus && (
            <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">Constituency & Policy Focus:</span>
              <span>{competitors[0].individualPillars.constituencyFocus}</span>
            </div>
          )}
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${competitors.length === 2 ? "sm:grid-cols-2" : competitors.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-5"} gap-4`}>
          {competitors.map((comp, idx) => (
            <div
              key={comp.id}
              className={`p-4 rounded-3xl border transition-all ${
                comp.isPrimary
                  ? "bg-primary-light/30 border-primary shadow-ios"
                  : "bg-card border-slate-200/80 hover:shadow-ios"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                >
                  #{idx + 1}
                </span>
                {comp.isPrimary && (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-primary text-white rounded-full uppercase">
                    Primary Figure
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                {comp.logoUrl && (
                  <img src={comp.logoUrl} alt={comp.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                )}
                <h3 className="text-xs font-bold text-slate-900 truncate">{comp.name}</h3>
              </div>
              {comp.titleOrRole && (
                <p className="text-[10px] text-slate-500 truncate mb-1">{comp.titleOrRole}</p>
              )}

              <div className="text-2xl font-extrabold text-slate-900 mb-2">
                {comp.metrics.shareOfVoicePercent}% <span className="text-[10px] text-slate-400 font-normal">Popularity SOV</span>
              </div>

              <div className="space-y-1.5 text-[10px] text-slate-500 border-t border-slate-100 pt-2">
                {entityType === "individual" && comp.individualPillars ? (
                  <>
                    <div className="flex justify-between">
                      <span>📍 Local Standing:</span>
                      <strong className="text-primary font-bold">{comp.individualPillars.localStanding}/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>🤝 Public Support:</span>
                      <strong className="text-teal font-bold">{comp.individualPillars.publicSupport}/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>🏗️ Constituency Service:</span>
                      <strong className="text-green font-bold">{comp.individualPillars.serviceToSociety}/100</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Mentions:</span>
                      <strong className="text-slate-800">{formatNumber(comp.metrics.mentionVolume)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sentiment Score:</span>
                      <strong className={comp.metrics.sentimentScore >= 80 ? "text-green" : comp.metrics.sentimentScore >= 50 ? "text-amber" : "text-coral"}>
                        {comp.metrics.sentimentScore}/100
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Index:</span>
                      <strong className="text-slate-800">{comp.metrics.reputationRiskScore}/100</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Visualizations: 5-Axis Radar Chart + SOV Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 5-Axis Radar Chart */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isSolo
                  ? `5-Pillar Standing Radar: ${primaryEntity.name}`
                  : entityType === "individual"
                  ? "5-Pillar Public Standing & Service Radar"
                  : "5-Axis Capability Radar"}
              </h2>
              <p className="text-xs text-slate-400">
                {isSolo
                  ? `Individual rating across Local Standing, Support to Public, Popularity, Public Status & Constituency Service`
                  : entityType === "individual"
                  ? `Comparing Local Standing, Support to Public, Popularity, Public Status & Constituency Service across ${competitors.length} leaders`
                  : "Comparing Visibility, Engagement, Sentiment, Content & Reputation"}
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarMetrics}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#475467", fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {competitors.slice(0, 5).map((comp, idx) => (
                  <Radar
                    key={comp.id}
                    name={comp.name}
                    dataKey={comp.name}
                    stroke={COLORS[idx % COLORS.length]}
                    fill={COLORS[idx % COLORS.length]}
                    fillOpacity={isSolo ? 0.4 : comp.isPrimary ? 0.45 : 0.15}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share of Voice Donut Chart */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isSolo ? "100% Focused Narrative Mindshare" : "Popularity & Public Mindshare Share of Voice"}
              </h2>
              <p className="text-xs text-slate-400">
                {isSolo
                  ? `All collected mentions and listening channels reflect ${primaryEntity.name}`
                  : `Percentage distribution across ${competitors.length} monitored ${entityType === "individual" ? "leaders" : "brands"}`}
              </p>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#172033",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    border: "none",
                  }}
                  formatter={(val) => [`${val}% Share of Voice`, "SOV"]}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL PUBLIC STANDING & CONSTITUENCY SERVICE MATRIX */}
      {entityType === "individual" && (
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🏛️ Local Standing, Public Support & Constituency Service Matrix</span>
            </h2>
            <p className="text-xs text-slate-500">
              Granular side-by-side evaluation of all 5 figures on community accessibility, popularity reach, leadership status, and delivered societal projects.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 pl-2">Leader / Candidate</th>
                  <th className="pb-3 text-center">📍 Local Standing</th>
                  <th className="pb-3 text-center">🤝 Support to Public</th>
                  <th className="pb-3 text-center">🌟 Popularity</th>
                  <th className="pb-3 text-center">🏛️ Public Status</th>
                  <th className="pb-3 text-center">🏗️ Service to Society</th>
                  <th className="pb-3 pr-2">Constituency & Societal Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {competitors.map((comp, cIdx) => {
                  const pillars = comp.individualPillars || {
                    localStanding: 85,
                    publicSupport: 82,
                    popularity: 88,
                    publicStatus: 86,
                    serviceToSociety: 90,
                    constituencyFocus: "Constituency welfare and public meetings",
                  };
                  return (
                    <tr key={comp.id} className={comp.isPrimary ? "bg-primary-light/20 font-bold" : "hover:bg-slate-50"}>
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                            style={{ backgroundColor: COLORS[cIdx % COLORS.length] }}
                          >
                            #{cIdx + 1}
                          </span>
                          <div>
                            <span className="text-slate-900 font-bold block">{comp.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{comp.titleOrRole}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] bg-blue-50 text-primary border border-primary/20">
                          {pillars.localStanding}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] bg-teal-50 text-teal border border-teal/20">
                          {pillars.publicSupport}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] bg-purple-50 text-purple-700 border border-purple-200">
                          {pillars.popularity}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                          {pillars.publicStatus}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {pillars.serviceToSociety}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 max-w-xs text-[11px] text-slate-700">
                        {pillars.constituencyFocus}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Topic Ownership Heatmap Grid */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900">Public Conversation & Issue Ownership Heatmap</h2>
          <p className="text-xs text-slate-400">Which leader commands public narrative dominance on key constituency priorities</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3">Constituency Issue / Domain</th>
                {competitors.map((comp) => (
                  <th key={comp.id} className="pb-3 text-center truncate max-w-[120px]">
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTopics.map((topic, tIdx) => (
                <tr key={tIdx} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-900">{topic}</td>
                  {competitors.map((comp, cIdx) => {
                    const score = Math.max(30, Math.min(95, Math.round(comp.metrics.brandVisibilityIndex + (cIdx === 0 ? 10 : -cIdx * 6) + (tIdx % 3) * 4)));
                    return (
                      <td key={comp.id} className="py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                            score >= 80
                              ? "bg-green-light text-green"
                              : score >= 60
                              ? "bg-amber-light text-amber-dark"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {score}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
