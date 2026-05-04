import AdminLayoutScreen from "@/screen/admin/adminLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutScreen>{children}</AdminLayoutScreen>;
}
