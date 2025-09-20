const logger = require("../config/logger");

module.exports = (err, req, res, next) => {
    const statusCode =  err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const payload = {
        success: false,
        message,
    };

    if (process.env.NODE_ENV !== 'production' && err.stack) {
        payload.stack = err.stack;
    }

    logger.error({
        message: `${req.method} ${req.originalUrl} - ${message}`,
        statusCode
    });
    
    res.status(statusCode).json(payload);
};

 