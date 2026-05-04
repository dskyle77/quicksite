import { getOverviewStats } from "@/server/adminFirestore";
import OverviewScreen from "@/screen/admin/OverviewScreen";

export default async function AdminOverviewPage() {
  const stats = await getOverviewStats();
  return <OverviewScreen stats={stats} />;
}