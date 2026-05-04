/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllUsersSummary,
  getAllSites,
  getAllDomains,
} from "@/server/adminFirestore";
import OverviewScreen from "@/screen/admin/OverviewScreen";

export default async function AdminOverviewPage() {
  const [usersSummary, sites, domains] = await Promise.all([
    getAllUsersSummary(),
    getAllSites(),
    getAllDomains(),
  ]);
  // OverviewScreen only needs plan/status for the dist chart — pass summary
  return (
    <OverviewScreen
      users={usersSummary as any}
      sites={sites}
      domains={domains}
    />
  );
}
