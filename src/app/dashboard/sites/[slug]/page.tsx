// src/app/dashboard/sites/[slug]/page.tsx
import { Suspense } from "react";
import SiteManagePage from "@/screen/dashboard/sites/manage/SiteManageScreen";

export default function Page() {
  return (
    <Suspense>
      <SiteManagePage />
    </Suspense>
  );
}