import { getAuthUser } from "@/app/actions";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";
import DashboardSidebar from "../components/sidebar";

export const instant = false;

const AdminLayout = async ({ children }: LayoutProps<"/dashboard/admin">) => {
  const user = await getAuthUser();
  if (!user || user?.role !== "admin") {
    redirect("/login?redirect=/dashboard/admin");
  }

  return (
    <>
      <div className="sticky top-0 w-full z-99">
        <Header isDashboard />
      </div>
      <main className="container flex mx-auto px-4 sm:px-6 lg:px-8 relative">
        <DashboardSidebar activeTab="admin" />
        <div className="flex-1 p-3">{children}</div>
      </main>
    </>
  );
};

export default AdminLayout;
