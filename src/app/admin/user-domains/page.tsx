import { getAllDomains, getAllUsers } from "@/server/adminFirestore";
import UserDomainsScreen from "@/screen/admin/UserDomainsScreen";

export default async function AdminUserDomainsPage() {
  const [domains, { users }] = await Promise.all([getAllDomains(), getAllUsers()]);
  return <UserDomainsScreen domains={domains} users={users} />;
}