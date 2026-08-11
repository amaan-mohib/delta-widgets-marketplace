/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("waitlists", (table) => {
    table.text("email").primary();
  });

  const emails = process.env.WAITLIST_EMAILS;
  const emailList = (emails || "").split(",").map((i) => i.trim());

  if (emailList.length > 0) {
    await knex("waitlists").insert(emailList.map((email) => ({ email })));
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("waitlists");
};
