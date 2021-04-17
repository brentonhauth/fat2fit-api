const { bad } = require('./response');

class StatusError extends Error {
    /**
     * @param {number} code
     * @param {string} msg
     */
    constructor(code, msg) {
        super(msg);
        this.code = code;
    }
  
    /**
     * @param {import('express').Response} res
     */
    out(res) {
        const payload = bad(this.code, this.message);
        res.status(this.code).json(payload);
    }
}

module.exports = StatusError;
