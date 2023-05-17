var connection = require('../config/connection_db');

class Assurance {
    static read(next){
        console.log("lecture");
        connection.query('SELECT A.idAssurance, A.agence, A.dateDebutAssurance, A.dateFinAssurance, '
        + ' A.coutAssurance, A.datePayementAssurance, A.idVoiture, V.immatriculation As voiture '
        + 'FROM assurance AS A INNER JOIN voiture AS V ON A.idVoiture = V.idVoiture', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat(contenu, next){
        console.log(contenu);
        connection.query('INSERT INTO assurance (agence, dateDebutAssurance, dateFinAssurance, idVoiture, coutAssurance, datePayementAssurance)' +
        ' VALUES (?, ?, ?, ?, ?, ?)',
        [contenu.agence, contenu.dateDebutAssurance, contenu.dateFinAssurance, contenu.idVoiture, contenu.coutAssurance, contenu.datePayementAssurance] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }

    static delete(numero, next){
        console.log("efa eto")
        connection.query("DELETE FROM assurance WHERE idAssurance=?", numero, (err)=> {
            if (err) throw err;
            next(err);
        })
    }

    static update(contenu, next){
        connection.query("UPDATE assurance SET agence=? , dateDebutAssurance=?, dateFinAssurance=?, idVoiture=?, coutAssurance=?, datePayementAssurance=? WHERE idAssurance=?",
         [contenu.agence, contenu.dateDebutAssurance, contenu.dateFinAssurance, contenu.idVoiture, contenu.coutAssurance, contenu.datePayementAssurance,contenu.idAssurance], (err, res) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = Assurance;