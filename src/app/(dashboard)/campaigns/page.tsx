"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { Megaphone, Calendar, Sparkles, CheckCircle2, Copy, FileText, Send } from "lucide-react";

export default function CampaignsPage() {
  const { campaigns } = useTenant();
  const [activeTab, setActiveTab] = useState<"planner" | "calendar">("planner");
  const activeCampaign = campaigns[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet via-primary to-slate-900 text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-violet-light" />
            <span className="text-xs font-bold text-violet-light uppercase tracking-wider">AI Marketing Suite</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Campaign Planner & Content Calendar</h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            Generate content pillars, localized captions, video briefs, and content calendars based on competitor gaps and high-intent audience queries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
          <button
            onClick={() => setActiveTab("planner")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "planner" ? "bg-white text-slate-900 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            Campaign Brief
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "calendar" ? "bg-white text-slate-900 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            Content Calendar
          </button>
        </div>
      </div>

      {activeTab === "planner" ? (
        <div className="space-y-8">
          {/* Active Campaign Overview */}
          <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-green-light text-green rounded-full uppercase">
                  Status: {activeCampaign.status}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{activeCampaign.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{activeCampaign.goal}</p>
              </div>

              <button
                onClick={() => alert("Copied full campaign brief to clipboard!")}
                className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-primary-dark"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Brief</span>
              </button>
            </div>

            {/* Grid: Target Audience + Budget + Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-xs font-bold text-slate-900 block mb-1">Target Audience</strong>
                <p className="text-xs text-slate-600 leading-relaxed">{activeCampaign.targetAudience}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-xs font-bold text-slate-900 block mb-1">Budget Allocation</strong>
                <p className="text-xs text-slate-600 leading-relaxed">{activeCampaign.budgetRange}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-xs font-bold text-slate-900 block mb-1">Duration</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeCampaign.startDate} to {activeCampaign.endDate}
                </p>
              </div>
            </div>

            {/* Content Pillars */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">AI Strategic Content Pillars</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeCampaign.contentPillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-violet-light/30 border border-violet/20 flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-violet text-white font-extrabold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Captions & Copy */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Generated Multi-Platform Captions</h3>
              <div className="space-y-4">
                {activeCampaign.suggestedCaptions.map((cap, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-slate-900 text-white rounded-md">
                        {cap.platform}
                      </span>
                      <button
                        onClick={() => alert("Copied caption to clipboard!")}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Copy Text
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">"{cap.text}"</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {cap.hashtags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Content Calendar View */
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">August 2026 Content Schedule</h2>
            <span className="text-xs text-slate-400 font-medium">Drag-and-drop state enabled</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase pb-2 border-b border-slate-200">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div key={i} className="min-h-[90px] p-2 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400">{i + 1} Aug</span>
                {i % 4 === 0 && (
                  <div className="p-1.5 rounded-xl bg-primary text-white text-[9px] font-bold truncate">
                    LinkedIn: AI Case Study
                  </div>
                )}
                {i % 7 === 2 && (
                  <div className="p-1.5 rounded-xl bg-teal text-white text-[9px] font-bold truncate">
                    X: Local Sentiment Poll
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
