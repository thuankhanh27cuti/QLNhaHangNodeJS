const db = require("./config/db");

/**
 *
 * @param {String} sql
 * @param {*[]} params
 * @returns {Promise<*[]>}
 */
exports.selectAllWithParams = async (sql, params) => {
    let data = [];

    try {
        let query = await db.query(sql, params);
        data = query[0];
    }
    catch (err) {
        console.log(err);
    }
    return data;
}

/**
 *
 * @param {String} sql
 * @returns {Promise<*[]>}
 */
exports.selectAll = async (sql) => {
    let data = [];

    try {
        let query = await db.query(sql);
        data = query[0];
    }
    catch (err) {
        console.log(err);
    }
    return data;
}