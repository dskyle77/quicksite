// src/app/dashboard/new/page.tsx
import { Suspense } from "react";
import CreateSitePage from "@/screen/dashboard/new/DashboardNewScreen"; 

export default function Page() {
  return (
    <Suspense>
      <CreateSitePage />
    </Suspense>
  );
}
