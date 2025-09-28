const router = require("express").Router();
const MessageController = require("../controller/contactController.js");

const { createMessageValidation } = require("../validations/contactValidator.js");

router.get("/", MessageController.index);

// Update CMS route
router.post(
  "/",
  createMessageValidation,
  MessageController.create
);

module.exports = router;
