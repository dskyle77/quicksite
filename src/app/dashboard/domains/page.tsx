import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardDomainsScreen from "@/screen/dashboard/domains/DashboardDomainsScreen";

export default function DomainsPage() {
  return (
    <Suspense>
      <DashboardDomainsScreen />
    </Suspense>
  );
}
