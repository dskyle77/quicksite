import { getAllUsers } from "@/server/adminFirestore";
import UsersScreen from "@/screen/admin/UsersScreen";

interface PageProps {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const { cursor } = await searchParams;
  const { users, nextCursor } = await getAllUsers(cursor);
  return <UsersScreen users={users} nextCursor={nextCursor} />;
}