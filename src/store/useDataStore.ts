import { IGetAllWidget } from "@/lib/commands";
import { IUploadManifest } from "@/lib/types/manifest";
import { cloneObject } from "@/lib/utils";
import { exists, lstat } from "@tauri-apps/plugin-fs";
import { create } from "zustand";

interface IUploadState {
  state: "DRAFT" | "UPLOADING" | "UPLOADED";
  values: IUploadManifest;
}

interface IDataStore {
  isInApp: boolean;
  selectedWidgets: IGetAllWidget[];
  uploadStep: "select" | "form" | null;
  selectedWidgetKey: string | null;
  widgetUploads: Record<string, IUploadState>;
  initializeWidgetUpload: (widgets: IGetAllWidget[]) => Promise<void>;
  setWidgetUploadState: (key: string, state: IUploadState["state"]) => void;
  setWidgetUploadValues: (
    key: string,
    values: Partial<IUploadManifest>,
  ) => void;
}

export const useDataStore = create<IDataStore>((set, get) => ({
  isInApp: false,
  selectedWidgets: [],
  uploadStep: null,
  selectedWidgetKey: null,
  widgetUploads: {},
  async initializeWidgetUpload(widgets) {
    const uploads = get().widgetUploads;
    let hasChange = false;
    for (const widget of widgets) {
      if (uploads[widget.manifest.key]) {
        continue;
      }
      hasChange = true;
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
      const widgetType = widget.manifest.widgetType;
      const values: IUploadManifest = {
        key: widget.manifest.key,
        label: widget.manifest.label,
        widget_type:
          widgetType === "html"
            ? "HTML"
            : widgetType === "json"
              ? "JSON"
              : "URL",
        description: widget.manifest.description,
        screenshots,
      };
      uploads[widget.manifest.key] = {
        state: "DRAFT",
        values,
      };
    }
    if (hasChange) {
      set({
        widgetUploads: cloneObject(uploads),
      });
    }
  },
  setWidgetUploadState(key, state) {
    const prev = get().widgetUploads;
    if (!prev[key]) {
      throw new Error("Widget not defined: " + key);
    }
    prev[key].state = state;
    set({ widgetUploads: cloneObject(prev) });
  },
  setWidgetUploadValues(key, values) {
    const prev = get().widgetUploads;
    if (!prev[key]) {
      throw new Error("Widget not defined: " + key);
    }
    prev[key].values = {
      ...prev[key].values,
      ...values,
    };
    set({ widgetUploads: cloneObject(prev) });
  },
}));
