const path= require("path")
const fs = require("fs")

export async function deleteFile(filePath) {
    if (!filePath) return false;
    try {
      const absolutePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        filePath.replace("/uploads/", "")
      );

      await fs.unlink(absolutePath);

      console.info(`Deleted file: ${absolutePath}`);
      return true; // ✅ success
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(`Failed to delete file ${filePath}: ${error.message}`);
      }
      return false; // ✅ failed but handled
    }
  }