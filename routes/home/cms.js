const express = require("express");
const router = express.Router();
const CmsController = require("../../controller/cms");


router.get("/", CmsController.index);
router.get("/:id", CmsController.show);
router.post("/", CmsController.create);
router.put("/:id", CmsController.update);
router.delete("/:id", CmsController.delete);

module.exports = router;
const fs = require("fs");
const path = require("path");

function loadRoutes(dirPath) {
  const router = express.Router({ mergeParams: true });

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Load subfolder
      const subRouter = loadRoutes(fullPath);
      router.use(`/${file.toLowerCase()}`, subRouter);
    } else if (file !== "index.js" && file.endsWith(".js")) {
      const routeName = path.basename(file, ".js").toLowerCase();
      const routeModule = require(fullPath);
      const routeHandler = routeModule.default || routeModule;

      // ✅ check type before mounting
      if (typeof routeHandler === "function" || routeHandler instanceof express.Router) {
        router.use(`/${routeName}`, routeHandler);
        console.log(`✅ Mounted /${routeName}`);
      } else {
        console.warn(`⚠️ Skipped ${file} → not a router`);
      }
    }
  });

  return router;
}

module.exports = loadRoutes(__dirname);    

