"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, Loader2 } from "lucide-react";
import LoomLogo from "@/components/LoomLogo";

export default function LoginPage() {
  const { refresh } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
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
      window.location.href = "/communities";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <LoomLogo size={36} className="text-foreground" />
            <span className="text-xl font-bold text-foreground tracking-tight">Loom</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Welcome Back</h1>
          <p className="text-[11px] text-muted mt-1">Sign in to your Loom account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                required
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
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-muted-light hover:text-foreground transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
