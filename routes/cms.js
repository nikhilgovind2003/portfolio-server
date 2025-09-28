const router = require("express").Router();
const CmsController = require("../controller/cms.js");
const {
  updateCmsRules,
  validateCms,
} = require("../validations/cmsValidator.js");

const uploadImage = require("../middlewares/multerMiddleware.js");

router.get("/", CmsController.index);

// Update CMS route
router.put(
  "/",
  updateCmsRules,
  validateCms,
  uploadImage("cms", "media_path"),
  CmsController.update
);

module.exports = router;
