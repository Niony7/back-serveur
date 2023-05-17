var connection = require('../config/connection_db');

class Categorie {
    static read(next){
        console.log("lecture");
        connection.query('SELECT * FROM categorie', (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }
    static read_one(idCategorie, next){
        console.log("lecture");
        connection.query('SELECT * FROM categorie WHERE idCategorie=?',[idCategorie], (err, row)=>{
            if (err) throw err;
            next(err,row);
        })
    }

    static creat(contenu, idUser,next){
        console.log(contenu);
        connection.query('INSERT INTO categorie (idCategorie, nomcategorie, idUser) VALUES (?, ?, ?)', 
        [contenu.idCategorie, contenu.nomCategorie, idUser] , (err, row) =>{
            if (err) throw err;
            next(err, row);
        })
    }

    static delete(numero, idUser, next){
        connection.query("UPDATE categorie SET idUser=? WHERE idCategorie=?", [idUser, contenu.idCategorie], (err, res) => {
            if (err) throw err;
            else{
                console.log("efa eto")
                connection.query("DELETE FROM categorie WHERE idCategorie=?", numero, (err1)=> {
                    if (err1) throw err1;
                    next(err1);
                })
            }
        }) 
    }

    static update(contenu, idUser, next){
        connection.query("UPDATE categorie SET nomCategorie=?, idUser=? WHERE idCategorie=?", [contenu.nomCategorie, idUser, contenu.idCategorie], (err, res) => {
            if (err) throw err;
            next();
        })
    }

}

module.exports = Categorie;