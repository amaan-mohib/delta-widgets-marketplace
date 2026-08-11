const templates = [
  {
    key: "datetime",
    label: "Date & Time",
    creator: "deltawidgets",
    views: 1213,
    downloads: 1000,
    thumbnail: "/templates/datetime/thumb.png",
  },
  {
    key: "media",
    label: "Date & Time",
    creator: "deltawidgets",
    views: 1213,
    downloads: 1000,
    thumbnail: "/templates/media/thumb.png",
  },
  {
    key: "media-viz",
    label: "Date & Time",
    creator: "deltawidgets",
    views: 1213,
    downloads: 1000,
    thumbnail: "/templates/media-viz/thumb.png",
  },
  {
    key: "weather",
    label: "Date & Time",
    creator: "deltawidgets",
    views: "1.2k",
    downloads: "10k",
    thumbnail: "/templates/weather/thumb.png",
  },
  {
    key: "visualizer",
    label: "Date & Time",
    creator: "deltawidgets",
    views: 1213,
    downloads: 100000000,
    thumbnail: "/templates/visualizer/thumb.png",
  },
];

export async function test() {
  return new Promise<typeof templates>((r) =>
    setTimeout(() => {
      return r(templates);
    }, 1000),
  );
}
