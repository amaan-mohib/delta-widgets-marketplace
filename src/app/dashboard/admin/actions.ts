"use server";

import { getAuthUser } from "@/app/actions";
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

export const getNotifications = async () => {
  return await models.Notifications().orderBy("created_at", "desc");
};

export const sendNotification = async (
  title: string,
  message: string,
  link?: string | null,
) => {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const [res] = await models
    .Notifications()
    .insert({
      title,
      message,
      link,
    })
    .returning("*");

  return res;
};

export const removeNotification = async (id: number) => {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await models.Notifications().del().where("id", id);
};
