var connection = require('../config/connection_db');

class AuditCategorie {
    static read(next){
        console.log("lecture");
        connection.query('SELECT * FROM categorie_audit', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
}

module.exports = AuditCategorie;