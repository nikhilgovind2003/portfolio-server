require('dotenv').config();


console.log("DATABASE_URL from env:", process.env.MONGODB_URI);

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  db: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio',
  },
};

module.exports = config;