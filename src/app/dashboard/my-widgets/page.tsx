import { Header } from "@/components/header";
import DashboardSidebar from "../components/sidebar";
import WidgetTable from "./widget-table";

export const instant = false;

const MyWidgets = async (props: PageProps<"/dashboard/my-widgets">) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <div className="sticky top-0 w-full z-99">
        <Header isDashboard />
      </div>
      <main className="container flex mx-auto px-4 sm:px-6 lg:px-8 relative">
        <DashboardSidebar activeTab="my-widgets" />
        <div className="flex-1 p-3">
          <WidgetTable page={currentPage} />
        </div>
      </main>
    </>
  );
};

export default MyWidgets;
