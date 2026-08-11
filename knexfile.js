require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("No DB URL found!");
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: "knex_migrations",
  },
  onUpdateTrigger: (table) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `,
};

module.exports = config;
