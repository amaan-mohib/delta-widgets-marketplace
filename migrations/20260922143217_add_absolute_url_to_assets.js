/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const prefix = process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX;
  await knex.schema.raw(`UPDATE assets SET src = '${prefix}' || src`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const prefix = process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX;
  await knex.schema.raw(
    `UPDATE assets SET src = REPLACE(src, '${prefix}', '') where src like '${prefix}%'`,
  );
};
