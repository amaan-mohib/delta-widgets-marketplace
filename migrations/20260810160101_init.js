const { onUpdateTrigger } = require("../knexfile");

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;
const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);

  await knex.schema.createTable("user_profiles", (table) => {
    table.increments("id", { primaryKey: true });
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("neon_auth.user")
      .onDelete("cascade");
    table
      .string("username", 30)
      .unique()
      .checkRegex("^[a-z0-9_]{3,30}$")
      .notNullable();
    table.timestamps(true, true);

    table.index("user_id");
  });

  await knex.raw(onUpdateTrigger("user_profiles"));

  await knex.schema.createTable("widgets", (table) => {
    table.increments("id", { primaryKey: true });
    table
      .uuid("author_id")
      .notNullable()
      .references("id")
      .inTable("neon_auth.user")
      .onDelete("cascade");
    table.text("key").unique().notNullable();
    table.text("label").notNullable();
    table.text("description");
    table.string("widget_type").checkIn(["JSON", "HTML", "URL"]).notNullable();
    table.bigInteger("download_count").defaultTo(0);
    table.timestamps(true, true);
    table.timestamp("published_at");

    table.index("author_id");
  });

  await knex.raw(onUpdateTrigger("widgets"));

  await knex.schema.createTable("widget_versions", (table) => {
    table.increments("id", { primaryKey: true });
    table
      .integer("widget_id")
      .notNullable()
      .references("id")
      .inTable("widgets")
      .onDelete("cascade");
    table.text("version").notNullable();
    table.text("changelog");
    table
      .string("status")
      .checkIn(["DRAFT", "IN_REVIEW", "PUBLISHED", "REJECTED", "SUSPENDED"])
      .notNullable()
      .defaultTo("DRAFT");
    table.timestamps(true, true);
    table.timestamp("published_at");

    table.index("widget_id");
    knex.raw(`CREATE INDEX widget_versions_latest_published_idx
      ON widget_versions (widget_id, published_at DESC)
      WHERE status = 'PUBLISHED';`);
  });

  await knex.raw(onUpdateTrigger("widget_versions"));

  await knex.schema.createTable("assets", (table) => {
    table.increments("id", { primaryKey: true });
    table.text("src").unique().notNullable();
    table.text("file_name").notNullable();
    table.float("size");
    table.text("content_type");
    table.string("asset_type", 100);
    table.timestamps(true, true);
  });

  await knex.raw(onUpdateTrigger("assets"));

  await knex.schema.createTable("widget_assets", (table) => {
    table
      .integer("widget_id")
      .notNullable()
      .references("id")
      .inTable("widgets")
      .onDelete("cascade");
    table
      .integer("asset_id")
      .notNullable()
      .references("id")
      .inTable("assets")
      .onDelete("cascade");
    table.primary(["widget_id", "asset_id"]);
    table.index("asset_id");
  });

  await knex.schema.createTable("widget_version_assets", (table) => {
    table
      .integer("widget_version_id")
      .notNullable()
      .references("id")
      .inTable("widget_versions")
      .onDelete("cascade");
    table
      .integer("asset_id")
      .notNullable()
      .references("id")
      .inTable("assets")
      .onDelete("cascade");
    table.primary(["widget_version_id", "asset_id"]);
    table.index("asset_id");
  });

  await knex.schema.createTable("categories", (table) => {
    table.increments("id", { primaryKey: true });
    table.text("slug").unique().notNullable();
    table.text("name").notNullable();
    table.text("description");
    table.timestamps(true, true);
  });

  await knex.raw(onUpdateTrigger("categories"));

  await knex.schema.createTable("widget_categories", (table) => {
    table
      .integer("widget_id")
      .notNullable()
      .references("id")
      .inTable("widgets")
      .onDelete("cascade");
    table
      .integer("category_id")
      .notNullable()
      .references("id")
      .inTable("categories")
      .onDelete("cascade");
    table.primary(["widget_id", "category_id"]);
    table.index("category_id");
  });

  await knex.schema.createTable("widget_likes", (table) => {
    table
      .integer("widget_id")
      .notNullable()
      .references("id")
      .inTable("widgets")
      .onDelete("cascade");
    table
      .uuid("user_id")
      .nullable()
      .references("id")
      .inTable("neon_auth.user")
      .onDelete("cascade");
    table.text("anon_user_id").nullable();
    table.unique(["widget_id", "anon_user_id"]);
    table.unique(["widget_id", "user_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("widget_likes");
  await knex.schema.dropTable("widget_categories");
  await knex.schema.dropTable("categories");
  await knex.schema.dropTable("widget_version_assets");
  await knex.schema.dropTable("widget_assets");
  await knex.schema.dropTable("assets");
  await knex.schema.dropTable("widget_versions");
  await knex.schema.dropTable("widgets");
  await knex.schema.dropTable("user_profiles");

  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
};
