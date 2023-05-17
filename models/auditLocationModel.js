var connection = require('../config/connection_db');

class AuditLocation {
    static read(next){
        console.log("lecture");
        connection.query('SELECT * FROM location_audit', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
}

module.exports = AuditLocation;