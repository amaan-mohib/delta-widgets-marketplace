/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("widget_version_categories", (table) => {
    table
      .integer("widget_version_id")
      .notNullable()
      .references("id")
      .inTable("widget_versions")
      .onDelete("cascade");
    table
      .integer("category_id")
      .notNullable()
      .references("id")
      .inTable("categories")
      .onDelete("cascade");
    table.primary(["widget_version_id", "category_id"]);
    table.index("category_id");
  });

  await knex.schema.alterTable("categories", (table) => {
    table.bigInteger("count").defaultTo(0);
    table.dropColumn("description");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("widget_version_categories");

  await knex.schema.alterTable("categories", (table) => {
    table.text("description");
    table.dropColumn("count");
  });
};
