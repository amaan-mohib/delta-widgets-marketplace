"use client";

import { getExistingVersions } from "@/app/dashboard/upload/actions";
import { IFormError } from "@/app/dashboard/upload/components/form/utils";
import { IGetAllWidget } from "@/lib/commands";
import { WidgetVersions } from "@/lib/db";
import { IUploadManifest, IWidget } from "@/lib/types/manifest";
import { getManifestFromPath, getUrlThumbnailPath } from "@/lib/utils";
import { exists, lstat } from "@tauri-apps/plugin-fs";

export interface IUploadState {
  state: "DRAFT" | "UPLOADING" | "UPLOADED" | "WARNING";
  values: IUploadManifest;
  manifest: IWidget;
  versions: Pick<
    WidgetVersions,
    "id" | "revision" | "version" | "published_at"
  >[];
  errors?: IFormError[];
}

const getUrlThumbnail = async (url: string) => {
  const thumbPath = await getUrlThumbnailPath(url);
  if (!thumbPath) return [];

  const thumbExists = await exists(thumbPath);
  const screenshots: IUploadManifest["screenshots"] = [];
  if (thumbExists) {
    const info = await lstat(thumbPath);
    screenshots.push({
      fileName: "icon.png",
      path: thumbPath,
      fileSize: info.size,
    });
  }
  return screenshots;
};

export const getWidgetScreenshots = async (
  widget: IGetAllWidget,
  fromCapture?: boolean,
  customFileName?: string,
) => {
  if (
    widget.manifest.widgetType === "url" &&
    widget.manifest.url &&
    !fromCapture
  ) {
    return await getUrlThumbnail(widget.manifest.url);
  }
  const thumbExists = await exists(widget.thumbPath);
  const screenshots: IUploadManifest["screenshots"] = [];
  if (thumbExists) {
    const info = await lstat(widget.thumbPath);
    screenshots.push({
      fileName: customFileName || "thumb.png",
      path: widget.thumbPath,
      fileSize: info.size,
    });
  }
  return screenshots;
};

export const initializeWidget = async (widget: IGetAllWidget) => {
  const [
    manifest,
    { versions = [], screenshots: existingScreenshots = [], tags = [] },
    screenshots,
  ] = await Promise.all([
    getManifestFromPath(widget.manifestPath),
    getExistingVersions(widget.manifest.key),
    getWidgetScreenshots(widget),
  ]);
  const widgetType = widget.manifest.widgetType;
  const existing = versions[0];
  const values: IUploadManifest = {
    key: widget.manifest.key,
    label: existing?.label || widget.manifest.label,
    widget_type:
      widgetType === "html" ? "HTML" : widgetType === "json" ? "JSON" : "URL",
    description: existing?.description || widget.manifest.description,
    screenshots: [
      ...screenshots,
      ...existingScreenshots.map((ss) => ({
        fileName: ss.file_name,
        path: `${process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX}${ss.src}`,
        fileSize: ss.size ?? 0,
        assetId: ss.id,
      })),
    ],
    changelog: versions.length > 0 ? "" : undefined,
    tags: tags.length > 0 ? tags.map((t) => t.slug) : [],
  };
  const response: IUploadState = {
    state: "DRAFT",
    values,
    versions,
    manifest: {
      ...manifest,
      path: widget.manifestPath,
    },
  };
  return response;
};
