/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.dropTable("widget_categories");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
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
};
