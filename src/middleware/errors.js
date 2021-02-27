/**
 * (404) Page Not Found handler 
 * @type {import('express').RequestParamHandler}
 */
const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        msg: `Could not ${req.method} ${req.path}`
    });
};

/**
 * (500) Internal Error handler
 * @type {import('express').ErrorRequestHandler}
 */
const internalErrorHandler = (error, _req, res, _next) => {
    res.status(500).json({
        msg: error.message || error
    });
};


/**
 * appends error handlers to a router or app
 * Note: Should be appended last
 * @param {import('express').Application} app
 */
module.exports = app => {
    app.use(notFoundHandler);
    app.use(internalErrorHandler);
    return app;
};
