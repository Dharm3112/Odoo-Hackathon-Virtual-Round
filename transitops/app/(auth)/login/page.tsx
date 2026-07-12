"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column: Login Form */}
      <div className="w-full lg:w-[480px] shrink-0 flex flex-col p-8 lg:p-12 xl:p-16 relative z-10 bg-background border-r border-outline-variant">
        <div className="flex items-center gap-2 mb-16 lg:mb-24">
          <span className="material-symbols-outlined text-primary text-2xl icon-fill">
            alt_route
          </span>
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary">
            TransitOps
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-headline-lg text-headline-lg mb-2 text-primary">Welcome back</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 lg:mb-10">
            Sign in to access the TransitOps command center.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 font-body-sm text-body-sm px-4 py-2.5 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-4 py-3 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface">Password</label>
                <Link
                  href="#"
                  className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-4 py-3 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-primary text-background font-label-md text-label-md py-3.5 rounded-md hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-auto pt-8 font-label-sm text-label-sm text-outline-variant text-center lg:text-left">
          &copy; 2024 TransitOps Ltd.
        </div>
      </div>

      {/* Right Column: Graphic/Info (Hidden on small screens) */}
      <div className="hidden lg:flex flex-1 relative bg-surface-dim overflow-hidden flex-col justify-between p-12 xl:p-20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low/50 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Systems Operational</span>
          </div>
          <h2 className="font-headline-lg text-[40px] leading-[1.1] tracking-tight text-primary mb-6">
            Enterprise Fleet<br />Intelligence
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Centralized routing, dispatch, and maintenance. Monitor your entire operations network in real-time.
          </p>
        </div>

        {/* Abstract UI Elements Decoration */}
        <div className="relative z-10 w-full max-w-lg self-end mt-12 grid grid-cols-2 gap-4">
          <div className="glass p-5 rounded-lg flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-outline uppercase">Active Trips</span>
            <div className="flex items-end gap-3">
              <span className="font-headline-lg text-headline-lg text-primary font-mono-data">248</span>
              <span className="font-label-sm text-label-sm text-status-green mb-1">+12%</span>
            </div>
            <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden mt-1">
              <div className="h-full w-3/4 bg-primary"></div>
            </div>
          </div>

          <div className="glass p-5 rounded-lg flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-outline uppercase">Fleet Health</span>
            <div className="flex items-end gap-3">
              <span className="font-headline-lg text-headline-lg text-primary font-mono-data">94.2%</span>
            </div>
            <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden mt-1">
              <div className="h-full w-[94%] bg-status-green"></div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-surface-container-highest/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-surface-container-high/30 blur-[80px] pointer-events-none"></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(var(--on-surface-variant) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        ></div>
      </div>
    </div>
  );
}
