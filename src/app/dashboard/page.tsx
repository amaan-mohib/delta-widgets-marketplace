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

  const widgets = await models
    .Widgets("w")
    .select(
      "w.id",
      "wv.status",
      "w.likes",
      "w.download_count",
      "wv.id as version_id",
    )
    .joinRaw(
      `JOIN (
            SELECT DISTINCT ON (widget_id) *
            FROM ${Table.WidgetVersions}
            WHERE status IN ('PUBLISHED', 'IN_REVIEW')
            ORDER BY widget_id, created_at DESC
          ) wv ON w.id = wv.widget_id`,
    )
    .where("w.author_id", user.id);

  const requested = await models
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
    .where("action", "REQUESTED_CHANGE")
    .whereIn(
      "widget_version_id",
      widgets.map((item) => item.version_id),
    )
    .orderBy("wa.created_at", "desc");

  let publishedCount = 0;
  let inReviewCount = 0;
  let likes = 0;
  let downloads = 0;
  widgets.forEach((item) => {
    if (item.status === "PUBLISHED") {
      publishedCount++;
      likes += Number(item.likes ?? 0);
      downloads += Number(item.download_count ?? 0);
    }
    if (item.status === "IN_REVIEW") {
      inReviewCount++;
    }
  });

  return (
    <>
      <Header isDashboard />
      <main className="container flex mx-auto px-4 sm:px-6 lg:px-8 relative">
        <DashboardSidebar activeTab="dashboard" />
        <div className="flex-1 p-3">
          <DashboardPage
            {...{ publishedCount, inReviewCount, likes, downloads, requested }}
          />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
