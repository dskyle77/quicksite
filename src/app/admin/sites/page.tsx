import { getAllSites, getAllUsers } from "@/server/adminFirestore";
import SitesScreen from "@/screen/admin/SitesScreen";

export default async function AdminSitesPage() {
  const [sites, { users }] = await Promise.all([getAllSites(), getAllUsers()]);
  return <SitesScreen sites={sites} users={users} />;
}