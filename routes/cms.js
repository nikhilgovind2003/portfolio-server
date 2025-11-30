const router = require("express").Router();
const CmsController = require("../controller/cms.js");
const auth = require("../middlewares/authMiddleware.js")
const {
  updateCmsRules,
  validateCms,
} = require("../validations/cmsValidator.js");

const { uploadFields } = require("../middlewares/multerMiddleware.js");


const uploads =   uploadFields("cms", [
    { name: "media_path", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);


  
router.get("/", CmsController.index);

// Update CMS route
router.put(
  "/:id",
  updateCmsRules,
  validateCms,
  uploads,
  CmsController.update
);

module.exports = router;

