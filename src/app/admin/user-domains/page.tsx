import { getDomainsPaginated, getAllUsers } from "@/server/adminFirestore";
import UserDomainsScreen from "@/screen/admin/UserDomainsScreen";

interface PageProps {
  searchParams: Promise<{ cursor?: string; search?: string }>;
}

export default async function AdminUserDomainsPage({
  searchParams,
}: PageProps) {
  const { cursor, search } = await searchParams;

  const [{ domains, nextCursor }, { users }] = await Promise.all([
    getDomainsPaginated({ cursor, search }),
    getAllUsers(),
  ]);

  return (
    <UserDomainsScreen
      domains={domains}
      users={users}
      nextCursor={nextCursor}
      currentSearch={search ?? ""}
    />
  );
}
