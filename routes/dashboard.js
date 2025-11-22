const router = require("express").Router();
const DashboardController = require("../controller/dashboardController");

// Dashboard route
router.get("/", DashboardController.show);

module.exports = router;
