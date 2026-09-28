export const APP_NAME = "Delta Widgets";

export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "https://delta-widgets.vercel.app";

export const DEEP_LINK_BASE_URL =
  process.env.NEXT_PUBLIC_DEEP_LINK_BASE_URL || "deltawidgets://";

export const templateWidgets: Record<string, string> = {
  battery: "templates/battery/thumb.png",
  system: "templates/cpu/thumb.png",
  datetime: "templates/datetime/thumb.png",
  disk: "templates/disks/thumb.png",
  media: "templates/media/thumb.png",
  ram: "templates/ram/thumb.png",
  weather: "templates/weather/thumb.png",
  "visualizer-delta-default": "templates/visualizer/thumb.png",
  "media-viz-delta-default": "templates/media-viz/thumb.png",
  google: "",
  gpt: "",
};
