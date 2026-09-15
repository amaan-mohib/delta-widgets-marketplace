"use server";

import { getAuthUser } from "@/app/actions";
import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { WidgetType } from "@/lib/types/server";
import { redirect } from "next/navigation";

const PAGE_SIZE = 30;

export const getUserWidgets = async (page: number, pageSize?: number) => {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  pageSize = pageSize || PAGE_SIZE;

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
      .joinRaw(
        `JOIN (
            SELECT DISTINCT ON (widget_id) *
            FROM ${Table.WidgetVersions}
            ORDER BY widget_id, revision DESC
          ) wv ON w.id = wv.widget_id`,
      )
      .where("w.author_id", user.id)
      .orderBy("w.created_at", "desc")
      .limit(pageSize)
      .offset((page - 1) * pageSize) as unknown as WidgetType[],
    models.Widgets().count("id").where("author_id", user.id).first(),
  ]);

  return { widgets, total: Number(total?.count ?? 0) };
};
