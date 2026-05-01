import { Suspense } from "react";
import DashboardDomainsScreen from "@/screen/dashboard/domains/DashboardDomainsScreen";

export default function DomainsPage() {
  return (
    <Suspense>
      <DashboardDomainsScreen />
    </Suspense>
  );
}
