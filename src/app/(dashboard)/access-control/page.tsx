"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { UserRole, UserProfile, AutoSelfServiceRule } from "@/types";
import {
  Users,
  ShieldCheck,
  Key,
  Lock,
  UserCheck,
  UserPlus,
  QrCode,
  Smartphone,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Globe,
  Sliders,
  Check,
  X,
  Copy,
  RefreshCw,
  Download,
  Laptop,
  ShieldAlert,
  Shield,
  HelpCircle,
  Mail,
  Building,
  Briefcase,
  UserX,
  ExternalLink,
  Info,
} from "lucide-react";

export default function AccessControlPage() {
  const {
    activeTenant,
    user: currentUser,
    users,
    autoSelfServiceRules,
    mfaPolicy,
    permissions,
    auditLogs,
    selfServiceRegister,
    approveSelfServiceUser,
    rejectSelfServiceUser,
    updateUserRole,
    toggleUserStatus,
    updateUserMfaPreference,
    addAutoDomainRule,
    toggleAutoDomainRule,
    deleteAutoDomainRule,
    updateTenantMfaPolicy,
    switchActiveUser,
  } = useTenant();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"users" | "rules" | "mfa" | "rbac" | "audit">("users");

  // User Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [mfaFilter, setMfaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDomainRuleModalOpen, setIsDomainRuleModalOpen] = useState(false);
  const [isSelfServiceTestModalOpen, setIsSelfServiceTestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDept, setInviteDept] = useState("Data Intelligence");
  const [inviteTitle, setInviteTitle] = useState("Brand Analyst");
  const [inviteRole, setInviteRole] = useState<UserRole>("analyst");
  const [inviteMfa, setInviteMfa] = useState(true);
  const [inviteMfaMethod, setInviteMfaMethod] = useState<"totp" | "sms" | "passkey">("totp");

  // Domain Rule Form State
  const [newDomain, setNewDomain] = useState("");
  const [newRuleRole, setNewRuleRole] = useState<UserRole>("analyst");
  const [newRuleAutoApprove, setNewRuleAutoApprove] = useState(true);
  const [newRuleEnforceMfa, setNewRuleEnforceMfa] = useState(false);
  const [newRuleDepts, setNewRuleDepts] = useState("Marketing, Strategy, Analytics");

  // Self-Service Registration Simulation State
  const [selfRegName, setSelfRegName] = useState("Daniel Wong");
  const [selfRegEmail, setSelfRegEmail] = useState("daniel.wong@maybank.com");
  const [selfRegDept, setSelfRegDept] = useState("Corporate Innovation");
  const [selfRegTitle, setSelfRegTitle] = useState("Innovation Associate");
  const [selfRegMfa, setSelfRegMfa] = useState(true);
  const [selfRegMfaMethod, setSelfRegMfaMethod] = useState<"totp" | "sms" | "passkey">("passkey");
  const [selfRegResult, setSelfRegResult] = useState<{ success: boolean; requiresApproval: boolean; message: string } | null>(null);

  // Active User Personal MFA Enrollment Wizard State
  const [activeMfaMethod, setActiveMfaMethod] = useState<"totp" | "sms" | "passkey" | "recovery">(
    currentUser.mfaMethod || "totp"
  );
  const [mfaCodeInput, setMfaCodeInput] = useState(["", "", "", "", "", ""]);
  const [isMfaVerifiedSuccess, setIsMfaVerifiedSuccess] = useState(currentUser.mfaEnabled);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Backup Recovery Codes
  const mockBackupCodes = [
    "A8F2-99B1",
    "44C1-789E",
    "B290-DD41",
    "FF82-0199",
    "9C71-55E0",
    "33A2-771B",
    "66B9-224C",
    "EE10-88F4",
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesMfa =
      mfaFilter === "all" ||
      (mfaFilter === "enabled" && u.mfaEnabled) ||
      (mfaFilter === "optional_prompt" && u.mfaOptionalPreference === "optional_prompt") ||
      (mfaFilter === "disabled" && !u.mfaEnabled);

    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesMfa && matchesStatus;
  });

  const pendingUsers = users.filter((u) => u.status === "pending_approval");
  const mfaEnabledUsersCount = users.filter((u) => u.mfaEnabled).length;
  const mfaAdoptionPercent = Math.round((mfaEnabledUsersCount / users.length) * 100) || 0;

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: "platform_super_admin", label: "Platform Super Admin", desc: "Unrestricted infrastructure and cloud tenant governance." },
    { role: "agency_admin", label: "Agency Admin", desc: "Cross-client agency manager with full triage and branding control." },
    { role: "client_admin", label: "Client Admin", desc: "Organization administrator with user self-service approval rights." },
    { role: "marketing_manager", label: "Marketing Manager", desc: "Campaign creator, sentiment strategist, and crisis officer." },
    { role: "analyst", label: "Analyst", desc: "Daily monitoring, mention triage, and AI prompt replenishment." },
    { role: "sales_user", label: "Sales User", desc: "Commercial lead identification and CRM pipeline routing." },
    { role: "executive_viewer", label: "Executive Viewer", desc: "Read-only access to executive KPI cards and PDF reports." },
    { role: "compliance_auditor", label: "Compliance Auditor", desc: "PDPA 2.0 regulatory compliance, data residency, and audit inspector." },
  ];

  const handleMfaDigitInput = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newCode = [...mfaCodeInput];
    newCode[index] = val;
    setMfaCodeInput(newCode);

    if (val && index < 5) {
      const nextElem = document.getElementById(`mfa-setup-digit-${index + 1}`);
      nextElem?.focus();
    }
  };

  const handleTestVerifyMfaCode = () => {
    const codeStr = mfaCodeInput.join("");
    if (codeStr.length === 6) {
      setIsMfaVerifiedSuccess(true);
      updateUserMfaPreference(currentUser.id, true, activeMfaMethod, "optional_prompt");
      showToast("✓ Optional 2FA code verified successfully! Authentication preference updated.");
    } else {
      showToast("Please enter all 6 digits of the authenticator code.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-6 select-none max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-primary/40 flex items-center gap-3 text-xs font-semibold animate-bounce-short">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-card border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-0.5 text-[10px] font-black uppercase bg-primary-light text-primary border border-primary/20 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Zero-Trust Access Control
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-teal-light text-teal-dark border border-teal/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto Self-Service Enabled
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-gold-light text-gold-dark border border-gold/20 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Optional MFA Supported
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Access Control & User Directory
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Enterprise Role-Based Access Control (RBAC), automatic corporate domain self-service onboarding, and flexible Optional Multi-Factor Authentication for <strong>{activeTenant.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSelfServiceTestModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span>Test Self-Service Portal</span>
            </button>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark text-xs font-extrabold shadow-sm shadow-primary/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Provision / Invite User</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-0.5">
              <span>Total Workspace Users</span>
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{users.length}</span>
              <span className="text-[10px] text-green font-bold">
                {users.filter((u) => u.status === "active").length} Active
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-0.5">
              <span>Self-Service Queue</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{pendingUsers.length}</span>
              <span className={`text-[10px] font-bold ${pendingUsers.length > 0 ? "text-amber-600 animate-pulse" : "text-slate-400"}`}>
                {pendingUsers.length > 0 ? "Action Required" : "All Approved"}
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-0.5">
              <span>Optional MFA Adoption</span>
              <ShieldCheck className="w-3.5 h-3.5 text-green" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{mfaAdoptionPercent}%</span>
              <span className="text-[10px] text-slate-500 font-semibold">
                ({mfaEnabledUsersCount}/{users.length} enrolled)
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-0.5">
              <span>Domain Auto-Join Rules</span>
              <Globe className="w-3.5 h-3.5 text-teal" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{autoSelfServiceRules.length}</span>
              <span className="text-[10px] text-teal font-bold">
                {autoSelfServiceRules.filter((r) => r.status === "active").length} Active Domains
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Self-Service Approval Alert Banner */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-900">
                {pendingUsers.length} Self-Service Registration Request{pendingUsers.length > 1 ? "s" : ""} Pending Review
              </h3>
              <p className="text-[11px] text-amber-800">
                Employees from corporate domains have requested workspace access. Review and approve to grant instant RBAC access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {pendingUsers.map((pUser) => (
              <button
                key={pUser.id}
                onClick={() => {
                  approveSelfServiceUser(pUser.id);
                  showToast(`✓ Approved ${pUser.name} (${pUser.email})!`);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Approve {pUser.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: "users", label: `User Directory (${users.length})`, icon: Users },
          { id: "rules", label: `Auto Self-Service (${autoSelfServiceRules.length} Rules)`, icon: Globe },
          { id: "mfa", label: "Optional MFA & Security", icon: Lock },
          { id: "rbac", label: "RBAC Permissions Matrix", icon: Sliders },
          { id: "audit", label: `Access Audit Trail (${auditLogs.length})`, icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSel
                  ? "bg-primary text-white shadow-xs shadow-primary/20"
                  : "bg-card text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS DIRECTORY & SELF-SERVICE MANAGEMENT                         */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-card border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search user name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              {/* Role Filter */}
              <div className="flex items-center gap-1 text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  {rolesList.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* MFA Filter */}
              <select
                value={mfaFilter}
                onChange={(e) => setMfaFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
              >
                <option value="all">All MFA Statuses</option>
                <option value="enabled">MFA Enrolled</option>
                <option value="optional_prompt">Optional Prompt</option>
                <option value="disabled">MFA Disabled</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="suspended">Suspended</option>
              </select>

              {(searchQuery || roleFilter !== "all" || mfaFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                    setMfaFilter("all");
                    setStatusFilter("all");
                  }}
                  className="text-primary hover:underline text-[11px] font-bold px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* User Directory Table */}
          <div className="bg-card border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User & Department</th>
                    <th className="py-3 px-4">Role (RBAC)</th>
                    <th className="py-3 px-4">Provisioning Source</th>
                    <th className="py-3 px-4">Optional MFA Status</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isCurrent = u.id === currentUser.id;
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50/60 transition-colors ${isCurrent ? "bg-primary-light/10" : ""}`}>
                        {/* Name and Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900">{u.name}</span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-primary text-white rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">{u.email}</div>
                              {u.department && (
                                <div className="text-[10px] text-slate-400">
                                  {u.jobTitle ? `${u.jobTitle} • ` : ""}
                                  {u.department}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* RBAC Role Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => {
                              updateUserRole(u.id, e.target.value as UserRole);
                              showToast(`Role updated for ${u.name} to ${e.target.value}`);
                            }}
                            className="bg-white border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            {rolesList.map((r) => (
                              <option key={r.role} value={r.role}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Provisioning Source */}
                        <td className="py-3.5 px-4">
                          {u.provisioningType === "auto_domain_self_service" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-light text-teal-dark border border-teal/20">
                              <Sparkles className="w-3 h-3" /> Auto Domain
                            </span>
                          ) : u.provisioningType === "sso_jit" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <ExternalLink className="w-3 h-3" /> SSO JIT
                            </span>
                          ) : u.provisioningType === "manual_invite" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              <Mail className="w-3 h-3" /> Invited
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <ShieldCheck className="w-3 h-3" /> Admin Created
                            </span>
                          )}
                        </td>

                        {/* Optional MFA Status */}
                        <td className="py-3.5 px-4">
                          {u.mfaEnabled ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {u.mfaMethod === "passkey" ? (
                                  <Fingerprint className="w-3 h-3 text-emerald-600" />
                                ) : u.mfaMethod === "sms" ? (
                                  <Smartphone className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <QrCode className="w-3 h-3 text-emerald-600" />
                                )}
                                <span>{u.mfaMethod?.toUpperCase() || "TOTP"} Enrolled</span>
                              </span>
                              <div className="text-[9.5px] text-slate-400 pl-1">
                                {u.mfaOptionalPreference === "always_required" ? "Enforced" : "Optional 2FA"}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>MFA Optional (Off)</span>
                            </span>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="py-3.5 px-4">
                          {u.status === "active" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green">
                              <span className="w-2 h-2 rounded-full bg-green" /> Active
                            </span>
                          ) : u.status === "pending_approval" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-coral">
                              <span className="w-2 h-2 rounded-full bg-coral" /> Suspended
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.status === "pending_approval" ? (
                              <>
                                <button
                                  onClick={() => {
                                    approveSelfServiceUser(u.id);
                                    showToast(`Approved ${u.name}`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-green text-white font-bold text-[11px] hover:bg-green/90 shadow-2xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    rejectSelfServiceUser(u.id);
                                    showToast(`Rejected ${u.name}`);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-100 text-coral font-bold text-[11px] hover:bg-coral-light"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    switchActiveUser(u.id);
                                    showToast(`Switched active session to ${u.name}`);
                                  }}
                                  title="Test session as this user"
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-50 text-[11px] font-semibold"
                                >
                                  Switch
                                </button>
                                <button
                                  onClick={() => {
                                    updateUserMfaPreference(u.id, !u.mfaEnabled, u.mfaMethod || "totp", u.mfaEnabled ? "disabled" : "optional_prompt");
                                    showToast(`Toggled MFA for ${u.name}`);
                                  }}
                                  title={u.mfaEnabled ? "Disable MFA" : "Enable Optional MFA"}
                                  className={`p-1.5 rounded-lg border text-[11px] font-semibold ${
                                    u.mfaEnabled
                                      ? "border-slate-200 text-slate-600 hover:bg-slate-100"
                                      : "border-primary/30 text-primary hover:bg-primary-light"
                                  }`}
                                >
                                  {u.mfaEnabled ? "Turn MFA Off" : "Turn MFA On"}
                                </button>
                                <button
                                  onClick={() => {
                                    toggleUserStatus(u.id);
                                    showToast(`Status updated for ${u.name}`);
                                  }}
                                  title={u.status === "active" ? "Suspend user" : "Activate user"}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-coral hover:border-coral/40"
                                >
                                  {u.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5 text-green" />}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-xs">No users matching your filters.</p>
                <p className="text-[11px] text-slate-400">Try adjusting your search query or reset filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUTO SELF-SERVICE RULES & DOMAIN GOVERNANCE                       */}
      {/* ========================================================================= */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          {/* Header Explanation Box */}
          <div className="bg-gradient-to-r from-teal-light/40 to-primary-light/30 border border-teal/20 rounded-3xl p-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-teal text-white rounded-full">
                  Zero-Touch Corporate Onboarding
                </span>
                <h2 className="text-base font-black text-slate-900">
                  Automated Corporate Domain Self-Service Rules
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl">
                  Configure corporate email domains (e.g. <code>@maybank.com</code>) that are permitted to auto-join the workspace. Users can register through the self-service portal, inherit pre-assigned RBAC roles, and immediately configure optional MFA.
                </p>
              </div>

              <button
                onClick={() => setIsDomainRuleModalOpen(true)}
                className="px-4 py-2.5 bg-primary text-white hover:bg-primary-dark font-extrabold text-xs rounded-2xl shadow-sm shadow-primary/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>+ Add Domain Auto-Join Rule</span>
              </button>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoSelfServiceRules.map((rule) => {
              const matchingUsersCount = users.filter((u) => u.email.endsWith(rule.domain)).length;
              return (
                <div
                  key={rule.id}
                  className={`bg-card border rounded-3xl p-5 shadow-2xs space-y-4 transition-all ${
                    rule.status === "active" ? "border-slate-200/90" : "border-slate-200 opacity-60 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-light text-teal-dark border border-teal/30 flex items-center justify-center font-mono font-bold text-sm">
                        @
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-sm">{rule.domain}</h3>
                          <span
                            className={`px-2 py-0.2 text-[9px] font-extrabold uppercase rounded-full ${
                              rule.status === "active" ? "bg-green text-white" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {rule.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {matchingUsersCount} user{matchingUsersCount === 1 ? "" : "s"} currently provisioned via this domain
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          toggleAutoDomainRule(rule.id);
                          showToast(`Toggled rule status for ${rule.domain}`);
                        }}
                        className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-bold"
                      >
                        {rule.status === "active" ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => {
                          deleteAutoDomainRule(rule.id);
                          showToast(`Deleted rule for ${rule.domain}`);
                        }}
                        className="p-1.5 rounded-xl border border-slate-200 hover:bg-coral-light hover:text-coral text-slate-400 text-[11px]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rule Configuration Details */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Default Auto-Assigned Role:</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                        {rule.defaultRole.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Instant Auto-Approve:</span>
                      <span className={`font-extrabold text-[11px] ${rule.autoApprove ? "text-green" : "text-amber-600"}`}>
                        {rule.autoApprove ? "✓ Immediate Access" : "Admin Review Required"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Domain MFA Requirement:</span>
                      <span className="font-bold text-slate-700 text-[11px]">
                        {rule.enforceMfaForDomain ? "Enforced on Sign-up" : "Optional (User Choice)"}
                      </span>
                    </div>

                    {rule.allowedDepartments.length > 0 && (
                      <div className="pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                          Allowed Departments:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {rule.allowedDepartments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="text-[9.5px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OPTIONAL MFA & SECURITY ENROLLMENT HUB                            */}
      {/* ========================================================================= */}
      {activeTab === "mfa" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: My Personal Security & Optional 2FA Enrollment */}
          <div className="bg-card border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-primary-light text-primary rounded-full">
                Self-Service Security
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                My Multi-Factor Authentication (Optional 2FA)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Protect your account by enabling an optional second layer of verification during sign in.
              </p>
            </div>

            {/* Master Toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className={`w-4 h-4 ${currentUser.mfaEnabled ? "text-green" : "text-slate-400"}`} />
                  <span>Require Secondary Authentication (2FA)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentUser.mfaEnabled
                    ? "2FA is currently ACTIVE on your personal login session."
                    : "2FA is currently OPTIONAL and turned OFF for your account."}
                </p>
              </div>

              <button
                onClick={() => {
                  const newStatus = !currentUser.mfaEnabled;
                  updateUserMfaPreference(currentUser.id, newStatus, activeMfaMethod, newStatus ? "optional_prompt" : "disabled");
                  setIsMfaVerifiedSuccess(newStatus);
                  showToast(newStatus ? "✓ Optional 2FA activated!" : "2FA disabled for your account.");
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                  currentUser.mfaEnabled ? "bg-primary" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    currentUser.mfaEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* MFA Method Selection Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Primary 2FA Method</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: "totp", label: "App", icon: QrCode },
                  { id: "passkey", label: "Passkey", icon: Fingerprint },
                  { id: "sms", label: "SMS/WA", icon: Smartphone },
                  { id: "recovery", label: "Backup", icon: Key },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = activeMfaMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMfaMethod(m.id as any);
                        updateUserMfaPreference(currentUser.id, currentUser.mfaEnabled, m.id as any);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSel
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wizard Method Body: TOTP */}
            {activeMfaMethod === "totp" && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                    {/* Simulated Clean QR Code Graphic */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="25" height="25" fill="#0F172A" />
                      <rect x="15" y="15" width="15" height="15" fill="white" />
                      <rect x="65" y="10" width="25" height="25" fill="#0F172A" />
                      <rect x="70" y="15" width="15" height="15" fill="white" />
                      <rect x="10" y="65" width="25" height="25" fill="#0F172A" />
                      <rect x="15" y="70" width="15" height="15" fill="white" />
                      <rect x="42" y="15" width="16" height="16" fill="#4C7FF7" />
                      <rect x="42" y="42" width="16" height="16" fill="#0F172A" />
                      <rect x="65" y="65" width="25" height="25" fill="#0F172A" />
                      <rect x="72" y="72" width="11" height="11" fill="white" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-900 text-xs">Scan with Google Authenticator or 1Password</p>
                    <p className="text-[11px] text-slate-500">
                      Or manually enter security key:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                        JBSWY3DPEHPK3PXP
                      </code>
                      <button
                        onClick={() => {
                          setCopiedSecret(true);
                          setTimeout(() => setCopiedSecret(false), 2000);
                          showToast("Copied secret key to clipboard.");
                        }}
                        className="text-primary hover:underline text-[10px] font-bold"
                      >
                        {copiedSecret ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <label className="font-bold text-slate-700 text-[11px] block">
                    Verify 6-Digit Authenticator Code
                  </label>
                  <div className="flex gap-2">
                    {mfaCodeInput.map((val, idx) => (
                      <input
                        key={idx}
                        id={`mfa-setup-digit-${idx}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleMfaDigitInput(idx, e.target.value)}
                        placeholder="•"
                        className="w-9 h-11 text-center font-mono font-black text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ))}
                    <button
                      onClick={handleTestVerifyMfaCode}
                      className="flex-1 bg-primary text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-primary-dark transition-all px-3"
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Method Body: Passkey */}
            {activeMfaMethod === "passkey" && (
              <div className="p-4 bg-primary-light/40 rounded-2xl border border-primary/30 text-center space-y-3">
                <Fingerprint className="w-10 h-10 text-primary mx-auto animate-pulse" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">FIDO2 / WebAuthn Biometric Passkey</h4>
                  <p className="text-[11px] text-slate-600 max-w-sm mx-auto mt-0.5">
                    Seamless biometric authentication using Apple Touch ID, Face ID, Windows Hello, or hardware security keys (YubiKey).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsMfaVerifiedSuccess(true);
                    updateUserMfaPreference(currentUser.id, true, "passkey", "optional_prompt");
                    showToast("✓ Passkey registered via Touch ID / Hardware Key.");
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-xs hover:bg-primary-dark"
                >
                  Register This Device Passkey
                </button>
              </div>
            )}

            {/* Wizard Method Body: SMS / WhatsApp */}
            {activeMfaMethod === "sms" && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <label className="font-bold text-slate-700 block">Mobile Number for Instant OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter mobile number with country code"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none"
                  />
                  <button
                    onClick={() => showToast("Test OTP code sent via WhatsApp & SMS.")}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs"
                  >
                    Send Test OTP
                  </button>
                </div>
              </div>
            )}

            {/* Wizard Method Body: Backup Codes */}
            {activeMfaMethod === "recovery" && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">Emergency Backup Recovery Codes</span>
                  <button
                    onClick={() => {
                      setCopiedBackup(true);
                      setTimeout(() => setCopiedBackup(false), 2000);
                      showToast("Backup codes copied to clipboard.");
                    }}
                    className="text-primary hover:underline text-[11px] font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedBackup ? "Copied!" : "Copy All"}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono font-bold text-slate-700 text-[11px]">
                  {mockBackupCodes.map((code, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Device Remember Preferences */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <span>Remember this device for 30 days (Skip 2FA on trusted browsers)</span>
              </label>
              <p className="text-[10px] text-slate-400 pl-6">
                When enabled, you will only be prompted for optional 2FA when logging in from a new machine or unrecognized IP.
              </p>
            </div>
          </div>

          {/* Right Column: Tenant-Wide MFA Policy Governance */}
          <div className="bg-card border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-gold-light text-gold-dark rounded-full">
                Workspace Security Policy
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Workspace MFA Enforcement Tier
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set tenant-level policies balancing self-service flexibility against mandatory compliance rules.
              </p>
            </div>

            {/* Policy Tiers */}
            <div className="space-y-3">
              {[
                {
                  id: "optional_all",
                  title: "Optional for All Users (Self-Service Friendly)",
                  desc: "Users choose whether to enroll in MFA. Highly recommended for fast onboarding without login friction.",
                  badge: "Current Active Policy",
                },
                {
                  id: "enforce_admins_only",
                  title: "Enforced for Administrators & Compliance Officers Only",
                  desc: "Platform and client admins require MFA; optional for general analysts and sales viewers.",
                  badge: "Recommended for Enterprise",
                },
                {
                  id: "enforce_all",
                  title: "Strictly Enforced for Every Workspace Member",
                  desc: "Zero exceptions. All users must verify 2FA on sign-in.",
                  badge: "High Security",
                },
              ].map((tier) => {
                const isSel = mfaPolicy.enforcementLevel === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      updateTenantMfaPolicy({ enforcementLevel: tier.id as any });
                      showToast(`Updated MFA Policy to: ${tier.title}`);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSel
                        ? "bg-primary-light/40 border-primary shadow-xs"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${isSel ? "border-primary" : "border-slate-300"}`}>
                          {isSel && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </span>
                        <span>{tier.title}</span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {tier.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5">{tier.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Device Window Slider */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Remember Device Window:</span>
                <span className="text-primary font-black">{mfaPolicy.rememberDeviceDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={mfaPolicy.rememberDeviceDays}
                onChange={(e) => updateTenantMfaPolicy({ rememberDeviceDays: Number(e.target.value) })}
                className="w-full accent-primary cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Users on trusted browsers will not receive 2FA prompts for this duration.
              </p>
            </div>

            {/* Allowed Methods Checklist */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">Permitted Multi-Factor Authentication Channels</label>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                {[
                  { id: "totp", label: "Authenticator Apps (TOTP)" },
                  { id: "passkey", label: "WebAuthn Biometric Passkeys" },
                  { id: "sms", label: "SMS & WhatsApp One-Time Passwords" },
                  { id: "recovery", label: "Emergency Backup Security Codes" },
                ].map((meth) => (
                  <label key={meth.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-primary rounded" />
                    <span>{meth.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RBAC PERMISSIONS MATRIX                                           */}
      {/* ========================================================================= */}
      {activeTab === "rbac" && (
        <div className="bg-card border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-primary-light text-primary rounded-full">
                Granular Governance
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Role-Based Access Control (RBAC) Permissions Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect which operational capabilities are granted to each of the 8 enterprise roles.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-green">
                <Check className="w-3.5 h-3.5 text-green" /> Authorized
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <X className="w-3.5 h-3.5 text-slate-400" /> Restricted
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-72">Permission Capability</th>
                  <th className="py-3 px-2 text-center">Platform Admin</th>
                  <th className="py-3 px-2 text-center">Agency Admin</th>
                  <th className="py-3 px-2 text-center">Client Admin</th>
                  <th className="py-3 px-2 text-center">Mktg Mgr</th>
                  <th className="py-3 px-2 text-center">Analyst</th>
                  <th className="py-3 px-2 text-center">Sales User</th>
                  <th className="py-3 px-2 text-center">Exec Viewer</th>
                  <th className="py-3 px-2 text-center">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{perm.label}</div>
                      <div className="text-[10px] text-slate-400">{perm.description}</div>
                    </td>

                    {[
                      "platform_super_admin",
                      "agency_admin",
                      "client_admin",
                      "marketing_manager",
                      "analyst",
                      "sales_user",
                      "executive_viewer",
                      "compliance_auditor",
                    ].map((roleKey) => {
                      const isAllowed = perm.defaultRoles.includes(roleKey as UserRole);
                      return (
                        <td key={roleKey} className="py-3 px-2 text-center">
                          {isAllowed ? (
                            <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center text-xs font-black">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex w-5 h-5 rounded-full bg-slate-100 text-slate-300 items-center justify-center text-xs font-black">
                              –
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AUDIT TRAIL                                                       */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="bg-card border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-primary-light text-primary rounded-full">
                PDPA 2.0 Security Trail
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Access, Authentication & Self-Service Audit Log
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically tracked record of all self-service user enrollments, MFA challenges, and RBAC modifications.
              </p>
            </div>

            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                const downloadAnchor = document.createElement("a");
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `artedge-access-audit-${Date.now()}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast("✓ Downloaded access audit log JSON.");
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail (JSON)</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      log.severity === "security"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : log.severity === "warning"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900">{log.userName}</span>
                      <span className="text-[11px] text-slate-400">({log.userEmail})</span>
                      <span className="px-2 py-0.2 text-[9px] font-bold uppercase rounded-md bg-slate-100 text-slate-600 font-mono">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">{log.details}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3 mt-1.5">
                      <span>IP: {log.ipAddress}</span>
                      <span>•</span>
                      <span>Location: {log.location}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PROVISION / INVITE USER                                         */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200 rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Provision / Invite New User</h3>
                  <p className="text-[11px] text-slate-500">Add team member to {activeTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inviteName || !inviteEmail) return;
                selfServiceRegister({
                  name: inviteName,
                  email: inviteEmail,
                  department: inviteDept,
                  jobTitle: inviteTitle,
                  requestedRole: inviteRole,
                  enableOptionalMfa: inviteMfa,
                  mfaMethod: inviteMfaMethod,
                });
                setIsInviteModalOpen(false);
                showToast(`✓ Successfully provisioned ${inviteName}!`);
                setInviteName("");
                setInviteEmail("");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nurul Izzati"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned RBAC Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none"
                >
                  {rolesList.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional MFA Toggle on Creation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inviteMfa}
                      onChange={(e) => setInviteMfa(e.target.checked)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span>Configure Optional 2FA for this user</span>
                  </label>
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>

                {inviteMfa && (
                  <div className="flex items-center gap-2 text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Method:</span>
                    {(["totp", "passkey", "sms"] as const).map((meth) => (
                      <button
                        key={meth}
                        type="button"
                        onClick={() => setInviteMfaMethod(meth)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          inviteMfaMethod === meth ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600"
                        }`}
                      >
                        {meth}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs hover:bg-primary-dark cursor-pointer"
                >
                  Provision User Now
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD DOMAIN AUTO-JOIN RULE                                       */}
      {/* ========================================================================= */}
      {isDomainRuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200 rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal text-white flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Add Domain Auto-Join Rule</h3>
                  <p className="text-[11px] text-slate-500">Auto-provision users by corporate email domain</p>
                </div>
              </div>
              <button
                onClick={() => setIsDomainRuleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newDomain) return;
                const cleanDomain = newDomain.replace(/^@/, "").trim().toLowerCase();
                addAutoDomainRule({
                  tenantId: activeTenant.id,
                  domain: cleanDomain,
                  defaultRole: newRuleRole,
                  autoApprove: newRuleAutoApprove,
                  allowedDepartments: newRuleDepts.split(",").map((s) => s.trim()).filter(Boolean),
                  enforceMfaForDomain: newRuleEnforceMfa,
                  status: "active",
                });
                setIsDomainRuleModalOpen(false);
                showToast(`✓ Added auto-join rule for @${cleanDomain}!`);
                setNewDomain("");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Corporate Domain</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. petronas.com.my or cimb.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Assigned Role</label>
                <select
                  value={newRuleRole}
                  onChange={(e) => setNewRuleRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none"
                >
                  {rolesList.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Allowed Department Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newRuleDepts}
                  onChange={(e) => setNewRuleDepts(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRuleAutoApprove}
                    onChange={(e) => setNewRuleAutoApprove(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Instant Auto-Approve (No Admin Review needed)</span>
                </label>
                <p className="text-[10px] text-slate-400 pl-6">
                  If unchecked, users with this domain are placed in the Pending Approval queue.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRuleEnforceMfa}
                    onChange={(e) => setNewRuleEnforceMfa(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Enforce mandatory MFA for this domain</span>
                </label>
                <p className="text-[10px] text-slate-400 pl-6">
                  Leave unchecked to keep MFA completely OPTIONAL for self-serviced users.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs hover:bg-teal-dark cursor-pointer"
                >
                  Create Domain Rule
                </button>
                <button
                  type="button"
                  onClick={() => setIsDomainRuleModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SELF-SERVICE REGISTRATION SIMULATOR                             */}
      {/* ========================================================================= */}
      {isSelfServiceTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200 rounded-3xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Self-Service User Registration Simulator</h3>
                  <p className="text-[11px] text-slate-500">Test how employees experience auto-onboarding</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSelfServiceTestModalOpen(false);
                  setSelfRegResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selfRegResult ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {selfRegResult.requiresApproval ? "Registration Queued" : "Instant Access Granted!"}
                </h4>
                <p className="text-xs text-slate-600">{selfRegResult.message}</p>
                <button
                  onClick={() => setSelfRegResult(null)}
                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Test Another User
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const res = selfServiceRegister({
                    name: selfRegName,
                    email: selfRegEmail,
                    department: selfRegDept,
                    jobTitle: selfRegTitle,
                    enableOptionalMfa: selfRegMfa,
                    mfaMethod: selfRegMfaMethod,
                  });
                  setSelfRegResult(res);
                  showToast(res.message);
                }}
                className="space-y-3 text-xs"
              >
                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-[11px] text-blue-900">
                  <strong>Domain Detection:</strong> Entering an email ending in <code>@maybank.com</code> or <code>@maybank2u.com.my</code> will trigger auto-approval and role assignment via active domain governance.
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={selfRegName}
                    onChange={(e) => setSelfRegName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={selfRegEmail}
                    onChange={(e) => setSelfRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Department</label>
                    <input
                      type="text"
                      value={selfRegDept}
                      onChange={(e) => setSelfRegDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                    <input
                      type="text"
                      value={selfRegTitle}
                      onChange={(e) => setSelfRegTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selfRegMfa}
                        onChange={(e) => setSelfRegMfa(e.target.checked)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span>Enroll in Optional 2FA during sign-up</span>
                    </label>
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>

                  {selfRegMfa && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Preferred 2FA:</span>
                      {(["passkey", "totp", "sms"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelfRegMfaMethod(m)}
                          className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase ${
                            selfRegMfaMethod === m ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs hover:bg-primary-dark cursor-pointer"
                  >
                    Simulate Self-Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSelfServiceTestModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
