const express = require("express");
const cors = require("cors");
const config = require("./config");
const { connectDB } = require("./db");
const routes = require("./routes/index.js");
const logger = require("./config/logger.js");
const handleError = require("./middlewares/handleErrorMiddleware.js");
const morgan = require("morgan");
const seedCmsData = require("./seeder/cms.js");
const app = express();

// CORS configuration
const corsOptions = {
  origin:
       ["https://nikhil-govind-portfolio-admin.netlify.app", "http://localhost:3000", "http://localhost:8080", "https://portfolio-frontend-5szd.vercel.app/"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use("/api", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware (must be last)
app.use(handleError);

async function bootstrap() {
  try {
    await connectDB();
    await seedCmsData();
    
    logger.info("server synced");
    const port = config.port;

    app.listen(port ? port : 4000, () => {
      logger.info(`Server listening on port ${port ? port : 4000}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

bootstrap();
