const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "qlnhahangv3"
});

module.exports = connection.promise();