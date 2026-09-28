/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("widget_versions", (table) => {
    table.text("label").notNullable().defaultTo("");
    table.text("description");
  });

  await knex("widget_versions")
    .update({
      label: knex.ref("widgets.label"),
      description: knex.ref("widgets.description"),
    })
    .updateFrom("widgets")
    .where("widget_versions.widget_id", knex.ref("widgets.id"));

  await knex.schema.alterTable("widgets", (table) => {
    table.dropColumn("label");
    table.dropColumn("description");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("widgets", (table) => {
    table.text("label").notNullable().defaultTo("");
    table.text("description");
  });

  await knex("widgets")
    .update({
      label: knex.ref("widget_versions.label"),
      description: knex.ref("widget_versions.description"),
    })
    .updateFrom("widget_versions")
    .where("widgets.id", knex.ref("widget_versions.widget_id"));

  await knex.schema.alterTable("widget_versions", (table) => {
    table.dropColumn("label");
    table.dropColumn("description");
  });
};
