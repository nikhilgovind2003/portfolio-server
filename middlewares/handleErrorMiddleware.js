module.export = function handleErrorMiddleware(err, req, res, next) {
    req.statusCode = req.statusCode || 500;
    req.statusMessage = req.statusMessage || 'Internal Server Error';
    res.status(req.statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}

