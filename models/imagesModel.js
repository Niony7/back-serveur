var connection = require('../config/connection_db');
var fs = require('fs');

class Images {
    static async create (contenu, next ){
        connection.query( "INSERT INTO images (Voiture, nomFichier) VALUES (?, ?)", [contenu.numVoiture, contenu.name], (err) => {
            if (err) throw err;
            next(err);
        })  
    }

    static read (idVoiture, next){
        connection.query(" SELECT idImage FROM  images WHERE idVoiture=?", [idVoiture], (err, row) => {
            if (err) throw err;
            next (err, row);
        })
    }

    static delete1(liste_images, next) {
        liste_images.forEach( async (nomFichier) => {
            console.log(nomFichier)
            connection.query(" DELETE FROM images WHERE nomFichier=?", [nomFichier]);
                await fs.unlink(__dirname+'/../../client/public/images/'+nomFichier, (err)=>{
                    if (err) {
                        
                        console.error('there was an error:', err.message);
                        throw err;
                    } else {
                        console.log('successfully deleted /tmp/hello');
                    }
                });
            console.log("delete");
        });
    }
    static delete(id_voiture, next){
        connection.query("DELETE FROM images WHERE idVoiture=?", id_voiture, (err) =>{
            if(err) throw err;
            next(err);
        })
    }
    static delete_listeImage = async (listeImages, next) => {
        await listeImages.forEach( async (idImage) => {
            console.log(idImage)
            connection.query(" DELETE FROM images WHERE idVmage=?", [idImage]);
            console.log("delete");
        });
        next();
    }
}
module.exports = Images; 