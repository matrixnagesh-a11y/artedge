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
  ShieldCheck,
  Smartphone,
  QrCode,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  Fingerprint,
  CheckSquare,
  Square,
  ShieldAlert,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setActiveTenant, tenants } = useTenant();

  // Login Form States
  const [step, setStep] = useState<"credentials" | "mfa" | "sso">("credentials");
  const [email, setEmail] = useState("alex.tan@matrix-iot.com");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0].id);

  // Optional 2FA State
  const [enableOptional2FA, setEnableOptional2FA] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // MFA Options & Verification
  const [mfaMethod, setMfaMethod] = useState<"totp" | "sms" | "passkey" | "recovery">("totp");
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const performLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const chosenTenant = tenants.find((t) => t.id === selectedTenantId);
      if (chosenTenant) setActiveTenant(chosenTenant);
      router.push("/dashboard");
    }, 600);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter valid credentials.");
      return;
    }
    setErrorMsg("");

    // Optional 2FA Check
    if (enableOptional2FA && !rememberDevice) {
      setStep("mfa");
    } else {
      performLogin();
    }
  };

  const handleMfaCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col justify-between items-center p-6 select-none">
      {/* Top Header Logo Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4">
        <Link href="/">
          <MatrixLogo />
        </Link>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1 text-primary font-bold">
            <ShieldCheck className="w-4 h-4" /> PDPA 2.0 Certified
          </span>
          <span>•</span>
          <Link href="/onboarding" className="text-primary hover:underline font-bold">
            New Onboarding Setup
          </Link>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md bg-card border border-slate-200/80 rounded-3xl shadow-ios overflow-hidden my-auto">
        {/* iOS-Style Card Header */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-1 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-gold-dark flex items-center justify-center text-white mx-auto shadow-md mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">ArtEDGE Portal Access</h1>
          <p className="text-xs text-slate-300">Sign in with optional Secondary Authentication (2FA)</p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-coral-light border border-coral/30 text-coral text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === "credentials" ? (
            /* STEP 1: Direct Login with Optional 2FA */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Tenant Workspace</label>
                <div className="relative">
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.mode.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                  <Building className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password</label>
                  <a href="#" onClick={() => alert("Password reset link sent to your registered email.")} className="text-primary hover:underline text-[11px] font-semibold">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Optional 2FA Options Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableOptional2FA}
                      onChange={(e) => setEnableOptional2FA(e.target.checked)}
                      className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    />
                    <span>Require Secondary Authentication (2FA)</span>
                  </label>
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 pl-6 text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-3.5 h-3.5 text-primary rounded border-slate-300"
                  />
                  <span>Remember this device (Skip 2FA next time)</span>
                </div>
              </div>

              {/* Action Buttons: Direct Sign In vs 2FA Step */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 bg-primary text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{enableOptional2FA && !rememberDevice ? "Proceed to 2FA" : "Direct Sign In"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Or Sign in via Enterprise SSO:</span>
                <button
                  type="button"
                  onClick={() => setStep("sso")}
                  className="font-bold text-slate-900 hover:text-primary underline"
                >
                  Microsoft / Google SSO
                </button>
              </div>
            </form>
          ) : step === "mfa" ? (
            /* STEP 2: Optional Secondary Authentication Step */
            <div className="space-y-5 text-xs">
              <div className="text-center space-y-1">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-primary-light text-primary rounded-full border border-primary/20">
                  Optional Secondary Auth
                </span>
                <h2 className="text-sm font-bold text-slate-900">Multi-Factor Verification</h2>
                <p className="text-[11px] text-slate-500">
                  Select your secondary verification method or click Skip.
                </p>
              </div>

              {/* MFA Method Selection Tabs */}
              <div className="grid grid-cols-4 gap-2 text-center font-bold">
                {[
                  { id: "totp", label: "App", icon: QrCode },
                  { id: "sms", label: "SMS/WA", icon: Smartphone },
                  { id: "passkey", label: "Passkey", icon: Fingerprint },
                  { id: "recovery", label: "Backup", icon: Key },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = mfaMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setMfaMethod(item.id as any)}
                      className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        isSel
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {mfaMethod === "totp" && (
                <div className="space-y-4 text-center">
                  <p className="text-[11px] text-slate-600 font-medium">
                    Enter the 6-digit security code from your Authenticator app:
                  </p>
                  <div className="flex justify-center gap-2">
                    {mfaCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`mfa-digit-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleMfaCodeChange(idx, e.target.value)}
                        className="w-10 h-12 text-center text-lg font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                      />
                    ))}
                  </div>
                </div>
              )}

              {mfaMethod === "sms" && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <p className="text-slate-700 font-medium">
                    OTP sent to <strong>+60 12-*** *890</strong> via WhatsApp / SMS.
                  </p>
                  <button
                    onClick={() => alert("Resent OTP code.")}
                    className="text-primary font-bold underline text-[11px]"
                  >
                    Resend Code
                  </button>
                </div>
              )}

              {mfaMethod === "passkey" && (
                <div className="p-4 bg-primary-light/50 border border-primary/30 rounded-2xl text-center space-y-3">
                  <Fingerprint className="w-8 h-8 text-primary mx-auto animate-pulse" />
                  <p className="text-slate-800 font-bold">Touch ID / Face ID / Hardware Security Key</p>
                </div>
              )}

              {mfaMethod === "recovery" && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Enter 8-Character Recovery Code</label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-center font-bold"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={performLogin}
                  disabled={isVerifying}
                  className="flex-1 bg-primary text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isVerifying ? "Verifying..." : "Verify & Launch"}</span>
                </button>

                <button
                  onClick={performLogin}
                  className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs"
                >
                  Skip 2FA
                </button>
              </div>

              <button
                onClick={() => setStep("credentials")}
                className="w-full text-slate-500 font-bold hover:text-slate-900 text-center py-1"
              >
                ← Back to Credentials
              </button>
            </div>
          ) : (
            /* STEP 3: Enterprise SSO */
            <div className="space-y-4 text-xs text-center">
              <p className="text-slate-600 font-semibold">
                Sign in using your Enterprise Single Sign-On provider:
              </p>

              <button
                onClick={performLogin}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-center gap-3 shadow-xs"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <span>Continue with Google Workspace</span>
              </button>

              <button
                onClick={performLogin}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-center gap-3 shadow-xs"
              >
                <img src="https://microsoft.com/favicon.ico" alt="Microsoft" className="w-4 h-4" />
                <span>Continue with Microsoft Entra ID</span>
              </button>

              <button
                onClick={() => setStep("credentials")}
                className="w-full text-slate-500 font-bold hover:text-slate-900 text-center pt-2"
              >
                ← Back to Standard Login
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="w-full max-w-5xl py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200">
        <span>© 2026 Matrix IoT Solutions Sdn Bhd. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-primary font-bold">PDPA 2.0 Security Certified</span>
          <span>•</span>
          <a href="mailto:support@matrix-iot.com" className="text-slate-700 hover:text-primary font-medium">
            support@matrix-iot.com
          </a>
        </div>
      </footer>
    </div>
  );
}
