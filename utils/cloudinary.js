const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const logger = require('../config/logger');

/**
 * Uploads a file to cloudinary
 * @param {string} filePath - Local path to the file
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto'
        });

        // Optionally delete local file after upload
        try {
            await fs.unlink(filePath);
            logger.info(`Deleted local file after Cloudinary upload: ${filePath}`);
        } catch (unlinkError) {
            logger.error(`Failed to delete local file ${filePath}: ${unlinkError.message}`);
        }

        return result;
    } catch (error) {
        logger.error(`Cloudinary upload failed: ${error.message}`);
        throw error;
    }
};

/**
 * Deletes a file from cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`);
        return result;
    } catch (error) {
        logger.error(`Cloudinary deletion failed: ${error.message}`);
        throw error;
    }
};

/**
 * Extracts public ID from a Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        // Example: https://res.cloudinary.com/dwrptzvbd/image/upload/v1712345678/portfolio/abc.png
        // Public ID would be "portfolio/abc"
        const parts = url.split('/');
        const fileName = parts.pop(); // "abc.png"
        const folder = parts.pop(); // "portfolio"
        const publicId = fileName.split('.')[0]; // "abc"
        return `${folder}/${publicId}`;
    } catch (error) {
        return null;
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    getPublicIdFromUrl
};
