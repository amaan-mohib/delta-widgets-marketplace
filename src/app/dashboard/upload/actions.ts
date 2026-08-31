"use server";

import db from "@/lib/db";
import models from "@/lib/db/models";
import { S3 } from "@/lib/storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getAuthUser } from "@/app/actions";
import { IUploadManifest } from "@/lib/types/manifest";

export const startUpload = async (manifest: IUploadManifest) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!user.profile) {
    throw new Error("User profile not initialized");
  }

  const trx = await db.transaction();
  try {
    const widgetKey = `${user.profile.username}/${manifest.key}`;
    const [widget] = await models
      .Widgets()
      .insert({
        key: widgetKey,
        author_id: user.id,
        description: manifest.description,
        label: manifest.label,
        widget_type: manifest.widget_type,
      })
      .returning("id")
      .transacting(trx);

    const latestVersion = await models
      .WidgetVersions()
      .select("id", "revision")
      .where("widget_id", widget.id)
      .orderBy("revision", "desc")
      .first();

    const revision = (latestVersion?.revision ?? 0) + 1;
    const version = manifest.versionLabel || `v${revision}`;
    const [widgetVersion] = await models
      .WidgetVersions()
      .insert({
        widget_id: widget.id,
        status: "DRAFT",
        revision,
        version,
        changelog: manifest.changelog,
      })
      .returning("id")
      .transacting(trx);

    const [uploadJob] = await models
      .UploadJobs()
      .insert({
        user_id: user.id,
        widget_version_id: widgetVersion.id,
        status: "PENDING",
      })
      .returning("id")
      .transacting(trx);

    const uploadKeyPrefix = `/widgets/${widgetKey}/${revision}`;
    const uploadJobFiles: { fileName: string; key: string; options?: any }[] = [
      {
        fileName: "manifest.json",
        key: `${uploadKeyPrefix}/manifest.json`,
        options: { contentType: "application/json" },
      },
      {
        fileName: "assets.zip",
        key: `${uploadKeyPrefix}/assets.zip`,
        options: { contentType: "application/zip" },
      },
    ];
    (manifest.screenshots || []).forEach((item) => {
      uploadJobFiles.push({
        fileName: item.fileName,
        key: `${uploadKeyPrefix}/${item.fileName}`,
      });
    });

    await models
      .UploadJobFiles()
      .insert(
        uploadJobFiles.map((item) => ({
          job_id: uploadJob.id,
          file_name: item.fileName,
          object_key: item.key,
          options: item.options ? JSON.stringify(item.options) : undefined,
        })),
      )
      .transacting(trx);

    const bucket = process.env.CF_R2_BUCKET!;
    const uploadJobs = await Promise.all(
      uploadJobFiles.map(async (file) => ({
        ...file,
        url: await getSignedUrl(
          S3,
          new PutObjectCommand({
            Bucket: bucket,
            Key: file.key,
            ContentType: file.options?.contentType,
          }),
          { expiresIn: 3600 },
        ),
      })),
    );

    await trx.commit();

    return {
      uploadJobId: uploadJob.id,
      files: uploadJobs,
      widget,
      widgetVersion,
    };
  } catch (error) {
    await trx.rollback();
    console.error(error);
    throw new Error("Something went wrong while creating widget");
  }
};
