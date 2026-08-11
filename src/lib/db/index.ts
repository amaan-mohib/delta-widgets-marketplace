if (!process.env.DATABASE_URL) {
  throw new Error("No DB URL found!");
}

import { knex } from "knex";
export * from "./types";
export * from "./models";

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: "knex_migrations",
  },
});

// Ensure that the database connections will be closed when
// the Node.js process is being shut down.
process.once("SIGTERM", function () {
  db.destroy();
});

export default db;
