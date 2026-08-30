import { IGetAllWidget } from "@/lib/commands";
import { create } from "zustand";

interface IUploadState {
  uploading: boolean;
  uploaded: boolean;
}

interface IDataStore {
  isInApp: boolean;
  selectedWidgets: IGetAllWidget[];
  uploadStep: "select" | "form" | null;
  selectedWidgetKey: string | null;
  widgetUploadState: Record<string, IUploadState>;
  setWidgetUploadState: (key: string, state: IUploadState) => void;
}

export const useDataStore = create<IDataStore>((set, get) => ({
  isInApp: false,
  selectedWidgets: [],
  uploadStep: null,
  selectedWidgetKey: null,
  widgetUploadState: {},
  setWidgetUploadState(key, state) {
    const prev = get().widgetUploadState;
    prev[key] = state;
    set(prev);
  },
}));
