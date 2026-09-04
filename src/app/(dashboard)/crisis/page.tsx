"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { AlertTriangle, CheckCircle2, ShieldAlert, FileText, Send, Clock, Users, ArrowUpRight } from "lucide-react";

export default function CrisisWarRoomPage() {
  const { crisis, approveHoldingStatement } = useTenant();
  const [statementText, setStatementText] = useState(crisis.holdingStatementDraft);
  const [isSaved, setIsSaved] = useState(crisis.humanApproved);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Emergency Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-coral via-coral-light/80 to-slate-900 text-white p-6 rounded-3xl shadow-ios border border-coral/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">War Room Active Protocol</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{crisis.title}</h1>
          <p className="text-xs text-slate-100 mt-1 max-w-xl">
            Detected mention velocity spike of <strong className="text-amber-light font-extrabold">+{crisis.mentionVelocitySpike}%</strong> in 30 minutes. Real-time crisis response, stakeholder alignment, and holding statement drafter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-2xl bg-white text-coral font-extrabold text-xs shadow-lg uppercase tracking-wider">
            Severity: {crisis.severity}
          </span>
        </div>
      </div>

      {/* Grid: Incident Facts vs Claims + Holding Statement Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verified Facts vs Unverified Claims */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900">Incident Fact-Check Matrix</h2>
            <p className="text-xs text-slate-400">Separating empirical verified facts from unverified online rumors</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-green-light/40 border border-green/30">
              <span className="text-xs font-extrabold text-green uppercase tracking-wider block mb-2">
                ✓ Verified Facts ({crisis.verifiedFacts.length})
              </span>
              <ul className="space-y-2 text-xs text-slate-800 font-medium">
                {crisis.verifiedFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-coral-light/40 border border-coral/30">
              <span className="text-xs font-extrabold text-coral uppercase tracking-wider block mb-2">
                ⚠ Unverified Online Claims ({crisis.unverifiedClaims.length})
              </span>
              <ul className="space-y-2 text-xs text-slate-800 font-medium">
                {crisis.unverifiedClaims.map((claim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Holding Statement Drafter with Human Approval Gate */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">AI Holding Statement Drafter</h2>
                <p className="text-xs text-slate-400">Mandatory human approval gate before public distribution</p>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${isSaved ? "bg-green-light text-green" : "bg-amber-light text-amber"}`}>
                {isSaved ? "Human Approved" : "Draft Pending Review"}
              </span>
            </div>

            <textarea
              rows={6}
              value={statementText}
              onChange={(e) => {
                setStatementText(e.target.value);
                setIsSaved(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white leading-relaxed font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Requires Client Admin or PR Lead sign-off</span>
            <button
              onClick={() => {
                approveHoldingStatement(statementText);
                setIsSaved(true);
                alert("Holding statement approved and ready for PR distribution.");
              }}
              className="bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-primary-dark shadow-md shadow-primary/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stakeholder Escalation Matrix */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900">Stakeholder Notification & Escalation Checklist</h2>
          <p className="text-xs text-slate-400">Key teams and regulatory bodies scheduled for incident briefs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crisis.stakeholdersToNotify.map((stk, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center">
                #{idx + 1}
              </div>
              <span className="text-xs font-bold text-slate-800">{stk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
