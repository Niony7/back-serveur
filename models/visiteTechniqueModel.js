var connection = require('../config/connection_db');

class VisiteTechnique {
    static read(next){
        console.log("lecture");
        connection.query('SELECT VT.idVisiteTechnique, VT.dateDebutVisiteTechnique, VT.dateFinVisiteTechnique, '
        +' VT.coutVisiteTechnique, VT. datePayementVisiteTechnique, VT.idVoiture, V.immatriculation AS voiture '
        +' FROM visitetechnique AS VT INNER JOIN voiture As V ON VT.idVoiture = V.idVoiture', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat(contenu, next){
        console.log(contenu);
        connection.query('INSERT INTO visitetechnique ( dateDebutVisiteTechnique, dateFinVisiteTechnique, idVoiture, coutVisiteTechnique, datePayementVisiteTechnique)' +
        ' VALUES (?, ?, ?, ?, ?)',
        [contenu.dateDebutVisiteTechnique, contenu.dateFinVisiteTechnique, contenu.idVoiture, contenu.coutVisiteTechnique, contenu.datePayementVisiteTechnique] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }

    static delete(numero, next){
        connection.query("DELETE FROM visitetechnique WHERE idVisiteTechnique=?", numero, (err)=> {
            if (err) throw err;
            next(err);
        })
    }

    static update(contenu, next){
        connection.query("UPDATE visitetechnique SET dateDebutVisiteTechnique=?, dateFinVisiteTechnique=?, idVoiture=?, coutVisiteTechnique=?, datePayementVisiteTechnique=? WHERE idVisiteTechnique=?",
         [contenu.dateDebutVisiteTechnique, contenu.dateFinVisiteTechnique, contenu.idVoiture, contenu.coutVisiteTechnique, contenu.datePayementVisiteTechnique, contenu.idVisiteTechnique], (err) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = VisiteTechnique;