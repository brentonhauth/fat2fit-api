const { bad } = require('../helpers/response');

/**
 * (404) Page Not Found handler 
 * @type {import('express').RequestParamHandler}
 */
const notFoundHandler = (req, res, _next) => {
    const payload = bad(404, `Could not ${req.method} ${req.path}`);
    res.status(404).json(payload);
};

/**
 * (500) Internal Error handler
 * @type {import('express').ErrorRequestHandler}
 */
const internalErrorHandler = (error, _req, res, _next) => {
    const payload = bad(500, error.message || `${error}`);
    res.status(500).json(payload);
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
