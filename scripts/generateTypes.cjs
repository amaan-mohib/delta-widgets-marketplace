const { knex } = require("knex");
const { updateTypes } = require("knex-types");
const path = require("path");
require("dotenv").config();

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
});
const file = path.resolve(__dirname, "..", "src/lib/db/types.ts");
updateTypes(db, { output: file, schema: ["public", "neon_auth"] }).catch(
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
