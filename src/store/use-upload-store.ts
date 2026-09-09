"use client";

import { IGetAllWidget } from "@/lib/commands";
import { IUploadManifest } from "@/lib/types/manifest";
import { cloneObject } from "@/lib/utils";
import { create } from "zustand";
import { initializeWidget, IUploadState } from "./store-actions";
import { IFormError } from "@/app/dashboard/upload/components/form/utils";

interface IUploadStore {
  selectedWidgets: IGetAllWidget[];
  uploadStep: "select" | "form" | null;
  selectedWidget: IGetAllWidget | null;
  widgetUploads: Record<string, IUploadState>;
  availableTags: string[];
  initializeWidgetUpload: (widgets: IGetAllWidget[]) => Promise<void>;
  setWidgetUploadState: (key: string, state: IUploadState["state"]) => void;
  setWidgetUploadValues: (
    key: string,
    values: Partial<IUploadManifest>,
  ) => void;
  setWidgetUploadErrors: (key: string, errors: IFormError[]) => void;
}

export const useUploadStore = create<IUploadStore>((set, get) => ({
  selectedWidgets: [],
  uploadStep: null,
  selectedWidget: null,
  widgetUploads: {},
  availableTags: [],
  async initializeWidgetUpload(widgets) {
    const uploads = get().widgetUploads;
    let hasChange = false;
    for (const widget of widgets) {
      if (uploads[widget.manifest.key]) {
        continue;
      }
      hasChange = true;
      const uploadValue = await initializeWidget(widget);
      uploads[widget.manifest.key] = uploadValue;
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
  setWidgetUploadErrors(key, errors) {
    const prev = get().widgetUploads;
    if (!prev[key]) {
      throw new Error("Widget not defined: " + key);
    }
    if (errors.length !== 0) {
      prev[key].state = "WARNING";
    }
    prev[key].errors = errors;
    set({ widgetUploads: cloneObject(prev) });
  },
}));
