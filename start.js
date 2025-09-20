#!/usr/bin/env node

/**
 * Development startup script
 * This script helps set up the development environment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Portfolio Server Setup');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  console.log('📝 Creating .env.example file...');
  
  const envExample = `# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASS=postgres
DB_SSL=false

# Alternative: Use DATABASE_URL for production
# DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db`;

  fs.writeFileSync(path.join(__dirname, '.env.example'), envExample);
  console.log('✅ .env.example created');
  console.log('📋 Please copy .env.example to .env and update with your database credentials\n');
} else {
  console.log('✅ .env file found');
}

// Check if uploads directory exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ uploads directory created');
} else {
  console.log('✅ uploads directory exists');
}

// Check if logs directory exists
const logsPath = path.join(__dirname, 'logs');
if (!fs.existsSync(logsPath)) {
  console.log('📁 Creating logs directory...');
  fs.mkdirSync(logsPath, { recursive: true });
  console.log('✅ logs directory created');
} else {
  console.log('✅ logs directory exists');
}

console.log('\n🎯 Next steps:');
console.log('1. Make sure PostgreSQL is running');
console.log('2. Create a database named "portfolio_db"');
console.log('3. Update your .env file with correct database credentials');
console.log('4. Run: npm run dev');
console.log('\n📚 API Documentation: http://localhost:4000/health');
console.log('🔗 API Base URL: http://localhost:4000/api');
