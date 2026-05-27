/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/types.ts
import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  whatsappNumber?: string;
  defaultAuthor?: string;
  plan: "free" | "growth" | "pro";
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  isAdmin?: boolean;
  hasBusinessProfile?: boolean;
  businessSlug?: string;
}

export interface Site {
  id: string;
  uid: string;
  slug: string;
  type: string;
  name: string;
  theme: string;
  status: string;
  visits?: number;
  whatsappClicks?: number;
  whatsappNumber?: string;
  description?: string;
  ogImage?: string;
  tags?: string[];
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  content: Record<string, any>;
  customDomain?: string;
}

export interface DashboardStats {
  totalVisits: number;
  totalWhatsappClicks: number;
  totalSites: number;
  sitesLeft: number;
}
