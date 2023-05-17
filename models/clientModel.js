var connection = require('../config/connection_db');

class Client {
    static read(next){
        connection.query('SELECT idClient,nom, email, telephone, adresse, motDePasse FROM client', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_one(email, next){
        connection.query('SELECT * FROM client WHERE email=?', email,(err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }


    static creat(contenu, next){
        console.log(contenu);
        connection.query('INSERT INTO client (nom, email, telephone ,adresse, motDePasse)' +
        ' VALUES (?, ?, ?, ?, ?)',
        [contenu.nom, contenu.email, contenu.telephone, contenu.adresse, contenu.motDePasse] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }
    /*static test(mot, next){
        //console.log(contenu);
        connection.query('INSERT INTO admin (idAdmin,identifiant, motDePasse)' +
        ' VALUES (?, ?, ?)',
        [1,'admin1234', mot] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }*/
    static delete(numero, next){
        console.log("efa eto")
        connection.query("DELETE FROM client WHERE idClient=?", numero, (err)=> {
            if (err) throw err;
            next(err);
        })
    }

    static update_sansMotDePasse(contenu, next){
        connection.query("UPDATE client SET nom=? , email=?, telephone=?, adresse=? WHERE idClient=?",
         [contenu.nom, contenu.email, contenu.telephone, contenu.adresse, contenu.idClient], (err, res) => {
            if (err) throw err;
            next();
        })
    }
    static update_avecMotDePasse(contenu, next){
        connection.query("UPDATE client SET nom=? , email=?, telephone=?, adresse=?, motDePasse=? WHERE idClient=?",
         [contenu.nom, contenu.email, contenu.telephone, contenu.adresse, contenu.motDePasse, contenu.idClient], (err, res) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = Client;