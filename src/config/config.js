let Mysql = require('node-mysql-promise');


let mysql = Mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : '',
    tablePrefix : 'pre_',
    database    : 'student',
    charset     : 'UTF8',
    port				: 3306
});


module.exports = mysql;