'use strict';

let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: 'my-nodeapp-db'
});

connection.connect();

connection.query('SELECT * from mydata LIMIT 2;', (err, rows, fields) => {

    if (err) throw err;
    console.log(fields)
    console.log(rows);
});



connection.end();