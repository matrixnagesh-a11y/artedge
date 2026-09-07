"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { MatrixLogo } from "@/components/common/MatrixLogo";
import {
  Lock,
  Mail,
  Key,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    startOrRefreshFreeTrial,
    users,
    selfServiceRegister,
    setActiveTenant,
    tenants,
  } = useTenant();

  // Screen Mode: "signin" | "signup" | "mfa_verify"
  const [mode, setMode] = useState<"signin" | "signup" | "mfa_verify">("signin");

  // Sign In Form States
  const [email, setEmail] = useState("alex.tan@maybank.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Optional 2FA Code (Only triggered if user previously enabled MFA)
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);

  // Status & Feedback States
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeLogin = (userEmail: string) => {
    setIsSubmitting(true);
    setErrorMsg("");

    // Maintain 14-day free trial timestamp
    startOrRefreshFreeTrial(userEmail);

    setTimeout(() => {
      setIsSubmitting(false);
      if (tenants.length > 0) {
        setActiveTenant(tenants[0]);
      }
      router.push("/dashboard");
    }, 500);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }
    setErrorMsg("");

    // Check if user has MFA enabled in system
    const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser && matchedUser.mfaEnabled && !rememberMe) {
      setMode("mfa_verify");
    } else {
      completeLogin(email);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      setErrorMsg("Please fill in all fields to start your 14-day free trial.");
      return;
    }
    setErrorMsg("");

    // Self-service registration
    selfServiceRegister({
      name: signupName,
      email: signupEmail,
      department: "General",
      jobTitle: "Team Member",
      enableOptionalMfa: false,
    });

    completeLogin(signupEmail);
  };

  const handleMfaDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newCode = [...mfaCode];
    newCode[index] = val;
    setMfaCode(newCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`mfa-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col justify-between items-center p-4 md:p-6 select-none">
      {/* Clean Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4">
        <Link href="/">
          <MatrixLogo />
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1 text-primary font-bold">
            <ShieldCheck className="w-4 h-4" /> 14-Day Free Version
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">PDPA 2.0 Certified</span>
        </div>
      </header>

      {/* Main Basic Card */}
      <main className="w-full max-w-md bg-card border border-slate-200/90 rounded-3xl shadow-ios overflow-hidden my-auto animate-scale-up">
        {/* Card Header */}
        <div className="bg-slate-900 text-white p-7 text-center space-y-1 relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-gold-dark flex items-center justify-center text-white mx-auto shadow-md mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            {mode === "signup" ? "Start 14-Day Free Version" : "Sign In to ArtEDGE"}
          </h1>
          <p className="text-xs text-slate-300">
            {mode === "signup"
              ? "Instant 14-day evaluation • No credit card required"
              : "Access your social media intelligence workspace"}
          </p>

          {/* Clean Segmented Tab Switcher (ONLY Sign In vs Sign Up) */}
          {mode !== "mfa_verify" && (
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl text-xs font-bold mt-4 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-primary text-white shadow-2xs font-extrabold"
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
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  mode === "signup"
                    ? "bg-teal text-white shadow-2xs font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>14-Day Free Trial</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-7 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-coral-light border border-coral/30 text-coral text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. BASIC SIGN IN FORM                                                     */}
          {/* ========================================================================= */}
          {mode === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password</label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions have been dispatched to your email address.");
                    }}
                    className="text-primary hover:underline text-[11px] font-semibold"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-primary rounded border-slate-300"
                  />
                  <span>Remember me for 30 days</span>
                </label>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  14-Day Free Pass
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In — 14-Day Free Version</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-500 text-[11px]">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg("");
                  }}
                  className="text-primary font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. BASIC SIGN UP FORM (14-DAY FREE VERSION)                              */}
          {/* ========================================================================= */}
          {mode === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Tan"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Work / Corporate Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Create Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="p-3 bg-teal-light/40 border border-teal/30 rounded-2xl flex items-center gap-2.5 text-[11px] text-teal-dark font-medium">
                <Clock className="w-4 h-4 text-teal shrink-0" />
                <span>
                  Includes <strong>14 days of free evaluation access</strong>. We will prompt you to register for the paid version every 2 days.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal hover:bg-teal-dark text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isSubmitting ? (
                  <span>Activating Free Trial...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Start 14-Day Free Version</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-500 text-[11px]">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg("");
                  }}
                  className="text-primary font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Sign in to existing account
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. OPTIONAL MFA VERIFICATION (ONLY IF PREVIOUSLY ENROLLED)               */}
          {/* ========================================================================= */}
          {mode === "mfa_verify" && (
            <div className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-primary-light text-primary rounded-full">
                  Secondary Verification
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Enter Authenticator Code</h3>
                <p className="text-[11px] text-slate-500">
                  Enter the 6-digit security code or choose to skip.
                </p>
              </div>

              <div className="flex justify-center gap-2 py-2">
                {mfaCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`mfa-code-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaDigitChange(idx, e.target.value)}
                    placeholder="•"
                    className="w-10 h-12 text-center text-lg font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => completeLogin(email)}
                  className="flex-1 bg-primary text-white font-extrabold text-xs py-3 rounded-2xl shadow-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </button>

                <button
                  onClick={() => completeLogin(email)}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs rounded-2xl cursor-pointer"
                  title="MFA is optional — skip directly to workspace"
                >
                  Skip 2FA
                </button>
              </div>

              <button
                onClick={() => setMode("signin")}
                className="w-full text-slate-500 font-bold hover:text-slate-900 text-center py-1 cursor-pointer text-[11px]"
              >
                ← Back to Email Sign In
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-4xl py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 mt-6">
        <span>© 2026 Matrix IoT Solutions Sdn Bhd. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-primary font-bold">14-Day Free Evaluation Window</span>
          <span>•</span>
          <a href="mailto:support@matrix-iot.com" className="text-slate-700 hover:text-primary font-medium">
            support@matrix-iot.com
          </a>
        </div>
      </footer>
    </div>
  );
}
