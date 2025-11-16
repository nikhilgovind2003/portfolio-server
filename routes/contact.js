const router = require("express").Router();
const MessageController = require("../controller/contactController.js");
const auth = require("../middlewares/authMiddleware.js");

const { createMessageValidation } = require("../validations/contactValidator.js");


// router.use(auth)
router.get("/", MessageController.index);

// Update CMS route
router.post(
  "/",
  createMessageValidation,
  MessageController.create
);

module.exports = router;
