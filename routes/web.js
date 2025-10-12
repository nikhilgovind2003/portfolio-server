const router = require("express").Router();
const webController = require("../controller/webController.js");

router.get("/", webController.index);

module.exports = router;
