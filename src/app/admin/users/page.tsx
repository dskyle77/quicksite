import { getAllUsers } from "@/server/adminFirestore";
import UsersScreen from "@/screen/admin/UsersScreen";

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  return <UsersScreen users={users} />;
}