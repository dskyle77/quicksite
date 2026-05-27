// src/app/onboarding/page.tsx
import OnboardingScreen from "@/screen/auth/OnboardingScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding — Quicksite",
  description: "Set up your business profile on Quicksite.",
};

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
