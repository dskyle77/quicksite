// /src/server/auth/cron.ts

export function verifyCronRequest(req: Request): boolean {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  return token === process.env.CRON_SECRET;
}
