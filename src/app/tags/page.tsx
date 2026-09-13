import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";
import models from "@/lib/db/models";
import { Suspense } from "react";
import TagList from "./components/tag-list";
import db, { Table } from "@/lib/db";
import Loader from "@/components/loader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
};

const TagListPage = async (props: PageProps<"/tags">) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page || 1);
  const limit = 30;
  const offset = (page - 1) * limit;

  const [tags, totalRes, totalWidgets] = await Promise.all([
    models
      .Categories()
      .where("count", ">", 0)
      .orderBy("count", "desc")
      .limit(limit)
      .offset(offset),
    models.Categories().where("count", ">", 0).count("id").first(),
    (await models
      .Widgets("w")
      .joinRaw(
        `JOIN (
            SELECT DISTINCT ON (widget_id) *
            FROM ${Table.WidgetVersions}
            WHERE status = 'PUBLISHED'
            ORDER BY widget_id, created_at DESC
          ) wv ON w.id = wv.widget_id`,
      )
      .count("w.id")
      .first()) as any,
  ]);
  const total = Number(totalRes?.count ?? 0);
  const tagsIds = tags.map((item) => item.id);
  const thumbs: { category_id: number; screenshot_src: string }[] = await db
    .from(
      models
        .WidgetVersionCategories()
        .select("category_id", db.raw("max(widget_version_id) as version_id"))
        .whereIn("category_id", tagsIds)
        .groupBy("category_id")
        .as("c"),
    )
    .select(
      "c.category_id",
      models
        .Assets("a")
        .join({ wva: Table.WidgetVersionAssets }, "a.id", "wva.asset_id")
        .whereRaw("wva.widget_version_id = c.version_id")
        .where("a.asset_type", "SCREENSHOT")
        .orderBy("wva.sort_order")
        .limit(1)
        .select("a.src")
        .as("screenshot_src"),
    );
  const thumbMap: Record<number, string> = {};
  thumbs.forEach((thumb) => {
    thumbMap[thumb.category_id] = thumb.screenshot_src;
  });

  return (
    <div>
      <TagList
        tags={tags}
        total={total}
        page={page}
        thumbMap={thumbMap}
        totalWidgets={Number(totalWidgets?.count ?? 0)}
      />
    </div>
  );
};

export default async function Tags(props: PageProps<"/tags">) {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="tags" />
        <Suspense fallback={<Loader />}>
          <TagListPage {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
}
