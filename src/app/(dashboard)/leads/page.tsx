"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { LeadItem } from "@/types";
import { Radar, ExternalLink, UserCheck, Download, CheckCircle2, Building, MessageSquare, Zap } from "lucide-react";

export default function LeadRadarPage() {
  const { leads, updateLeadStatus } = useTenant();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  const statuses: LeadItem["status"][] = ["new", "reviewing", "qualified", "contacted", "won"];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary via-violet to-slate-900 text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radar className="w-4 h-4 text-primary-light animate-spin-slow" />
            <span className="text-xs font-bold text-primary-light uppercase tracking-wider">Buying Intent Conversion Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Lead Radar Workspace</h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            Detects public social conversations showing legitimate purchase intent, supplier requests, and competitor dissatisfaction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exported active leads to CRM format (CSV / Salesforce API ready)!")}
            className="bg-white text-slate-900 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-slate-100 shadow-md"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export to CRM</span>
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-4 py-1.5 rounded-xl transition-all ${
              viewMode === "kanban" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-1.5 rounded-xl transition-all ${
              viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Table View
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500">{leads.length} Active Opportunities</span>
      </div>

      {viewMode === "kanban" ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {statuses.map((status) => {
            const statusLeads = leads.filter((l) => l.status === status);
            return (
              <div key={status} className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/80 flex flex-col gap-3 min-w-[240px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    {status.replace("_", " ")}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-slate-800 rounded-full shadow-xs">
                    {statusLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {statusLeads.map((lead) => (
                    <div key={lead.id} className="p-4 rounded-2xl bg-card border border-slate-200/80 shadow-ios space-y-2 hover:shadow-ios-hover transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{lead.prospectName}</span>
                        <span className="px-2 py-0.5 text-[9px] font-extrabold bg-violet-light text-violet rounded-full">
                          {lead.leadScore}/100
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-semibold">{lead.organization}</p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-3">
                        "{lead.originalPostExcerpt}"
                      </p>

                      <div className="text-[10px] text-slate-400 font-medium">
                        Product: <strong className="text-primary">{lead.suggestedProduct}</strong>
                      </div>

                      {/* Status Move Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="qualified">Qualified</option>
                          <option value="contacted">Contacted</option>
                          <option value="won">Won</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3">Prospect & Organization</th>
                <th className="pb-3">Requirement</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Suggested Solution</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">
                    {lead.prospectName}
                    <span className="text-slate-400 font-normal block text-[10px]">{lead.organization}</span>
                  </td>
                  <td className="py-3 text-slate-700">{lead.requirementCategory}</td>
                  <td className="py-3 text-slate-500">{lead.location}</td>
                  <td className="py-3 text-primary font-bold">{lead.suggestedProduct}</td>
                  <td className="py-3 font-extrabold text-violet">{lead.leadScore}/100</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-800 rounded-lg">
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
