const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Get folder name from router filename
function getFolderName(routerFileName) {
  return path.basename(routerFileName, path.extname(routerFileName));
}

// Multer storage configuration
const storage = (routerFileName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = getFolderName(routerFileName);
      const uploadPath = path.join(__dirname, "..", "uploads", folderName);

      // Create folder if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Save file as timestamp-originalname
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

// Middleware factory function
const uploadImage = (routerFileName, fieldName, maxCount = 1) => {
  const multerInstance = multer({
    storage: storage(routerFileName),
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) cb(null, true);
      else cb(new Error("Only images are allowed"));
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  });

  // Wrap middleware to add relativePath to req.file or req.files
  if (maxCount === 1) {
    return (req, res, next) => {
      multerInstance.single(fieldName)(req, res, (err) => {
        if (err) return next(err);

        // Add relativePath property
        if (req.file) {
          req.file.path = req.file.path
            .replace(path.join(__dirname, ".."), "")
            .replace(/\\/g, "/");
        }
        next();
      });
    };
  } else {
    return (req, res, next) => {
      multerInstance.array(fieldName, maxCount)(req, res, (err) => {
        if (err) return next(err);

        // Add relativePath for each file
        if (req.files && req.files.length > 0) {
          req.files = req.files.map((file) => ({
            ...file,
            relativePath: file.path
              .replace(path.join(__dirname, ".."), "")
              .replace(/\\/g, "/"),
          }));
        }
        next();
      });
    };
  }
};

module.exports = uploadImage;
