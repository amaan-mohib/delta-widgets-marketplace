import { Header } from "@/components/header";
import DashboardSidebar from "./components/sidebar";
import DashboardPage from "./components/dashboard-page";
import models from "@/lib/db/models";
import { Table } from "@/lib/db";
import { getAuthUser } from "../actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  const user = await getAuthUser();
  if (!user) {
    redirect(`/login?redirect=/dashboard`);
  }

  const [publishedWidgets, inReviewWidgets, requested] = await Promise.all([
    models
      .Widgets("w")
      .count({ published_count: "w.id" })
      .sum({ likes: "w.likes", downloads: "w.download_count" })
      .join({ wv: Table.WidgetVersions }, "wv.id", "w.latest_version_id")
      .where({ "wv.status": "PUBLISHED", "w.author_id": user.id })
      .first(),
    models
      .WidgetVersions("wv")
      .countDistinct({ count: "widget_id" })
      .join({ w: Table.Widgets }, "wv.widget_id", "w.id")
      .where({ "wv.status": "IN_REVIEW", "w.author_id": user.id })
      .first(),
    models
      .WidgetAudits("wa")
      .select(
        "wa.id",
        "wa.widget_version_id",
        "wv.version",
        "wa.notes",
        "w.key",
        "wv.label",
        "wa.created_at",
      )
      .join({ wv: Table.WidgetVersions }, "wv.id", "wa.widget_version_id")
      .join({ w: Table.Widgets }, "w.id", "wv.widget_id")
      .where({ "wa.action": "REQUESTED_CHANGE", "w.author_id": user.id })
      .orderBy("wa.created_at", "desc"),
  ]);

  return (
    <>
      <Header isDashboard />
      <main className="container flex mx-auto px-4 sm:px-6 lg:px-8 relative">
        <DashboardSidebar activeTab="dashboard" />
        <div className="flex-1 p-3">
          <DashboardPage
            {...{
              publishedCount: Number(publishedWidgets?.published_count ?? 0),
              inReviewCount: Number(inReviewWidgets?.count ?? 0),
              likes: Number(publishedWidgets?.likes ?? 0),
              downloads: Number(publishedWidgets?.downloads ?? 0),
              requested,
            }}
          />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
