"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Lock, Loader2, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import LoomLogo from "@/components/LoomLogo";

export default function RegisterPage() {
  const { refresh } = useAuth();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkUsername = useCallback((username: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 400);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      await refresh();
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-secondary-dim rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-5 h-5 text-secondary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground mb-1">Welcome to Loom</h1>
          <p className="text-xs text-muted mb-6">
            Your account has been created as <span className="text-foreground font-medium">@{form.username}</span>
          </p>
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Explore Communities
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <LoomLogo size={36} className="text-foreground" />
            <span className="text-xl font-bold text-foreground tracking-tight">Loom</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Join Loom</h1>
          <p className="text-[11px] text-muted mt-1">Create your identity in the crypto community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                type="text"
                placeholder="satoshi_fan"
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  checkUsername(e.target.value);
                }}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-9 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                required
              />
              {usernameStatus === "checking" && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted animate-spin" />
              )}
              {usernameStatus === "available" && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary" />
              )}
              {usernameStatus === "taken" && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-danger" />
              )}
            </div>
            <p className="text-[10px] text-muted mt-1">3-20 characters, letters, numbers, underscores</p>
          </div>

          <div>
            <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="text-[11px] text-danger bg-danger/5 border border-danger/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-muted-light hover:text-foreground transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
