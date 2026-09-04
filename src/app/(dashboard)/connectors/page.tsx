"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Zap,
  ShieldCheck,
  Cloud,
  Server,
  Key,
  Database,
  Sliders,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SourceConnectorsPage() {
  const { connectors } = useTenant();

  // AWS Deployment Settings State
  const [showAwsModal, setShowAwsModal] = useState(false);
  const [awsAccessKey, setAwsAccessKey] = useState("AKIAIOSFODNN7EXAMPLE");
  const [awsSecretKey, setAwsSecretKey] = useState("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
  const [showSecret, setShowSecret] = useState(false);
  const [awsRegion, setAwsRegion] = useState("ap-southeast-1");
  const [serviceTarget, setServiceTarget] = useState("AWS ECS Fargate");
  const [s3Bucket, setS3Bucket] = useState("artedge-data-vault-asean");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveCredentials = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setShowAwsModal(false);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-primary to-violet text-white p-6 rounded-3xl shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-primary-light" />
            <span className="text-xs font-bold text-primary-light uppercase tracking-wider">Data Ingestion Gateway</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Source Connectors & AWS Cloud Infrastructure</h1>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            Monitor connection health, OAuth tokens, and rate limits for official social platform APIs, RSS listening pipelines, and AWS production deployment nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAwsModal(true)}
            className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-primary-dark shadow-md"
          >
            <Cloud className="w-4 h-4" />
            <span>AWS Deployment Credentials</span>
          </button>
          <button
            onClick={() => alert("Re-syncing all active API tokens and quotas...")}
            className="bg-white text-slate-900 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-slate-100 shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
            <span>Sync All Connectors</span>
          </button>
        </div>
      </div>

      {/* AWS CLOUD INFRASTRUCTURE ACTIVE HUB */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-ios space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-primary-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AWS Production Infrastructure Deployment</h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-green text-white rounded uppercase">
                  Connected & Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dedicated container pipelines running in Singapore ASEAN region with S3 encrypted storage vaults.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAwsModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-700 transition-all self-start sm:self-auto"
          >
            <Key className="w-3.5 h-3.5 text-primary" />
            <span>Configure AWS Credentials</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">AWS Project</span>
            <span className="text-primary-light font-bold">ArtEDGE (Production)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">AWS Target Region</span>
            <span className="text-teal-light font-bold">ap-southeast-5 (Malaysia / ASEAN)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">S3 Vault Bucket</span>
            <span className="text-slate-200">artedge-data-residency-vault-ap-southeast-5</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">IAM Handshake</span>
            <span className="text-green font-bold flex items-center gap-1 font-sans">
              <ShieldCheck className="w-3.5 h-3.5" /> Project Active & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Connector Health Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Platform Data Ingestion Connectors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectors.map((conn) => (
            <div key={conn.id} className="bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios space-y-4 hover:shadow-ios-hover transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-slate-900 text-white rounded-md">
                  {conn.platform}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-xl flex items-center gap-1 ${conn.status === "healthy" ? "bg-green-light text-green" : "bg-amber-light text-amber"}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {conn.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{conn.name}</h3>
                <p className="text-[11px] text-slate-400">Method: {conn.collectionMethod}</p>
              </div>

              {/* Quota Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">API Quota Consumption</span>
                  <span className={conn.quotaUsedPercent > 80 ? "text-coral" : "text-slate-900"}>{conn.quotaUsedPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${conn.quotaUsedPercent > 80 ? "bg-coral" : "bg-primary"}`}
                    style={{ width: `${conn.quotaUsedPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Remaining Calls: <strong className="text-slate-800">{conn.rateLimitRemaining}</strong></span>
                <span className="text-teal font-bold">{conn.commercialStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AWS Credentials Config Modal */}
      {showAwsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-slate-900">Configure AWS Cloud Deployment Credentials</h3>
              </div>
              <button
                onClick={() => setShowAwsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-700 font-sans font-bold block mb-1">AWS Access Key ID</label>
                <input
                  type="text"
                  value={awsAccessKey}
                  onChange={(e) => setAwsAccessKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-slate-700 font-sans font-bold block mb-1">AWS Secret Access Key</label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={awsSecretKey}
                    onChange={(e) => setAwsSecretKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-sans font-bold block mb-1">Target AWS Region</label>
                  <select
                    value={awsRegion}
                    onChange={(e) => setAwsRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-sans text-xs"
                  >
                    <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                    <option value="ap-southeast-3">ap-southeast-3 (Jakarta)</option>
                    <option value="us-east-1">us-east-1 (N. Virginia)</option>
                    <option value="eu-west-1">eu-west-1 (Ireland)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-sans font-bold block mb-1">S3 Data Vault Bucket</label>
                  <input
                    type="text"
                    value={s3Bucket}
                    onChange={(e) => setS3Bucket(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAwsModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCredentials}
                disabled={isVerifying}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark shadow-md flex items-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Handshake...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Credentials Saved!</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Save & Verify AWS Credentials</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
