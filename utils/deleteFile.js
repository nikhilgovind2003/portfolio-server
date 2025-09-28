export async function deleteFile(relativePath) {
    try {
      if (!relativePath) return;

      const filePath = path.join(__dirname, "..", relativePath);

      // Check if file exists before deleting
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (err) {
        console.log(`File not found or already deleted: ${filePath}`);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }