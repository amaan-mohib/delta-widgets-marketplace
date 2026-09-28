const { onUpdateTrigger } = require("../knexfile");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("widget_audits", (table) => {
    table.increments("id", { primaryKey: true });
    table
      .integer("widget_version_id")
      .notNullable()
      .references("id")
      .inTable("widget_versions")
      .onDelete("cascade");
    table
      .uuid("auditor_id")
      .references("id")
      .inTable("neon_auth.user")
      .onDelete("cascade");
    table.string("action").notNullable().defaultTo("SUBMITTED");
    table.text("notes");
    table.timestamps(true, true);

    table.index("widget_version_id");
  });

  await knex.raw(onUpdateTrigger("widget_audits"));

  await knex.raw(
    `insert into widget_audits (widget_version_id) select id as widget_version_id from widget_versions where status = 'IN_REVIEW'`,
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("widget_audits");
};
