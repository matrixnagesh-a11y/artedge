"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { MatrixLogo } from "@/components/common/MatrixLogo";
import { UserProfile, SubscriptionPlanId } from "@/types";
import {
  Lock,
  Key,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  Building,
  Mail,
  RefreshCw,
  Copy,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    authenticateUser,
    verifyMfaCode,
    registerClientTenant,
    tenants,
    setActiveTenant,
    users,
    isContactModalOpen,
    setIsContactModalOpen,
  } = useTenant();

  // Screen Mode: "signin" | "signup" | "mfa_verify"
  const initialMode = (searchParams?.get("mode") as "signin" | "signup" | "mfa_verify") || "signin";
  const [mode, setMode] = useState<"signin" | "signup" | "mfa_verify">(initialMode);

  // Sign In Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Pending User undergoing 2FA
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // Secondary Authentication 6-Digit Code
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [activeTotpChallenge, setActiveTotpChallenge] = useState("839215");
  const [codeCopied, setCodeCopied] = useState(false);

  // Self-Service Client Registration Form States
  const [orgName, setOrgName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>("basic");
  const [signupMfaMethod, setSignupMfaMethod] = useState<"totp" | "sms" | "passkey">("totp");

  // Status & Feedback States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize URL mode if search param changes
  useEffect(() => {
    const urlMode = searchParams?.get("mode") as "signin" | "signup" | "mfa_verify";
    if (urlMode) setMode(urlMode);
    const planParam = searchParams?.get("plan") as SubscriptionPlanId;
    if (planParam) setSelectedPlan(planParam);
  }, [searchParams]);

  // Regenerate dynamic OTP code when entering MFA mode
  const refreshTotpCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveTotpChallenge(newCode);
    setCodeCopied(false);
  };

  // 1-Click Copy & Autofill 2FA Code
  const handleAutofillMfa = () => {
    const digits = activeTotpChallenge.split("");
    setMfaCode(digits);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Handle Sign In (Step 1: Credentials Check)
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const authResult = authenticateUser(email, password, selectedTenantId);

      if (!authResult.success) {
        setErrorMsg(authResult.message || "Invalid email or password.");
        return;
      }

      if (authResult.requiresMfa && authResult.user) {
        setPendingUser(authResult.user);
        refreshTotpCode();
        setMode("mfa_verify");
        setSuccessMsg("Step 1 complete: Password accepted. Please verify secondary authentication.");
      } else if (authResult.user) {
        router.push("/dashboard");
      }
    }, 450);
  };

  // Handle 2FA Verification (Step 2: Secondary Authentication)
  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = mfaCode.join("");

    if (enteredCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit secondary verification code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsSubmitting(false);
      const targetUserId = pendingUser?.id || "usr-superadmin";
      const verifyResult = verifyMfaCode(targetUserId, enteredCode);

      if (!verifyResult.success) {
        setErrorMsg(verifyResult.message || "Invalid 6-digit verification code. Please check your authenticator.");
        return;
      }

      router.push("/dashboard");
    }, 450);
  };

  // Handle Self-Service Client Registration
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!orgName.trim()) {
      setErrorMsg("Please specify your client company or organization name.");
      return;
    }
    if (!adminName.trim()) {
      setErrorMsg("Please enter the administrator's full name.");
      return;
    }
    if (!adminEmail.trim()) {
      setErrorMsg("Please enter a corporate email address.");
      return;
    }
    if (!signupPassword || signupPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const regResult = registerClientTenant({
        clientCompanyName: orgName,
        adminName,
        email: adminEmail,
        password: signupPassword,
        planId: selectedPlan,
        mfaMethod: signupMfaMethod,
      });

      setPendingUser(regResult.user);
      refreshTotpCode();
      setMode("mfa_verify");
      setSuccessMsg(`Workspace '${orgName}' registered on Basic Plan (RM99/mo). Complete secondary 2FA verification to activate.`);
    }, 600);
  };

  const handleMfaDigitChange = (index: number, val: string) => {
    const singleDigit = val.slice(-1);
    const newCode = [...mfaCode];
    newCode[index] = singleDigit;
    setMfaCode(newCode);

    if (singleDigit && index < 5) {
      const nextInput = document.getElementById(`mfa-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleMfaKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !mfaCode[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 md:p-6 select-none">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4">
        <Link href="/">
          <MatrixLogo />
        </Link>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> 2FA Secured SaaS
          </span>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="text-slate-300 hover:text-white underline cursor-pointer"
          >
            Contact for Details
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Card Header */}
        <div className="bg-slate-950 p-7 text-center space-y-1 relative border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white mx-auto shadow-md mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            {mode === "signin"
              ? "Client & Superadmin Sign In"
              : mode === "signup"
              ? "Register Client Workspace"
              : "Secondary Authentication (2FA)"}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === "signin"
              ? "Multi-client enterprise intelligence & sovereign data vault"
              : mode === "signup"
              ? "Self-service onboarding • RM99/month Basic Tier"
              : "Step 2: Enter the 6-digit verification code to proceed"}
          </p>

          {/* Segmented Mode Switcher (Hidden in 2FA mode) */}
          {mode !== "mfa_verify" && (
            <div className="flex items-center bg-slate-900 p-1 rounded-xl text-xs font-bold mt-4 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-primary text-white shadow-xs font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  mode === "signup"
                    ? "bg-teal-600 text-white shadow-xs font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register Client (RM99)</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-7 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. MULTI-CLIENT SIGN IN FORM (NO AUTO-LOGIN, REQUIRES EMAIL & PASSWORD)   */}
          {/* ========================================================================= */}
          {mode === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              {/* Workspace / Client Tenant Selector */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Target Client Workspace</label>
                <div className="relative">
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="">Auto-Detect by User Account</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.mode})
                      </option>
                    ))}
                  </select>
                  <Layers className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Corporate Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-300">Account Password</label>
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Forgot / Request Details?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-primary rounded border-slate-700 bg-slate-800"
                  />
                  <span>Stay signed in (30 days)</span>
                </label>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  2FA Protected
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Secondary Authentication</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-400">
                <span>Need login details or new client setup? </span>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Contact support@matrix-iot.com
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. SECONDARY AUTHENTICATION (2FA 6-DIGIT VERIFICATION)                    */}
          {/* ========================================================================= */}
          {mode === "mfa_verify" && (
            <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Step 2 of 2: Two-Factor Verification
                </span>
                <h3 className="font-extrabold text-white text-sm mt-1">Enter Authenticator Security Code</h3>
                <p className="text-[11px] text-slate-400">
                  Verifying account: <strong className="text-slate-200">{pendingUser?.email || email}</strong>
                </p>
              </div>

              {/* Real-Time Authenticator OTP Challenge Card */}
              <div className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Current Authenticator (TOTP) Code:</span>
                  <span className="text-lg font-mono font-black text-emerald-400 tracking-wider">
                    {activeTotpChallenge}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={refreshTotpCode}
                    className="p-2 text-slate-400 hover:text-white bg-slate-700/60 rounded-xl cursor-pointer"
                    title="Generate fresh code"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAutofillMfa}
                    className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/30 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{codeCopied ? "Pasted!" : "Autofill"}</span>
                  </button>
                </div>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 py-2">
                {mfaCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`mfa-code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleMfaKeyDown(idx, e)}
                    placeholder="•"
                    className="w-10 h-12 text-center text-lg font-black text-white bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-slate-700"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying 2FA & Entering Workspace...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Secondary Authentication & Enter</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="w-full text-slate-400 font-bold hover:text-white text-center py-1 cursor-pointer text-[11px]"
              >
                ← Back to Password Sign In
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. SELF-SERVICE CLIENT REGISTRATION (RM99 BASIC TIER)                     */}
          {/* ========================================================================= */}
          {mode === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Client Company / Brand</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. AirAsia Berhad"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Administrator Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Lim"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Corporate Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. rachel@airasia.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 8 chars"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Plan Choice Banner */}
              <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-300 block text-xs">Basic Version • RM 99 / Month</span>
                  <span className="text-[10px] text-emerald-400 block">Single brand profile, 5k mentions & full sentiment NLP</span>
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-lg">
                  Standard
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Provisioning Client Tenant...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Client Workspace (Proceed to 2FA)</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-[11px]">
                <span className="text-slate-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg("");
                  }}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-4xl py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 mt-6">
        <span>© 2026 Matrix IoT Solutions Sdn Bhd. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Email: <strong className="text-slate-300">support@matrix-iot.com</strong></span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">PDPA 2.0 Certified Security</span>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold tracking-wide">Loading Secure Authentication Gateway...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

