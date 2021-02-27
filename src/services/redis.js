const redis = require('redis');
const config = require('../config');

const THREE_HOURS = 3 * 60 * 60;

/**
 * @typedef {(err:Error,reply:string)=>void} RedisCallback
 */

/** @type {redis.RedisClient|undefined} */
let client;

// try {
//     // If you don't have redis, then it won't work
//     client = redis.createClient(config.REDIS_URL, {
//         password: config.REDIS_PASSWORD || ''
//     });
// } catch (e) {
//     console.error('Redis client not setup.');
//     client = null;
// }


module.exports = {
    /**
     * 
     * @param {string} key
     * @param {RedisCallback} callback
     */
    get(key, callback) {
        if (client) {
            client.get(key, callback);
        }
    },

    /**
     * @param {string} key
     * @returns {Promise<string>}
     */
    getAsync(key) {
        if (!client) {
            return Promise.reject(new Error('Client not defined'));
        }
        return new Promise((resolve, reject) => {
            client.get(key, (err, reply) => {
                if (err) reject(err);
                else resolve(reply);
            });
        });
    },

    /**
     * @param {string} key
     * @param {string} value
     * @param {number} [duration] duration in seconds, default is 3 hours.
     * @param {RedisCallback} [callback]
     */
    set(key, value, duration=THREE_HOURS, callback=undefined) {
        if (!client) return;
        let params = [key, value];

        if (typeof duration === 'function') {
            callback = duration;
            duration = THREE_HOURS;
        }

        params.push('EX', duration);

        if (callback) {
            client.set(params, callback);
        } else {
            client.set(params);
        }
    },

    /**
     * @param {string} key
     * @param {RedisCallback} callback
     */
    del(key, callback) {
        if (client) {
            if (callback) {
                client.del(key, callback);
            } else {
                client.del(key);
            }
        }
    }
};
