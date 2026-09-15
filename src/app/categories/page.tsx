import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";
import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { WidgetWithCreator } from "@/lib/types/server";
import { Suspense } from "react";
import CategoryList from "./components/category-list";
import Loader from "../../components/loader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

const CategoryListPage = async (props: PageProps<"/categories">) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const [tags, totalRes] = await Promise.all([
    models
      .Categories()
      .where("count", ">", 0)
      .orderBy("count", "desc")
      .limit(limit)
      .offset(offset),
    models.Categories().where("count", ">", 0).count("id").first(),
  ]);
  const total = Number(totalRes?.count ?? 0);
  const tagsIds = tags.map((item) => item.id);
  const widgets = await models
    .Widgets("w")
    .select(
      "w.id",
      "w.key",
      "w.download_count",
      "w.widget_type",
      "w.likes",
      "w.published_at",
      "wv.label",
      "wv.id as version_id",
      "wv.version",
      "wv.status",
      "p.username as creator",
      "c.category_id as category_id",
      models
        .Assets("a")
        .join({ wva: Table.WidgetVersionAssets }, "a.id", "wva.asset_id")
        .whereRaw("wva.widget_version_id = wv.id")
        .where("a.asset_type", "SCREENSHOT")
        .orderBy("wva.sort_order")
        .limit(1)
        .select("a.src")
        .as("screenshot_src"),
    )
    .join({ wv: Table.WidgetVersions }, "wv.id", "w.latest_version_id")
    .where("wv.status", "PUBLISHED")
    .join({ p: Table.UserProfiles }, "w.author_id", "p.user_id")
    .join({ c: Table.WidgetVersionCategories }, "wv.id", "c.widget_version_id")
    .whereIn(
      "wv.id",
      models
        .WidgetVersionCategories()
        .select("widget_version_id")
        .whereIn("category_id", tagsIds),
    )
    .orderBy("w.created_at", "desc")
    .limit(10);
  const widgetMap: Record<number, WidgetWithCreator[]> = {};
  widgets.forEach((widget) => {
    if (!widgetMap[widget.category_id]) {
      widgetMap[widget.category_id] = [];
    }
    widgetMap[widget.category_id].push(widget);
  });
  tags.forEach((tag) => {
    if (!widgetMap[tag.id]) {
      widgetMap[tag.id] = [];
    }
  });

  return (
    <div>
      <CategoryList
        tags={tags}
        total={total}
        page={page}
        widgetMap={widgetMap}
      />
    </div>
  );
};

export default async function Categories(props: PageProps<"/categories">) {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="categories" />
        <Suspense fallback={<Loader />}>
          <CategoryListPage {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
}
