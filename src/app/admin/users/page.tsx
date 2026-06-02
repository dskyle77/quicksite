import { getAllUsers } from "@/server/adminFirestore";
import UsersScreen from "@/screen/admin/UsersScreen";

interface PageProps {
  searchParams: Promise<{ cursor?: string; search?: string; plan?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const { cursor, search, plan } = await searchParams;
  const { users, nextCursor } = await getAllUsers({ cursor, search, planFilter: plan });
  return <UsersScreen users={users} nextCursor={nextCursor} currentSearch={search} currentPlan={plan} />;
}