import { getSitesPaginated, getAllUsers } from "@/server/adminFirestore";
import SitesScreen from "@/screen/admin/SitesScreen";

interface PageProps {
  searchParams: Promise<{ cursor?: string; search?: string; status?: string }>;
}

export default async function AdminSitesPage({ searchParams }: PageProps) {
  const { cursor, search, status } = await searchParams;

  const [{ sites, nextCursor }, { users }] = await Promise.all([
    getSitesPaginated({ cursor, search, statusFilter: status }),
    getAllUsers(),
  ]);

  return (
    <SitesScreen
      sites={sites}
      users={users}
      nextCursor={nextCursor}
      currentSearch={search ?? ""}
      currentStatus={status ?? "all"}
    />
  );
}