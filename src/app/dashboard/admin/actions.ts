"use server";

import { Table, Widgets, WidgetVersions } from "@/lib/db";
import models from "@/lib/db/models";

export const getPendingReviews = async () => {
  const data: (WidgetVersions & Pick<Widgets, "key">)[] = await models
    .WidgetVersions("v")
    .select("v.*", "w.key")
    .join({ w: Table.Widgets }, "v.widget_id", "w.id")
    .where("status", "IN_REVIEW")
    .orderBy("v.created_at", "desc");
  return data;
};
