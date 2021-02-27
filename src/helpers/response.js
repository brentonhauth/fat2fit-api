/**
 * @template T - type of data
 * @typedef StandardResponse
 * @property {{code:number,msg?:string}} meta
 * @property {T} data
 */

/** */
module.exports = {
    /**
     * Wraps in an 'OK' response.
     * @template T
     * @param {T} data
     * @param {string} [msg] - optional message to attach
     * @returns {StandardResponse<T>}
     */
    ok(data, msg='') {
        const meta = { code: 200, msg };
        return { meta, data };
    },

    /**
     * @param {number} code
     * @param {string} [msg]
     * @returns {StandardResponse<null>}
     */
    bad(code, msg='') {
        const meta = { code, msg };
        return { meta, data: null };
    }
};