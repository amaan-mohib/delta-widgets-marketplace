/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("widgets", (table) => {
    table
      .integer("latest_version_id")
      .references("id")
      .inTable("widget_versions")
      .onDelete("SET NULL")
      .index();
  });
  await knex.raw(
    `UPDATE widgets w set latest_version_id = (SELECT wv.id FROM widget_versions wv WHERE wv.widget_id = w.id AND status = 'PUBLISHED' ORDER BY wv.created_at DESC limit 1)`,
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("widgets", (table) => {
    table.dropColumn("latest_version_id");
  });
};
