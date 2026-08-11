import { Table } from "../src/lib/db/types";
import path from "path";
import fs from "fs";

const entries = Object.keys(Table);
const f = `import db from ".";
import {
\tTable,
\t${entries.map((t) => t).join(`,\n\t`)}
} from "./types";

const models = {
\t${entries
  .map(
    (t) =>
      `${t}: (alias?: string) => db<${t}>(alias ? { [alias]: Table.${t} } : Table.${t})`,
  )
  .join(`,\n\t`)}
}

export default models;
`;

fs.writeFile(
  path.resolve(__dirname, "..", "src/lib/db", "models.ts"),
  f,
  (err) => {
    if (err) console.log(err);
    else console.log(`${entries.length} models generated`);
  },
);
