import { getSitesPaginated, getUsersByIds } from "@/server/adminFirestore";
import SitesScreen from "@/screen/admin/SitesScreen";

interface PageProps {
  searchParams: Promise<{ cursor?: string; search?: string; status?: string }>;
}

export default async function AdminSitesPage({ searchParams }: PageProps) {
  const { cursor, search, status } = await searchParams;

  const { sites, nextCursor } = await getSitesPaginated({ cursor, search, statusFilter: status });

  // Fetch only the owners of the sites on the current page
  const ownerUids = sites.map((s) => s.uid).filter(Boolean);
  const users = ownerUids.length > 0 ? await getUsersByIds(ownerUids) : [];

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