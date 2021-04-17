/**
 * @enum {200|201|401|403|404|500}
 */
const StatusCode = Object.freeze({
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVICE_ERROR: 500,
});

module.exports = StatusCode;
