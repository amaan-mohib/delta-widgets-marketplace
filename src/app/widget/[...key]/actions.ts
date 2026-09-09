"use server";

import { Table } from "@/lib/db";
import models from "@/lib/db/models";

export const getWidget = async ({
  widgetKey,
  userId,
  versionParam,
}: {
  widgetKey: string;
  userId?: string;
  versionParam?: string;
}) => {
  const widget = await models.Widgets().where("key", widgetKey).first();
  if (!widget) {
    return null;
  }
  const authorProfile = await models
    .UserProfiles()
    .select("username")
    .where("user_id", widget.author_id)
    .first();
  if (!authorProfile) {
    return null;
  }
  const versions = await models
    .WidgetVersions()
    .where("widget_id", widget.id)
    .orderBy("revision", "desc");
  const approvedVersion = versions.find((v) => v.status === "PUBLISHED");
  const isWidgetAuthor = userId ? userId === widget.author_id : false;
  const latestVersion = isWidgetAuthor ? versions[0] : approvedVersion;

  if ((!approvedVersion && !isWidgetAuthor) || !latestVersion) {
    return null;
  }

  let selectedVersion = latestVersion;
  const version = versionParam
    ? versions.find((item) => item.version === versionParam)
    : null;
  if (isWidgetAuthor && version) {
    selectedVersion = version;
  }

  const assets = await models
    .Assets("a")
    .select("a.id", "a.file_name", "a.size", "a.src", "a.asset_type")
    .join({ w: Table.WidgetVersionAssets }, "a.id", "w.asset_id")
    .where("w.widget_version_id", selectedVersion.id)
    .orderBy("w.sort_order");

  let tags: string[] = [];
  if (isWidgetAuthor && !approvedVersion) {
    const tagSlugs = await models
      .Categories()
      .select("slug")
      .whereIn(
        "id",
        models
          .WidgetVersionCategories()
          .select("category_id")
          .where("widget_version_id", selectedVersion.id),
      );
    tags = tagSlugs.map((t) => t.slug);
  } else {
    const tagSlugs = await models
      .Categories()
      .select("slug")
      .whereIn(
        "id",
        models
          .WidgetCategories()
          .select("category_id")
          .where("widget_id", widget.id),
      );
    tags = tagSlugs.map((t) => t.slug);
  }

  return {
    widget,
    versions: versions.map((v) => v.version),
    assets,
    isWidgetAuthor,
    creator: authorProfile.username,
    selectedVersion,
    tags,
  };
};

export const getIfUserLiked = async ({
  widget_id,
  user_id,
  anon_id,
}: {
  widget_id: number;
  user_id?: string;
  anon_id?: string | null;
}) => {
  if (!user_id && !anon_id) {
    throw new Error("Requires either one of user id or anon id");
  }
  const exists = await models
    .WidgetLikes()
    .where("widget_id", widget_id)
    .andWhere((q) => {
      if (user_id) q.orWhere("user_id", user_id);
      if (anon_id) q.orWhere("anon_user_id", anon_id);
    })
    .first();

  return !!exists;
};

export const likeAction = async ({
  widget_id,
  user_id,
  anon_id,
  liked,
}: {
  widget_id: number;
  user_id?: string;
  anon_id?: string | null;
  liked: boolean;
}) => {
  if (!liked) {
    await Promise.all([
      models.WidgetLikes().insert({
        user_id: user_id,
        anon_user_id: anon_id,
        widget_id,
      }),
      models.Widgets().increment("likes", 1).where("id", widget_id),
    ]);
  } else {
    await Promise.all([
      models
        .WidgetLikes()
        .del()
        .where("widget_id", widget_id)
        .andWhere((q) => {
          if (user_id) q.orWhere("user_id", user_id);
          if (anon_id) q.orWhere("anon_user_id", anon_id);
        }),
      models.Widgets().decrement("likes", 1).where("id", widget_id),
    ]);
  }
};
