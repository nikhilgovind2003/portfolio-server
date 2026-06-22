const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const logger = require('../config/logger');

const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
    try {
        // detect if file is a PDF
        const isPDF = filePath.toLowerCase().endsWith('.pdf');

        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: isPDF ? 'raw' : 'auto',  // raw for PDF, auto for others
            format: isPDF ? 'pdf' : undefined,
            access_mode: 'public'
        });

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

const deleteFromCloudinary = async (publicId, isPDF = false) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: isPDF ? 'raw' : 'image'
        });
        logger.info(`Deleted from Cloudinary: ${publicId}`);
        return result;
    } catch (error) {
        logger.error(`Cloudinary deletion failed: ${error.message}`);
        throw error;
    }
};

// Fixed: handles nested folders like cms/resumes/filename
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        // Extract everything after /upload/v123456789/
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[^.]+)?$/);
        return match ? match[1] : null;
    } catch (error) {
        return null;
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    getPublicIdFromUrl
};