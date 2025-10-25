const express = require('express');
const cors = require('cors');
const config = require('./config');
const { sequelize, User } = require('./models');
const { verifyDatabaseConnection } = require('./db');
const routes = require('./routes/index.js');
const logger = require('./config/logger.js');
const handleError = require('./middlewares/handleErrorMiddleware.js');
const morgan = require("morgan")
const app = express();


// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your production domain
    : ['http://localhost:3000', 'http://localhost:5173'], // Development origins
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(morgan("dev"))
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware (must be last)
app.use(handleError);




async function bootstrap() {
  try {
    await verifyDatabaseConnection();
    await sequelize.sync({ alter: true });
    logger.info("server synced");
    const port = config.port;
    app.listen(port, () => {
      logger.info(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

