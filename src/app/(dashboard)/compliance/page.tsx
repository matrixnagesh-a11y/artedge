"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { ShieldCheck, ShieldAlert, CheckCircle2, UserCheck, FileText, Download, Trash2, Clock, Globe, Mail, Lock } from "lucide-react";

export default function ComplianceCentrePage() {
  const { compliance } = useTenant();
  const [dsrRequests, setDsrRequests] = useState(compliance.dataSubjectRequests);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-primary to-slate-800 text-white p-6 rounded-3xl shadow-ios border border-primary/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-primary-light" />
            <span className="text-xs font-bold text-primary-light uppercase tracking-wider">Governance & Regulatory Assurance</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Malaysian PDPA 2.0 Compliance & DPO Governance</h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            Official compliance infrastructure managed by Matrix IoT Solutions Sdn Bhd, enforcing Malaysia's Personal Data Protection Act (PDPA 2.0 Guidelines).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white text-slate-900 text-xs font-extrabold shadow-md flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span>PDPA 2.0 Certified</span>
          </div>
        </div>
      </div>

      {/* Official Matrix IoT PDPA 2.0 Statement Card */}
      <div className="bg-card p-6 rounded-3xl border-2 border-primary/30 shadow-ios space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">PDPA 2.0 Legal Compliance Statement</h2>
            <p className="text-xs text-slate-500">Matrix IoT Solutions Sdn Bhd • Data Protection & Governance Protocol</p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
          "ArtEDGE (OmniPulse AI) strictly operates under full compliance with Malaysia's Personal Data Protection Act (PDPA 2.0 Guidelines). All digital listening data is collected using hybrid compliant channels (Official platform APIs, OAuth authorized client accounts, public RSS feeds, and customer uploads). Matrix IoT Solutions Sdn Bhd enforces mandatory DPO oversight, end-to-end AES-256 encryption at rest and in transit, multi-tenant Row Level Security (RLS) isolation, and 30-day Data Subject Rights (DSR) response guarantees."
        </p>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
          <span>Copyright © 2026 Matrix IoT Solutions Sdn Bhd. All rights reserved.</span>
          <a href="mailto:support@matrix-iot.com" className="text-primary font-bold hover:underline flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> support@matrix-iot.com
          </a>
        </div>
      </div>

      {/* DPO Applicability Assessment & Officer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              DPO Appointment Status
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-green-light text-green rounded-full">
              Mandatory DPO Appointed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">Assessment Rationale:</strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              {compliance.dpoApplicability.rationale}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-primary-light/40 border border-primary/20 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Designated DPO:</span>
              <strong className="text-slate-900 font-bold">{compliance.dpoApplicability.dpoName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Official DPO Contact:</span>
              <strong className="text-primary font-bold">{compliance.dpoApplicability.dpoEmail}</strong>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Corporate Support:</span>
              <strong className="text-slate-800 font-bold">support@matrix-iot.com</strong>
            </div>
          </div>
        </div>

        {/* DPIA Template & Security Safeguards */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Data Protection Impact Assessment (DPIA)
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-green-light text-green rounded-full">
              PDPA 2.0 Audit Passed
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">1. Data Minimization & Purpose Limitation</span>
              <CheckCircle2 className="w-4 h-4 text-green" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">2. Encryption at Rest & In-Transit (AES-256)</span>
              <CheckCircle2 className="w-4 h-4 text-green" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">3. Tenant Row Level Security (RLS) Isolation</span>
              <CheckCircle2 className="w-4 h-4 text-green" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Subject Request (DSR) Management Queue */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">PDPA 2.0 Data Subject Rights (DSR) Queue</h2>
            <p className="text-xs text-slate-400">Download My Data and Right to be Forgotten / Anonymization requests</p>
          </div>
          <button
            onClick={() => {
              const email = prompt("Enter email for new Data Subject Request:");
              if (email) {
                setDsrRequests((prev) => [
                  ...prev,
                  {
                    id: `dsr-00${prev.length + 1}`,
                    requestType: "download_data",
                    requesterEmail: email,
                    status: "pending",
                    receivedAt: new Date().toISOString(),
                  },
                ]);
              }
            }}
            className="bg-primary text-white font-bold text-xs px-4 py-2 rounded-2xl hover:bg-primary-dark shadow-sm"
          >
            + Log New DSR Request
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3">Request ID</th>
                <th className="pb-3">Requester Email</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Received Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dsrRequests.map((dsr) => (
                <tr key={dsr.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{dsr.id}</td>
                  <td className="py-3 text-slate-700">{dsr.requesterEmail}</td>
                  <td className="py-3 font-bold text-primary">{dsr.requestType.replace("_", " ")}</td>
                  <td className="py-3 text-slate-500">{new Date(dsr.receivedAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg ${dsr.status === "completed" ? "bg-green-light text-green" : "bg-amber-light text-amber"}`}>
                      {dsr.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => alert(`Executed DSR action for ${dsr.requesterEmail}`)}
                      className="px-3 py-1 bg-slate-900 text-white font-bold text-[10px] rounded-lg hover:bg-slate-800"
                    >
                      Process DSR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
