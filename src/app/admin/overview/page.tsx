import {
  getAllUsers,
  getAllSites,
  getAllDomains,
} from "@/server/adminFirestore";
import OverviewScreen from "@/screen/admin/OverviewScreen";

export default async function AdminOverviewPage() {
    const [users, sites, domains] = await Promise.all([
        getAllUsers(),
        getAllSites(),
        getAllDomains(),
      ]);
  return <OverviewScreen users={users} sites={sites} domains={domains} />;
}
