const express = require('express');
const cors = require('cors');
const config = require('./config');
const { sequelize, User } = require('./models');
const { verifyDatabaseConnection } = require('./db');
const routes = require('./routes/index.js');
const logger = require('./config/logger.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});


app.get('/', (req, res) => {
  res.send('Welcome to the API');
     logger.info({
      message: `${req.method} ${req.originalUrl}`,
      statusCode: res.statusCode
    });
}
);

// app.use(errorMiddleware);

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

