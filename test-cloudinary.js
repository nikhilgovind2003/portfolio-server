require('dotenv').config();
const cloudinary = require('./config/cloudinary');

async function testConnection() {
    try {
        console.log("Testing Cloudinary connection...");
        const result = await cloudinary.api.ping();
        console.log("Cloudinary Connection Result:", result);

        if (result.status === 'ok') {
            console.log("✅ Cloudinary is configured correctly!");
        } else {
            console.log("❌ Cloudinary ping failed.");
        }
    } catch (error) {
        console.error("❌ Cloudinary configuration error:", error.message);
        process.exit(1);
    }
}

testConnection();
