const { onUpdateTrigger } = require("../knexfile");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("upload_jobs", (table) => {
    table.increments("id", { primaryKey: true });
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("neon_auth.user")
      .onDelete("cascade");
    table
      .integer("widget_version_id")
      .notNullable()
      .references("id")
      .inTable("widget_versions")
      .onDelete("cascade");
    table.string("status").notNullable().defaultTo("PENDING");
    table.timestamps(true, true);
  });

  await knex.raw(onUpdateTrigger("upload_jobs"));

  await knex.schema.createTable("upload_job_files", (table) => {
    table.increments("id", { primaryKey: true });
    table
      .integer("job_id")
      .notNullable()
      .references("id")
      .inTable("upload_jobs")
      .onDelete("cascade");
    table.string("status").notNullable().defaultTo("PENDING");
    table.string("object_key").notNullable();
    table.string("file_name").notNullable();
    table.string("options");
    table.timestamps(true, true);
  });

  await knex.raw(onUpdateTrigger("upload_job_files"));

  await knex.schema.alterTable("widget_versions", (table) => {
    table.integer("revision").defaultTo(1);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("upload_job_files");
  await knex.schema.dropTable("upload_jobs");
  await knex.schema.alterTable("widget_versions", (table) => {
    table.dropColumn("revision");
  });
};
