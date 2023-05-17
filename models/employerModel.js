var connection = require('../config/connection_db');

class Employer {
    static read(next){
        connection.query('SELECT idEmployer,nomEmployer, prenomEmployer,telephoneEmployer ,adresseEmployer FROM employer', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_one(identifiant, next){
        connection.query('SELECT idEmployer,nomEmployer, prenomEmployer,telephoneEmployer ,adresseEmployer FROM employer WHERE idEmployer=?', identifiant,(err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat(contenu, next){
        console.log(contenu);
        connection.query('INSERT INTO employer (idEmployer,nomEmployer, prenomEmployer,telephoneEmployer ,adresseEmployer, motDePasseEmployer)' +
        ' VALUES (?, ?, ?, ?, ?, ?)',
        [contenu.idEmployer, contenu.nomEmployer, contenu.prenomEmployer, contenu.telephoneEmployer, contenu.adresseEmployer, contenu.motDePasseEmployer] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }

    static delete(numero, next){
        console.log("efa eto")
        connection.query("DELETE FROM employer WHERE idEmployer=?", numero, (err)=> {
            if (err) throw err;
            next(err);
        })
    }

    static update_sansMotDePasse(contenu, next){
        connection.query("UPDATE employer SET nomEmployer=? , prenomEmployer=?, telephoneEmployer=?, adresseEmployer=? WHERE idEmployer=?",
         [contenu.nomEmployer, contenu.prenomEmployer, contenu.telephoneEmployer, contenu.adresseEmployer, contenu.idEmployer], (err, res) => {
            if (err) throw err;
            next();
        })
    }
    static update_avecMotDePasse(contenu, next){
        connection.query("UPDATE employer SET nomEmployer=? , prenomEmployer=?, telephoneEmployer=?, adresseEmployer=?, motDePasseEmployer=? WHERE idEmployer=?",
         [contenu.nomEmployer, contenu.prenomEmployer, contenu.telephoneEmployer, contenu.adresseEmployer, contenu.motDePasseEmployer, contenu.idEmployer], (err, res) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = Employer;