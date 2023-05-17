var connection = require('../config/connection_db');

class AuditVoiture {
    static read(next){
        console.log("lecture");
        connection.query('SELECT * FROM voiture_audit', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
}

module.exports = AuditVoiture;