"use client";

import { readTextFile } from "@tauri-apps/plugin-fs";
import { IWidget } from "./types/manifest";
import { commands } from "./commands";
import { path } from "@tauri-apps/api";

export const cloneObject = <T>(obj: T) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanStorageSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export const getManifestFromPath = async (manifestPath: string) => {
  const manifest = await readTextFile(manifestPath);
  return JSON.parse(manifest) as Omit<IWidget, "path">;
};

export const createWidgetWindow = async (manifestPath: string) => {
  await commands.createWidgetWindow({
    path: JSON.stringify(manifestPath),
    isPreview: false,
  });
};

export const closeWidgetWindow = async (label: string) => {
  await commands.closeWidgetWindow({ label });
};

export const setTimeoutAsync = (timeout: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });

export const getUrlThumbnailPath = async (url: string) => {
  try {
    const urlObj = new URL(url);
    const fileName = Buffer.from(urlObj.hostname).toString("base64") + ".png";
    const thumbPath = await path.resolve(
      await path.appCacheDir(),
      "thumbs",
      fileName,
    );

    return thumbPath;
  } catch (error) {
    console.error("Error creating URL thumbnail:", error);
    return null;
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "IN_REVIEW":
      return "In Review";
    case "PUBLISHED":
      return "Published";
    case "REJECTED":
      return "Rejected";
    case "SUSPENDED":
      return "Suspended";
    default:
      return "";
  }
};
