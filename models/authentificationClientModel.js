var connection = require('../config/connection_db');

class Client{
    static read(email,next){
        console.log("lecture");
        connection.query('SELECT * FROM client WHERE email=?', [email], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
}

module.exports = Client;