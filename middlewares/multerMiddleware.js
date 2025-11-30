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

// File filter for different types
const fileFilter = (req, file, cb) => {
  // Image types
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  // Document types (resume)
  const documentTypes = /pdf|doc|docx/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  
  // Check if it's an image field
  if (file.fieldname === "media_path") {
    const isValidImage = imageTypes.test(extname.replace('.', ''));
    const isValidMimetype = /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype);
    
    if (isValidImage && isValidMimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG, GIF, WEBP) are allowed for media_path"));
    }
  }
  // Check if it's a resume field
  else if (file.fieldname === "resume") {
    const isValidDoc = documentTypes.test(extname.replace('.', ''));
    const isValidMimetype = /application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/.test(file.mimetype);
    
    if (isValidDoc && isValidMimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed for resume"));
    }
  }
  else {
    cb(new Error("Invalid field name"));
  }
};

// Middleware factory function for multiple fields
const uploadFields = (routerFileName, fields) => {
  const multerInstance = multer({
    storage: storage(routerFileName),
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  });

  return (req, res, next) => {
    multerInstance.fields(fields)(req, res, (err) => {
      if (err) return next(err);

      // Add relativePath for all uploaded files
      if (req.files) {
        Object.keys(req.files).forEach((fieldName) => {
          req.files[fieldName] = req.files[fieldName].map((file) => ({
            ...file,
            relativePath: file.path
              .replace(path.join(__dirname, ".."), "")
              .replace(/\\/g, "/"),
          }));
        });
      }
      next();
    });
  };
};

// Keep the original uploadImage for backward compatibility
const uploadImage = (routerFileName, fieldName, maxCount = 1) => {
  const multerInstance = multer({
    storage: storage(routerFileName),
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) cb(null, true);
      else cb(new Error("Only images are allowed"));
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  });

  if (maxCount === 1) {
    return (req, res, next) => {
      multerInstance.single(fieldName)(req, res, (err) => {
        if (err) return next(err);

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

module.exports = { uploadImage, uploadFields };