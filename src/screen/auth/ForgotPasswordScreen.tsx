"use client";

import React, { useState } from "react";
import { Loader2, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordScreen() {
  const { sendReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;
  const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendReset(email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      {/* Background blobs to match Login */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 mb-8 w-fit mx-auto text-left"
        >
          <div className="h-10 w-10 rounded-xl bg-primary grid place-items-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <div>
            <p className="font-bold text-lg leading-none">
              {SITE_STANDARD_NAME}
            </p>
            <p className="text-xs text-muted-foreground">{DOMAIN_NAME}</p>
          </div>
        </Link>

        {isSubmitted ? (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              Check your inbox
            </h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              We&apos;ve sent a password reset link to <br />
              <span className="font-semibold text-foreground">{email}</span>.
              <br />
              <span className="block mt-2">
                If you don&apos;t see the email, please check your spam or junk
                folder.
              </span>
            </p>
            <Link
              href="/login"
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition flex items-center justify-center"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-left">
            <h1 className="text-2xl font-bold mb-1">Reset password</h1>
            <p className="text-sm text-muted-foreground mb-7">
              Enter your email and we&apos;ll send you instructions.
              <br />
              <span className="block mt-2">
                If you don&apos;t see the email, check your spam or junk folder.
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5 ml-0.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
