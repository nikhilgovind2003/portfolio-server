const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createUploadMiddleware(routerFileName) {
  const folderName = path.basename(routerFileName, ".js"); // e.g., cms

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads", folderName);
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
      req.savedFilePath = path.join(folderName, fileName); // relative path for DB
      cb(null, fileName);
    },
  });

  const upload = multer({ storage });

  function replaceFile(oldFilePath, req) {
    try {
      if (oldFilePath) {
        const fullOldPath = path.join(__dirname, "../uploads", oldFilePath);
        if (fs.existsSync(fullOldPath)) fs.unlinkSync(fullOldPath);
      }
      if (req.file) return req.savedFilePath;
      return oldFilePath;
    } catch (err) {
      console.error("Error replacing file:", err.message);
      return oldFilePath;
    }
  }

  return { upload, replaceFile };
}

module.exports = createUploadMiddleware;
