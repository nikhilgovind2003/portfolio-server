const router = require("express").Router();
const CmsController = require("../controller/cms.js");
const createUploadMiddleware = require("../middlewares/multerMiddleware");
const {
  updateCmsRules,
  validateCms,
} = require("../validations/cmsValidator.js");

// Dynamic upload middleware
const { upload, replaceFile } = createUploadMiddleware("cms");

// Attach replaceFile to req for controller
router.use((req, res, next) => {
  req.replaceFile = replaceFile;
  next();
});

router.get("/", CmsController.index);

// Update CMS route
router.put(
  "/",
  updateCmsRules,
  validateCms,
  upload.single("media_path"),
  CmsController.update
);

module.exports = router;
