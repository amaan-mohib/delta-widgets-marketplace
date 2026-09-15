"use server";

import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { WidgetWithCreator } from "@/lib/types/server";

export const searchWidgets = async (
  query: string,
  sortBy: string,
  sortDirection: string,
  page: number,
) => {
  const limit = 30;
  const offset = (page - 1) * limit;

  const tags = await models
    .Categories()
    .select("id")
    .whereILike("slug", `%${query}%`);

  const [widgets, total] = await Promise.all([
    models
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
      .where((q) => {
        if (tags.length > 0) {
          q.whereIn(
            "wv.id",
            models
              .WidgetVersionCategories()
              .select("widget_version_id")
              .where((q) => {
                q.whereIn(
                  "category_id",
                  tags.map((t) => t.id),
                );
              }),
          );
        }
        q.orWhereILike("wv.label", `%${query}%`).orWhereILike(
          "p.username",
          `%${query}%`,
        );
      })
      .orderBy(sortBy === "label" ? "wv.label" : `w.${sortBy}`, sortDirection)
      .limit(limit)
      .offset(offset) as unknown as WidgetWithCreator[],
    models
      .Widgets("w")
      .count("w.id")
      .join({ wv: Table.WidgetVersions }, "wv.id", "w.latest_version_id")
      .where("wv.status", "PUBLISHED")
      .join({ p: Table.UserProfiles }, "w.author_id", "p.user_id")
      .where((q) => {
        if (tags.length > 0) {
          q.whereIn(
            "wv.id",
            models
              .WidgetVersionCategories()
              .select("widget_version_id")
              .where((q) => {
                q.whereIn(
                  "category_id",
                  tags.map((t) => t.id),
                );
              }),
          );
        }
        q.orWhereILike("wv.label", `%${query}%`).orWhereILike(
          "p.username",
          `%${query}%`,
        );
      })
      .first() as any,
  ]);

  return { widgets, total: Number(total?.count ?? 0) };
};
