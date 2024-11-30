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

/**
 *
 * @param {String} sql
 * @param {*[]} params
 * @returns {Promise<number> | Promise<undefined>}
 */
exports.insertAndGetId = async (sql, params) => {
    let id;

    try {
        let result = await db.query(sql, params);
        id = result[0].insertId;
    }
    catch (err) {
        console.log(err);
    }

    return id;
}

/**
 *
 * @param {String} sql
 * @returns {Promise<void>}
 */
exports.query = async (sql) => {
    try {
        await db.query(sql);
    }
    catch (err) {
        console.log(err);
    }
}

/**
 *
 * @param {String} sql
 * @param {*[]} params
 * @returns {Promise<void>}
 */
exports.queryWithParams = async (sql, params) => {
    try {
        await db.query(sql, params);
    }
    catch (err) {
        console.log(err);
    }
}

/**
 *
 * @param {String} sql
 * @param {*[]} params
 * @returns {Promise<void>}
 */
exports.update = async (sql, params) => {
    try {
        await db.query(sql, params);
    }
    catch (err) {
        console.log(err);
    }
}