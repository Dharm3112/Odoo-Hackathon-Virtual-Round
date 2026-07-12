"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ROLES = [
  { name: "Fleet Manager", icon: "account_tree" },
  { name: "Dispatcher", icon: "navigation" },
  { name: "Safety Officer", icon: "verified_user" },
  { name: "Financial Analyst", icon: "pie_chart" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<typeof ROLES[number]>(ROLES[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", { email, role: role.name, rememberMe });
    setIsLoading(true);
    setFormError("");

    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setFormError("Password must contain uppercase, number, and special character");
      setIsLoading(false);
      return;
    }

    try {
      // Use fetch directly to the NextAuth callback endpoint
      console.log("Fetching CSRF token...");
      const csrfRes = await fetch("/api/auth/csrf", { credentials: "same-origin" });
      if (!csrfRes.ok) throw new Error("Failed to get CSRF token");
      const { csrfToken } = await csrfRes.json();
      console.log("Got CSRF token:", csrfToken);

      console.log("Submitting credentials...");
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "same-origin",
        body: new URLSearchParams({
          email,
          password,
          role: role.name,
          rememberMe: rememberMe.toString(),
          csrfToken,
          callbackUrl,
          json: "true",
        }).toString(),
      });

      console.log("Response status:", res.status);
      console.log("Response URL:", res.url);

      if (res.redirected) {
        if (res.url.includes("/api/auth/signin?csrf=true")) {
          throw new Error("CSRF validation failed. Please refresh and try again.");
        }
        console.log("Login successful (redirected), redirecting to:", callbackUrl);
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      // Handle JSON response (when json=true)
      const data = await res.json();
      console.log("Response data:", data);

      // Check for redirect URL in JSON response
      if (data.url) {
        console.log("Login successful (JSON redirect), redirecting to:", data.url);
        router.push(data.url);
        router.refresh();
        return;
      }

      if (res.ok && !data.error) {
        console.log("Login successful, redirecting to:", callbackUrl);
        router.push(callbackUrl);
        router.refresh();
      } else {
        throw new Error(data.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login exception:", err);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      if (msg.includes("locked")) {
        setFormError(msg);
      } else if (msg.includes("role")) {
        setFormError("Invalid role selected for this account");
      } else if (msg.includes("CSRF")) {
        setFormError(msg);
      } else {
        setFormError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] font-sans antialiased overflow-x-hidden">
      <main className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
        {/* Left Pane: Branding & Info */}
        <section className="w-full md:w-1/2 bg-[#000000] flex flex-col justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden hidden md:block">
          <div className="relative z-10 max-w-lg mx-auto md:mx-0 w-full h-full flex flex-col justify-center gap-12">
            {/* Logo & Tagline */}
            <div className="overflow-hidden">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 overflow-hidden" style={{ letterSpacing: "-0.04em" }}>
                TransitOps
              </h1>
              <p className="text-lg text-[#c4c7c8] font-normal">Smart Transport Operations Platform</p>
            </div>
            {/* Roles List */}
            <div className="flex flex-col gap-6 w-full max-w-sm mt-8">
              {ROLES.map((r) => (
                <div key={r.name} className="flex items-center gap-4 py-3 border-b border-[#353534]">
                  <span className="material-symbols-outlined text-[#8e9192]" style={{ fontSize: "28px" }}>
                    {r.icon}
                  </span>
                  <span className="text-lg text-[#8e9192] font-normal">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Pane: Authentication Form */}
        <section className="w-full md:w-1/2 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 md:p-16 relative">
          {/* Form Container - Glass/Elevated Look */}
          <div className="w-full max-w-md bg-[#131313] border border-[#353534] rounded-xl p-8 shadow-2xl relative z-10 backdrop-blur-xl bg-opacity-80">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {(error || formError) && (
                <Alert variant="destructive" className="text-sm bg-red-900/30 border-red-800 text-red-200">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError || "Invalid email or password. Please try again."}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#e5e2e1]">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className="bg-[#181818] border-[#353534] text-[#e5e2e1] placeholder:text-[#444748] focus:border-white focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#e5e2e1]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="bg-[#181818] border-[#353534] text-[#e5e2e1] placeholder:text-[#444748] focus:border-white focus:ring-0 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9192] hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#e5e2e1]">Role</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const selected = role.name === r.name;
                    return (
                      <button
                        key={r.name}
                        type="button"
                        onClick={() => setRole(r)}
                        disabled={isLoading}
                        className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 text-left text-sm transition-colors ${
                          selected
                            ? "border-white bg-[#252525] text-white"
                            : "border-[#353534] bg-[#181818] text-[#c4c7c8] hover:border-[#8e9192] hover:text-white"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] ${selected ? "icon-fill" : ""}`}>
                          {r.icon}
                        </span>
                        <span className="truncate">{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Utilities (Remember Me & Forgot Password) */}
              <div className="flex items-center justify-between mt-2">
                <Label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isLoading}
                    className="w-4 h-4 rounded-sm bg-[#181818] border-[#353534] text-white focus:ring-0 focus:ring-offset-0 data-[state=checked]:bg-white data-[state=checked]:border-white transition-colors cursor-pointer"
                  />
                  <span className="text-sm text-[#c4c7c8] group-hover:text-[#e5e2e1] transition-colors">
                    Remember me
                  </span>
                </Label>
                <a href="#" className="text-sm text-[#8e9192] hover:text-white transition-colors underline decoration-[#444748] hover:decoration-white underline-offset-4">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-[#393939] hover:bg-[#4a4a4a] text-white font-medium py-3 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Authenticate"
                )}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
