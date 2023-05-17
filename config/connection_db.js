var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '2023',
  database : 'base_location'
});

connection.connect()
module.exports = connection