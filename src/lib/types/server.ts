import { Widgets, WidgetVersions } from "../db";

export type WidgetType = Pick<
  Widgets,
  "id" | "key" | "download_count" | "widget_type" | "published_at" | "likes"
> &
  Pick<WidgetVersions, "version" | "status" | "label"> & {
    screenshot_src: string;
    version_id: number;
  };

export type WidgetWithCreator = WidgetType & { creator: string };
