/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("widget_version_assets", (table) => {
    table.integer("sort_order").notNullable().defaultTo(0);
  });
  await knex.schema.alterTable("upload_job_files", (table) => {
    table.integer("sort_order").notNullable().defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("widget_version_assets", (table) => {
    table.dropColumn("sort_order");
  });
  await knex.schema.alterTable("upload_job_files", (table) => {
    table.dropColumn("sort_order");
  });
};
