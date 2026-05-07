"use client";

import { useAuth } from "@/hooks/useAuth";

import { useRouter } from "next/navigation";
import { Mail, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function VerifyEmailScreen() {
  const { user, loading, logOut, sendVerification } = useAuth();
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const resendEmail = async () => {
    if (!user) return;
    setSending(true);
    try {
      await sendVerification();
      alert("Verification email resent!");
    } catch (e) {
      alert("Too many requests. Try again later.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (user && user.emailVerified) {
        router.replace("/dashboard");
      }
      if (!user) {
        router.replace("/login");
      }
    }
  }, [user, router, loading]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center p-8 bg-card border rounded-2xl shadow-sm">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
        <p className="text-muted-foreground mb-3">
          We sent a link to{" "}
          <span className="text-foreground font-medium">{user?.email}</span>.
          Please click it to activate your account and start building.
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          If you don&apos;t see the email, please check your spam or junk folder.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full h-11 bg-primary text-white rounded-lg font-semibold"
          >
            I&apos;ve verified my email
          </button>

          <button
            onClick={resendEmail}
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
          >
            <RefreshCcw
              className={`h-4 w-4 ${sending ? "animate-spin" : ""}`}
            />
            Resend email
          </button>

          <button onClick={logOut} className="text-sm text-destructive mt-4">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
