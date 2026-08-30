const path = require("path");
require("dotenv").config();
const fs = require("fs").promises;

async function copyFile() {
  try {
    const src = process.env.COMMANDS_FILE_PATH;
    const dest = path.resolve(__dirname, "..", "src/lib/commands.ts");
    await fs.copyFile(src, dest);
    console.log("File copied successfully!");
  } catch (error) {
    console.error("Error copying file:", error);
  }
}

copyFile();
