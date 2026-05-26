// lib/get-client-ip.ts
import "server-only"

import { headers } from 'next/headers';

export async function getClientIP(): Promise<string> {
  const headersList = await headers();

  // Common headers used by proxies, CDNs, and hosting platforms
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  const cfConnectingIP = headersList.get('cf-connecting-ip'); // Cloudflare
  const xClientIP = headersList.get('x-client-ip');
  const xForwarded = headersList.get('x-forwarded');

  // Try different headers in order of preference
  let ip =
    forwardedFor?.split(',')[0]?.trim() ||
    realIP ||
    cfConnectingIP ||
    xClientIP ||
    xForwarded?.split(',')[0]?.trim();

  // Fallback
  if (!ip || ip === '::1' || ip === '127.0.0.1') {
    ip = '127.0.0.1';
  }

  return ip || 'unknown';
}