"use server";

import { getAuthUser } from "@/app/actions";
import db, { Table, WidgetVersions } from "@/lib/db";
import models from "@/lib/db/models";
import { notifyWidgetStatusChanged } from "@/lib/emails";
import { Knex } from "knex";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { cache } from "react";

export const getWidget = cache(
  async ({
    widgetKey,
    userId,
    versionParam,
    isAdmin,
  }: {
    widgetKey: string;
    userId?: string;
    versionParam?: string;
    isAdmin?: boolean;
  }) => {
    "use cache";
    cacheLife("hours");
    cacheTag(`widget-${widgetKey}${versionParam ? "" : `-${versionParam}`}`);

    const widget = await models.Widgets().where("key", widgetKey).first();
    if (!widget) {
      return null;
    }
    const authorProfile = await models
      .UserProfiles()
      .select("username", "donation_links")
      .where("user_id", widget.author_id)
      .first();
    if (!authorProfile) {
      return null;
    }
    const versions = await models
      .WidgetVersions()
      .where("widget_id", widget.id)
      .orderBy("revision", "desc");
    const approvedVersion = versions.find(
      (v) => v.id === widget.latest_version_id,
    );
    const isWidgetAuthor =
      isAdmin || (userId ? userId === widget.author_id : false);
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
    const tags = tagSlugs.map((t) => t.slug);

    return {
      widget,
      versions: versions.map((v) => v.version),
      assets,
      isWidgetAuthor,
      creator: authorProfile,
      selectedVersion,
      tags,
    };
  },
);

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

export const getAuditHistory = async (widget_version_id: number) => {
  return await models
    .WidgetAudits()
    .select("id", "action", "notes", "widget_version_id", "created_at")
    .where("widget_version_id", widget_version_id)
    .orderBy("created_at", "desc");
};

const updateWidgetStatus = async (
  action: string,
  widgetVersion: WidgetVersions,
  trx: Knex.Transaction,
) => {
  if (action === "PUBLISHED") {
    const newerVersion = await models
      .WidgetVersions()
      .where("widget_id", widgetVersion.widget_id)
      .andWhere("revision", ">=", widgetVersion.revision)
      .andWhere("status", "PUBLISHED")
      .first()
      .transacting(trx);
    if (newerVersion) {
      throw new Error("A newer published version already exists");
    } else {
      await models
        .Widgets()
        .update({ latest_version_id: widgetVersion.id })
        .where("id", widgetVersion.widget_id)
        .transacting(trx);
    }
  } else if (widgetVersion.status === "PUBLISHED") {
    const latestPublishedVersion = await models
      .WidgetVersions()
      .where("widget_id", widgetVersion.widget_id)
      .where("status", "PUBLISHED")
      .whereNot("id", widgetVersion.id)
      .orderBy("revision", "desc")
      .first()
      .transacting(trx);

    await models
      .Widgets()
      .where("id", widgetVersion.widget_id)
      .update({
        latest_version_id: latestPublishedVersion?.id ?? null,
      })
      .transacting(trx);
  }
  await models
    .WidgetVersions()
    .update({
      status: action === "REQUESTED_CHANGE" ? "IN_REVIEW" : action,
      published_at: action === "PUBLISHED" ? trx.fn.now() : null,
    })
    .where("id", widgetVersion.id)
    .transacting(trx);
};

const suspendOlderWidgets = async (
  action: string,
  widgetVersion: WidgetVersions,
  userId: string,
  trx: Knex.Transaction,
) => {
  const olderVersions = await models
    .WidgetVersions()
    .where("widget_id", widgetVersion.widget_id)
    .andWhere("revision", "<", widgetVersion.revision)
    .andWhere("status", "<>", "SUSPENDED")
    .transacting(trx);
  if (olderVersions.length === 0) {
    return [];
  }
  await models
    .WidgetVersions()
    .update({ status: "SUSPENDED", published_at: null })
    .whereIn(
      "id",
      olderVersions.map((i) => i.id),
    )
    .transacting(trx);
  await models
    .WidgetAudits()
    .insert(
      olderVersions.map((v) => ({
        action: "SUSPENDED",
        notes: `Suspended because a new version was ${action.toLowerCase().replace(/_/g, " ")}`,
        auditor_id: userId,
        widget_version_id: v.id,
      })),
    )
    .transacting(trx);

  return olderVersions;
};

export const syncCategoryCount = async (trx?: Knex.Transaction) => {
  await (trx || db).raw(
    `UPDATE ${Table.Categories} c
        SET count = (
          SELECT COUNT(DISTINCT wv.widget_id)
          FROM ${Table.WidgetVersionCategories} wvc
          JOIN ${Table.WidgetVersions} wv
            ON wv.id = wvc.widget_version_id
          WHERE wvc.category_id = c.id
            AND wv.status = 'PUBLISHED'
        )`,
  );
};

export const auditAction = async (
  action: string,
  notes: string,
  widgetVersionId: number,
  widgetKey: string,
) => {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const widgetVersion = await models
    .WidgetVersions()
    .where("id", widgetVersionId)
    .first();
  if (!widgetVersion) {
    throw new Error("No widget version found");
  }

  const trx = await db.transaction();
  try {
    await models
      .WidgetAudits()
      .insert({
        action,
        notes: notes || null,
        auditor_id: user.id,
        widget_version_id: widgetVersion.id,
      })
      .transacting(trx);
    if (action !== "COMMENT") {
      await updateWidgetStatus(action, widgetVersion, trx);
      const olderVersions = await suspendOlderWidgets(
        action,
        widgetVersion,
        user.id,
        trx,
      );
      await syncCategoryCount(trx);

      updateTag(`widget-${widgetKey}`);
      updateTag(`widget-${widgetKey}-${widgetVersion.version}`);
      olderVersions.forEach((v) => {
        updateTag(`widget-${widgetKey}-${v.version}`);
      });
      updateTag(`widgets`);
    }

    const widget = await models
      .WidgetVersions("wv")
      .select("w.key", "wv.label", "wv.version", "u.name", "u.email")
      .join({ w: Table.Widgets }, "wv.widget_id", "w.id")
      .join({ u: Table.NeonAuthUser }, "w.author_id", "u.id")
      .where("wv.id", widgetVersionId)
      .first();
    if (widget) {
      await notifyWidgetStatusChanged(
        { name: widget.name, email: widget.email },
        { key: widget.key, label: widget.label, version: widget.version },
        action,
        notes,
      );
    }
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    console.error(error);
    throw new Error("Something went wrong while adding audit");
  }
};

export const updateDownloadCount = async (
  id: number,
  key: string,
  version?: string | null,
) => {
  await models.Widgets().where("id", id).increment("download_count", 1);
  updateTag(`widget-${key}`);
  if (version) {
    updateTag(`widget-${key}-${version}`);
  }
};
