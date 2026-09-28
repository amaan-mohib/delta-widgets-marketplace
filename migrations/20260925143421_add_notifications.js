/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("notifications", (table) => {
    table.increments("id", { primaryKey: true });
    table.text("title").notNullable();
    table.text("message").notNullable();
    table.text("link");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("notifications");
};
