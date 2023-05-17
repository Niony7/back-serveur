var connection = require('../config/connection_db');

class Client{
    static readAdmin(identifiant,next){
        console.log("lecture");
        connection.query('SELECT * FROM admin WHERE identifiant=?', [identifiant], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static readEmployer(identifiant,next){
        console.log("lecture");
        connection.query('SELECT * FROM employer WHERE idEmployer=?', [identifiant], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static update(contenu,next){
        connection.query('UPDATE admin set identifiant=?, motDePasse=? WHERE idAdmin=?',
         [contenu.identifiant, contenu.motDePasse, contenu.idAdmin], (err)=>{
            if (err) throw err;
            next(err);
        })
    }


}

module.exports = Client;