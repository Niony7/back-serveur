var connection = require('../config/connection_db');

class Reparation {
    static read(next){
        console.log("lecture");
        connection.query('SELECT R.idReparation, R.dateReparation, R.description, R.coutReparation, R.idVoiture, V.immatriculation AS voiture '+
        'FROM reparation As R LEFT JOIN voiture As V ON R.idVoiture = V.idVoiture', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat(contenu, next){
        console.log(contenu);
        connection.query('INSERT INTO reparation (dateReparation, description, idVoiture, coutReparation)' +
        ' VALUES (?, ?, ?, ?)',
        [contenu.dateReparation, contenu.description, contenu.idVoiture, contenu.coutReparation] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }

    static delete(numero, next){
        connection.query("DELETE FROM reparation WHERE idReparation=?", numero, (err)=> {
            if (err) throw err;
            next(err);
        })
    }

    static update(contenu, next){
        connection.query("UPDATE reparation SET dateReparation=? , description=?, idVoiture=?, coutReparation=? WHERE idReparation=?",
         [contenu.dateReparation, contenu.description, contenu.idVoiture, contenu.coutReparation, contenu.idReparation], (err, res) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = Reparation;