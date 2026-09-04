"use server";

import db, { Assets } from "@/lib/db";
import models from "@/lib/db/models";
import { S3, S3_BUCKET } from "@/lib/storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getAuthUser } from "@/app/actions";
import { IUploadManifest, IWidget } from "@/lib/types/manifest";
import { Knex } from "knex";
import { IUser } from "@/lib/types/auth";

interface IUploadJob {
  fileName: string;
  key: string;
  path?: string;
  options?: any;
}

async function createSignedUrl(file: IUploadJob) {
  const url = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: file.key,
      ContentType: file.options?.contentType,
    }),
    { expiresIn: 3600 },
  );
  return {
    url,
    name: file.fileName,
    path: file.path,
  };
}

const upsertWidget = async (
  values: IUploadManifest,
  user: IUser,
  widgetKey: string,
  trx: Knex.Transaction,
) => {
  let widget = await models
    .Widgets()
    .select("id")
    .where({ key: widgetKey, author_id: user.id })
    .first();
  if (!widget) {
    [widget] = await models
      .Widgets()
      .insert({
        key: widgetKey,
        author_id: user.id,
        description: values.description,
        label: values.label,
        widget_type: values.widget_type,
      })
      .returning("id")
      .transacting(trx);
  } else {
    await models
      .Widgets()
      .update({
        description: values.description,
        label: values.label,
        widget_type: values.widget_type,
      })
      .where({ id: widget.id })
      .transacting(trx);
  }
  return widget;
};

const upsertWidgetVersion = async (
  values: IUploadManifest,
  widgetId: number,
  trx: Knex.Transaction,
) => {
  let widgetVersion = await models
    .WidgetVersions()
    .select("id", "revision", "version")
    .where({ widget_id: widgetId, status: "DRAFT" })
    .orderBy("created_at", "desc")
    .first();
  if (!widgetVersion) {
    const latestVersion = await models
      .WidgetVersions()
      .select("id", "revision")
      .where("widget_id", widgetId)
      .orderBy("revision", "desc")
      .first();

    const revision = (latestVersion?.revision ?? 0) + 1;
    const version = values.versionLabel || `v${revision}`;
    [widgetVersion] = await models
      .WidgetVersions()
      .insert({
        widget_id: widgetId,
        status: "DRAFT",
        revision,
        version,
        changelog: values.changelog,
      })
      .returning("*")
      .transacting(trx);
  } else {
    await models
      .WidgetVersions()
      .update({
        changelog: values.changelog ?? "",
      })
      .where({ id: widgetVersion.id })
      .transacting(trx);
  }
  return widgetVersion;
};

const upsertUploadJob = async (
  user: IUser,
  widgetVersionId: number,
  trx: Knex.Transaction,
) => {
  let uploadJob = await models
    .UploadJobs()
    .select("id")
    .where({
      user_id: user.id,
      widget_version_id: widgetVersionId,
      status: "PENDING",
    })
    .first();
  if (!uploadJob) {
    [uploadJob] = await models
      .UploadJobs()
      .insert({
        user_id: user.id,
        widget_version_id: widgetVersionId,
        status: "PENDING",
      })
      .returning("id")
      .transacting(trx);
  } else {
    await models
      .UploadJobFiles()
      .del()
      .where({ job_id: uploadJob.id })
      .transacting(trx);
  }
  return uploadJob;
};

export const createUploadJobs = async (
  widgetKey: string,
  revision: number,
  manifest: Pick<IWidget, "path" | "file" | "widgetType" | "customAssets">,
  values: IUploadManifest,
  uploadJobId: number,
  trx: Knex.Transaction,
) => {
  const uploadKeyPrefix = `widgets/${widgetKey}/${revision}`;
  const uploadJobFiles: IUploadJob[] = [
    {
      fileName: "manifest.json",
      key: `${uploadKeyPrefix}/manifest.json`,
      options: { contentType: "application/json", type: "MANIFEST" },
      path: manifest.path,
    },
  ];
  if (manifest.widgetType === "html") {
    uploadJobFiles.push({
      fileName: "assets.zip",
      key: `${uploadKeyPrefix}/assets.zip`,
      options: { contentType: "application/zip", type: "WIDGET_ASSET" },
      path: manifest.file,
    });
  }
  if (
    manifest.widgetType === "json" &&
    (manifest.customAssets?.length || 0) !== 0
  ) {
    uploadJobFiles.push({
      fileName: "assets.zip",
      key: `${uploadKeyPrefix}/assets.zip`,
      options: { contentType: "application/zip", type: "WIDGET_ASSET" },
    });
  }
  (values.screenshots || [])
    .filter((ss) => !ss.path.startsWith("http"))
    .forEach((item) => {
      uploadJobFiles.push({
        fileName: item.fileName,
        key: `${uploadKeyPrefix}/${item.fileName}`,
        path: item.path,
        options: { type: "SCREENSHOT" },
      });
    });

  await models
    .UploadJobFiles()
    .insert(
      uploadJobFiles.map((item) => ({
        job_id: uploadJobId,
        file_name: item.fileName,
        object_key: item.key,
        options: item.options ? JSON.stringify(item.options) : undefined,
      })),
    )
    .transacting(trx);

  const uploadJobs = await Promise.all(
    uploadJobFiles.map((file) => createSignedUrl(file)),
  );

  return uploadJobs;
};

export const startUpload = async (
  values: IUploadManifest,
  manifest: Pick<IWidget, "path" | "file" | "widgetType" | "customAssets">,
) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!user.profile) {
    throw new Error("User profile not initialized");
  }

  const trx = await db.transaction();
  try {
    const widgetKey = `${user.profile.username}/${values.key}`;

    const widget = await upsertWidget(values, user, widgetKey, trx);
    const widgetVersion = await upsertWidgetVersion(values, widget.id, trx);
    const uploadJob = await upsertUploadJob(user, widgetVersion.id, trx);

    const uploadJobs = await createUploadJobs(
      widgetKey,
      widgetVersion.revision ?? 1,
      manifest,
      values,
      uploadJob.id,
      trx,
    );

    await trx.commit();

    return {
      uploadJobs,
      widget,
      widgetVersion,
      uploadJobId: uploadJob.id,
      widgetKey,
    };
  } catch (error) {
    await trx.rollback();
    console.error(error);
    throw new Error("Something went wrong while creating widget");
  }
};

export const finalizeUpload = async (jobId: number) => {
  const trx = await db.transaction();
  try {
    const job = await models.UploadJobs().where("id", jobId).first();
    if (!job) {
      throw new Error("No job found");
    }

    const files = await models.UploadJobFiles().where("job_id", jobId);
    const output = await Promise.all(
      files.map((item) =>
        S3.send(
          new HeadObjectCommand({
            Bucket: S3_BUCKET,
            Key: item.object_key,
          }),
        ),
      ),
    );

    const assetIds = await models
      .Assets()
      .insert(
        files.map((file, index) => {
          const options = JSON.parse(file.options || "{}");
          return {
            file_name: file.file_name,
            src: file.object_key,
            asset_type: options.type,
            content_type: options.contentType,
            size: output[index]?.ContentLength,
          };
        }),
      )
      .returning("id")
      .transacting(trx);
    // TODO: add sort order
    const widgetVersionId = job.widget_version_id;
    await models
      .WidgetVersionAssets()
      .insert(
        assetIds.map(({ id }) => ({
          asset_id: id,
          widget_version_id: widgetVersionId,
        })),
      )
      .transacting(trx);

    await models
      .WidgetVersions()
      .where("id", widgetVersionId)
      .update({
        status: "IN_REVIEW",
      })
      .transacting(trx);

    // TODO: send mail

    await models
      .UploadJobs()
      .where("id", jobId)
      .update({ status: "COMPLETED" })
      .transacting(trx);
    await models
      .UploadJobFiles()
      .where("job_id", jobId)
      .update({ status: "COMPLETED" })
      .transacting(trx);

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    console.error(error);
    throw new Error("Something went wrong while creating widget");
  }
};

export const getExistingVersions = async (key: string) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!user.profile) {
    throw new Error("User profile not initialized");
  }

  const widgetKey = `${user.profile.username}/${key}`;
  const widget = await models
    .Widgets()
    .select("id", "label", "description")
    .where("key", widgetKey)
    .andWhere("author_id", user.id)
    .first();
  if (!widget) {
    return { widget: null, versions: [], screenshots: [] };
  }

  const versions = await models
    .WidgetVersions()
    .select("id", "revision", "version", "published_at")
    .where("widget_id", widget.id)
    .andWhere("status", "<>", "DRAFT")
    .orderBy("revision", "desc");

  let screenshots: Pick<Assets, "id" | "src" | "file_name" | "size">[] = [];
  if (versions.length > 0) {
    screenshots = await models
      .Assets()
      .select("id", "file_name", "size", "src")
      .whereIn(
        "id",
        models
          .WidgetVersionAssets()
          .select("asset_id")
          .where("widget_version_id", versions[0].id),
      )
      .andWhere("asset_type", "SCREENSHOT")
      .andWhereNot("src", "like", "%icon.png")
      .andWhereNot("src", "like", "%thumb.png");
  }
  return { widget, versions, screenshots };
};
