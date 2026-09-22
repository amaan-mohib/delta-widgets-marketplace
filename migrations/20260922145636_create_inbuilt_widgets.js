const path = require("path");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const email = "deltawidgets@gmail.com";
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  let admin = await knex("neon_auth.user")
    .select("id")
    .where("email", email)
    .first();
  if (!admin) {
    const [user] = await knex("neon_auth.user")
      .insert({
        email,
        name: "Delta Widgets",
        emailVerified: true,
        role: "admin",
        banned: false,
        image: `${baseUrl}/icon.png`,
      })
      .returning("id");
    await knex("neon_auth.account").insert({
      accountId: knex.fn.uuid(),
      providerId: "credential",
      userId: user.id,
      updatedAt: knex.fn.now(),
    });
    await knex("user_profiles").insert({
      username: "deltawidgets",
      user_id: user.id,
    });
    admin = user;
  }

  const templates = [
    {
      key: "battery",
      dir: "battery",
      label: "Battery",
      details:
        "Keeps an eye on your battery with a charge-level progress bar plus health and charge-cycle readouts.",
    },
    {
      key: "system",
      dir: "cpu",
      label: "System",
      details:
        "A live CPU monitor showing the current usage percentage plus your processor's model, clock speed, and logical core count.",
    },
    {
      key: "datetime",
      dir: "datetime",
      label: "Date & Time",
      details:
        "Shows the current time in 12-hour format alongside the full weekday and date. The layout is driven by date-fns tokens, so you can reformat it into anything from a bare clock to a full calendar line.",
    },
    {
      key: "disk",
      label: "Disk",
      dir: "disks",
      details:
        "An overview of every drive's storage, showing used versus available space with a usage bar rendered per disk.",
    },
    {
      key: "media",
      label: "Media",
      dir: "media",
      details:
        "A now-playing panel with album artwork, track title and artist, a seek slider showing elapsed and total time, plus play, pause, and skip controls for whatever media is playing on your system.",
    },
    {
      key: "ram",
      label: "RAM",
      dir: "ram",
      details:
        "A compact memory gauge showing used versus total RAM with a live progress bar.",
    },
    {
      key: "weather",
      label: "Weather",
      dir: "weather",
      details:
        "Current conditions for your location — temperature in Celsius, your city and country, and a matching weather icon.",
    },
    {
      key: "visualizer-delta-default",
      label: "Visualizer",
      dir: "visualizer",
      categories: ["visualizer"],
      details:
        "A real-time bar visualizer that reacts to your system audio, with the current track's title and artist and a one-tap toggle to start or stop the capture.",
    },
    {
      key: "media-viz-delta-default",
      label: "Media Viz",
      dir: "media-viz",
      categories: ["media", "visualizer"],
      details:
        "A now-playing panel with album artwork, track title and artist, a seek slider showing elapsed and total time, plus play, pause, and skip controls for whatever media is playing on your system along with an audio visualizer.",
    },
    {
      key: "google",
      dir: "google",
      label: "Google",
      type: "URL",
      details: "Directly access Google from your desktop",
    },
    {
      key: "gpt",
      dir: "gpt",
      label: "ChatGPT",
      type: "URL",
      details: "Directly access ChatGPT from your desktop",
    },
  ];
  for (let template of templates) {
    const [widget] = await knex("widgets")
      .insert({
        author_id: admin.id,
        key: template.key,
        widget_type: template.type || "JSON",
        published_at: knex.fn.now(),
      })
      .returning("id");
    const [widget_version] = await knex("widget_versions")
      .insert({
        widget_id: widget.id,
        label: template.label,
        version: "v1",
        revision: 1,
        status: "PUBLISHED",
        description: template.details,
        published_at: knex.fn.now(),
      })
      .returning("id");
    await knex("widgets")
      .update({ latest_version_id: widget_version.id })
      .where("id", widget.id);
    const assets = await knex("assets")
      .insert([
        {
          src: `${baseUrl}/templates/${template.dir}/manifest.json`,
          file_name: "manifest.json",
          asset_type: "MANIFEST",
          content_type: "application/json",
        },
        {
          src: `${baseUrl}/templates/${template.dir}/thumb.png`,
          file_name: "thumb.png",
          asset_type: "SCREENSHOT",
          content_type: "image/png",
        },
        {
          src: `${baseUrl}/images/design-mode/ss-1.png`,
          file_name: "all_widgets.png",
          asset_type: "SCREENSHOT",
          size: 759000,
          content_type: "image/png",
        },
      ])
      .onConflict("src")
      .merge()
      .returning("id");
    await knex("widget_version_assets").insert(
      assets.map((asset, index) => ({
        asset_id: asset.id,
        widget_version_id: widget_version.id,
        sort_order: index === assets.length - 1 ? 1 : 0,
      })),
    );
    const categories = await knex("categories")
      .insert(
        [...(template.categories || [template.key]), "preinstalled"].map(
          (cat) => ({
            name: cat,
            slug: cat,
            count: 1,
          }),
        ),
      )
      .onConflict("slug")
      .merge({ count: knex.raw("categories.count + 1") })
      .returning("id");
    await knex("widget_version_categories").insert(
      categories.map((cat) => ({
        category_id: cat.id,
        widget_version_id: widget_version.id,
      })),
    );
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return Promise.resolve();
};
