var connection = require('../config/connection_db');

class Voiture {
    static read(next){
      
        connection.query('SELECT * FROM voiture AS V INNER JOIN categorie AS C ON V.idCategorie=C.idCategorie', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static fourchettePrix(next){
        connection.query('SELECT  MIN(prixLocation) As min, MAX(prixLocation) As max FROM voiture', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_disponible_futur(dateDisponible, next){
        connection.query('SELECT VF.* FROM (SELECT F.*, MAX(F.dateDisponible) AS maxDateDisponible '+
        'FROM (SELECT V.*, L.dateDebut, L.nombreJour, DATE_ADD(L.dateDebut, INTERVAL L.nombreJour DAY) AS dateDisponible '+
        'FROM voiture AS V LEFT JOIN location AS L ON V.idVoiture = L.idVoiture WHERE L.enCour=1) AS F) AS VF '+
        'WHERE VF.maxDateDisponible = ?',[dateDisponible], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static isDisponibleFutur(contenu, next){
        connection.query('SELECT VF.* FROM (SELECT F.*, MAX(F.dateDisponible) AS maxDateDisponible '+
        'FROM (SELECT V.*, L.dateDebut, L.nombreJour, DATE_ADD(L.dateDebut, INTERVAL L.nombreJour DAY) AS dateDisponible '+
        'FROM voiture AS V LEFT JOIN location AS L ON V.idVoiture = L.idVoiture WHERE L.enCour=1) AS F) AS VF '+
        'WHERE VF.maxDateDisponible = ? AND VF.idVoiture=?',[contenu.dateDebut, contenu.idVoiture], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_disponible(next){
        connection.query('SELECT * FROM voiture WHERE disponibilite = ?',[1], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static setDisponible(idVoiture, next){
        connection.query('UPDATE voiture SET disponibilite=1 WHERE idVoiture = ?',[idVoiture], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    
    static setImagePrincipale(idVoiture,idImage, next){
        connection.query('UPDATE voiture SET imagePrincipale=? WHERE idVoiture = ?',[idImage,idVoiture], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_one(idVoiture, next) {
        connection.query('SELECT * FROM voiture WHERE idVoiture = ?', [idVoiture],(err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat(contenu, idUser, next){
        console.log(contenu);
        connection.query('INSERT INTO voiture (marque,model,immatriculation, couleur, puissance, nombrePlace, prixLocation, etat, sourceEnergie, boiteVitesse,commentaire, idCategorie, idUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)', 
        [contenu.marque, contenu.modele, contenu.immatriculation, contenu.couleur, contenu.puissance, contenu.nombrePlace, contenu.prixLocation, contenu.etat, contenu.sourceEnergie, contenu.boiteVitesse, contenu.commentaire, contenu.idCategorie, idUser] , (err, row, ter) =>{
            if (err) throw err;
            console.log(row);
            next(err, row);
        })
    }

    static delete = async (numero, next) => {
        console.log("efa eto")
        await connection.query("DELETE FROM visitetechnique WHERE idVoiture=?", numero, (err)=>{if(err)throw err});
        await connection.query("DELETE FROM assurance WHERE idVoiture=?", numero, (err)=>{if(err)throw err})
        await connection.query("DELETE FROM reparation WHERE idVoiture=?", numero, (err)=>{if(err)throw err})
        await connection.query("DELETE FROM voiture WHERE idVoiture=?", numero, (err)=> {
            if (err) throw err;
            next(err);
        })
    }
    static update(contenu, idUser, next){
        console.log(contenu);
        connection.query("UPDATE voiture SET marque=?, model=?,immatriculation=?, couleur=?, puissance=?, nombrePlace=?,"+
        " prixLocation=?, etat=?, idCategorie=? , boiteVitesse=?, sourceEnergie=?, commentaire=?, idUser=? WHERE idVoiture=?", 
        [contenu.marque, contenu.modele,contenu.immatriculation, contenu.couleur, contenu.puissance, contenu.nombrePlace,
        contenu.prixLocation, contenu.etat, contenu.idCategorie,contenu.boiteVitesse,contenu.sourceEnergie, contenu.commentaire, idUser,contenu.idVoiture], (err) => {
            if (err) throw err;
            next(err);
        })
    }



}

module.exports = Voiture;