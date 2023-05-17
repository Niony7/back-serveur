var connection = require('../config/connection_db');

class Location {
    static read(next){
        console.log("lecture");
        connection.query(
            "SELECT C.nom As client, C.idClient, LV.idLocation, LV.dateDebut, LV.nombreJour, LV.enCour, LV.coutLocationJournalier, "+
            "LV.payer, LV.voiture, LV.idVoiture, LV.coutFinalLocation, DATE_ADD(LV.dateDebut, INTERVAL LV.nombreJour DAY) AS dateRestitution FROM "+
            "(SELECT L.idLocation, L.dateDebut, L.nombreJour, L.enCour, L.coutLocationJournalier, L.payer, L.idClient, "+
            "V.immatriculation As voiture, V.idVoiture, (L.nombreJour*L.coutLocationJournalier) As coutFinalLocation " +
            "FROM location As L INNER JOIN voiture AS V ON L.idVoiture=V.idVoiture) AS LV INNER JOIN client AS C "+
            " ON LV.idClient = C.idClient",
            (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_one(idLocation,next){
        console.log("lecture");
        connection.query('SELECT * FROM location WHERE idLocation=?', [idLocation],(err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static readLocationClient(idClient,next){
        console.log("lecture");
        connection.query('SELECT L.*, V.*, DATE_ADD(L.dateDebut, INTERVAL L.nombreJour DAY) AS dateRestitution FROM location As L INNER JOIN voiture AS V '
        + 'ON L.idVoiture = V.idVoiture WHERE idClient = ? AND enCour=1', [idClient],(err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat (contenu, idUser, next){
        console.log(contenu);
       connection.query('UPDATE voiture SET disponibilite = 0 WHERE idVoiture=?',[contenu.idVoiture], (err)=>{
            if(err) {
                throw err;
            } else {
                connection.query('INSERT INTO location (dateDebut, nombreJour, idVoiture, idClient, coutLocationJournalier, idUser)' +
                ' VALUES (?, ?, ?, ?, ?, ?)',
                [contenu.dateDebut, contenu.nombreJour, contenu.idVoiture, contenu.idClient, contenu.prixLocation, idUser] , (err2, row2) =>{
                    if (err2) throw err2;
                        next(err2, row2);
                })
            }
        }) 
    }

    static delete(numero, idUser,next){
        console.log("efa eto")
        connection.query("UPDATE location SET idUser=? WHERE idLocation=?", [idUser, numero], (err)=> {
            if (err) throw err;
            else{
                connection.query("DELETE FROM location WHERE idLocation=?", [numero], (err)=> {
                    if (err) throw err;
                    next(err);
                })
            }
        })
    }
    static delete_voiture(idVoiture, next){
        connection.query("DELETE FROM location WHERE idVoiture=?", [idVoiture], (err)=> {
            if (err) throw err;
            next(err);
        })
    }

    static update(contenu, idUser, next){
        connection.query("UPDATE location SET dateDebut=?, nombreJour=?, idVoiture=?, idClient=?, idUser=? WHERE idLocation=?",
         [contenu.dateDebut, contenu.nombreJour, contenu.idVoiture, contenu.idClient, idUser,contenu.idLocation], (err, res) => {
            if (err) throw err;
            next();
        })
    }
    static setTerminer(idLocation, next){
        connection.query("UPDATE location SET enCour=0 WHERE idLocation=?",
         [idLocation], (err, res) => {
            if (err) throw err;
            next();
        })
    }
    static payer(idLocation, next){
        connection.query("UPDATE location SET payer=1 WHERE idLocation=?",
         [idLocation], (err, res) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = Location;