const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'cpses_dambjpv8qe',
    database: 'dailycos_daily-cost'
});

module.exports = db;