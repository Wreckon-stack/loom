"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, MessageSquare, Users, ArrowUpRight, LogOut, User } from "lucide-react";
import LoomLogo from "@/components/LoomLogo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <LoomLogo size={28} className="text-foreground" />
            <span className="text-base font-bold text-foreground tracking-tight">Loom</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/communities"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-foreground rounded-lg hover:bg-surface-glass transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              Communities
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-foreground rounded-lg hover:bg-surface-glass transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-20 h-8 bg-surface-glass rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/communities"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-light hover:text-foreground transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  @{user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-foreground rounded-lg hover:bg-surface-glass transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-muted hover:text-foreground p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-border mt-2">
            <Link
              href="/communities"
              className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted hover:text-foreground rounded-lg hover:bg-surface-glass transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <Users className="w-3.5 h-3.5" />
              Communities
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted hover:text-foreground rounded-lg hover:bg-surface-glass transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </Link>
            <div className="flex gap-2 pt-2 px-3">
              {user ? (
                <>
                  <span className="flex-1 text-center px-3 py-2 text-xs text-muted-light glass-card-sm">
                    @{user.username}
                  </span>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex-1 text-center px-3 py-2 text-xs text-muted hover:text-foreground glass-card-sm transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 text-center px-3 py-2 text-xs text-muted hover:text-foreground glass-card-sm transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center px-3 py-2 bg-foreground text-background text-xs font-medium rounded-xl hover:opacity-90 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
