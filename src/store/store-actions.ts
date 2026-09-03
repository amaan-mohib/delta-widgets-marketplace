"use client";

import { getExistingVersions } from "@/app/dashboard/upload/actions";
import { IFormError } from "@/app/dashboard/upload/components/form/utils";
import { IGetAllWidget } from "@/lib/commands";
import { WidgetVersions } from "@/lib/db";
import { IUploadManifest, IWidget } from "@/lib/types/manifest";
import { getManifestFromPath } from "@/lib/utils";
import { exists, lstat } from "@tauri-apps/plugin-fs";

export interface IUploadState {
  state: "DRAFT" | "UPLOADING" | "UPLOADED" | "WARNING";
  values: IUploadManifest;
  manifest: IWidget;
  versions: WidgetVersions[];
  errors?: IFormError[];
}

export const getWidgetScreenshots = async (widget: IGetAllWidget) => {
  const thumbExists = await exists(widget.thumbPath);
  const screenshots: IUploadManifest["screenshots"] = [];
  if (thumbExists) {
    const info = await lstat(widget.thumbPath);
    screenshots.push({
      fileName: "thumb.png",
      path: widget.thumbPath,
      fileSize: info.size,
    });
  }
  return screenshots;
};

export const initializeWidget = async (widget: IGetAllWidget) => {
  const [manifest, versions, screenshots] = await Promise.all([
    getManifestFromPath(widget.manifestPath),
    getExistingVersions(widget.manifest.key),
    getWidgetScreenshots(widget),
  ]);
  const widgetType = widget.manifest.widgetType;
  const values: IUploadManifest = {
    key: widget.manifest.key,
    label: widget.manifest.label,
    widget_type:
      widgetType === "html" ? "HTML" : widgetType === "json" ? "JSON" : "URL",
    description: widget.manifest.description,
    screenshots,
    changelog: versions.length > 0 ? "" : undefined,
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
