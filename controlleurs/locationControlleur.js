var express = require('express');
var location = require('../models/locationModel');
const voiture = require('../models/voitureModel');
const app = express.Router();
var dateFormat = require('dateformat');
function formatNombre(nombre){
    var chaine = String(parseFloat(nombre)), // convertit en chaine
        newChaine = '', // nouvelle chaine vide
        longueur = chaine.length, // longueur du nombre
        b = 0, // espacement
        i = 0, // boucle
        point = -1; // position virgule
        virgule = '00'; // initialise la virgule à vide
 
    // récupère sa position (-1 = inexistante)
    point = chaine.indexOf('.', 0);
     
    // si un point existe
    if(point != -1){
      virgule = chaine.substr(point+1, longueur); // stock nombre après le point
      chaine = chaine.substr(0, point); // supprime ceux après
      longueur -= (longueur-point); // recalcule la longueur
    }
     
    // permet de savoir quand faire l'espacement
    if(longueur%3 != 0){
      b = 3 - longueur%3;
    }
     
    // boucle la nouvelle chaine
    for(i=0; i < longueur; i++){
     
      // si atteint 3 nombre
      if(b == 3){
      newChaine += ' '; // espacement
      b = 0; // reset
      }
       
      b++;  // incrémente nombre
      newChaine += chaine[i]; // attribut le nombre à la new chaine
    }
    if(virgule != '00'){
        newChaine+= ','+virgule;
    }
     // rajoute la virgule et le nombre allant après
     
    // retourne le résultat
    return(newChaine);
}
app.get('/', (req, res)=>{
    location.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            row.forEach(location => {
                location.dateDebut =  dateFormat(location.dateDebut, 'yyyy-mm-dd')
                location.dateRestitution = dateFormat(location.dateRestitution, 'yyyy-mm-dd')
                location.coutLocationJournalier = formatNombre(location.coutLocationJournalier)
                location.coutFinalLocation = formatNombre(location.coutFinalLocation)
            });
            res.json(row);
        }
    });
})
app.post('/finLocation', (req, res)=>{
    location.read_one(req.body.idLocation, (err, row)=>{
        if(err){
            res.send({message:'erreur de serveur'})
        }else {
            voiture.setDisponible(row[0].idVoiture, (err, row) => {
                if(err){
                    res.send({message:'erreur de serveur'})
                }else{
                    location.setTerminer(req.body.idLocation, (err, row)=>{
                        if(err){
                            res.send({message:'erreur de serveur'})
                        }else{
                            res.send();
                        }
                    })
                }
                
            })
        }
       
    })
})
app.post('/payer', (req, res)=>{
    location.payer(req.body.idLocation, (err, row)=>{
        if(err){
            res.send({message:'erreur de serveur'})
        }else{
            res.send();
        }
    })
})
app.post('/', async (req, res) =>{
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
    voiture.read_one(req.body.idVoiture, (err, row)=>{
        if(err){
            res.send({message:'erreur'});
        }else{
            console.log(row[0].disponibilite);
            if(row[0].disponibilite==1){
                const contenu = {
                    idVoiture : parseInt(req.body.idVoiture),
                    dateDebut : req.body.dateDebut,
                    nombreJour : parseInt(req.body.nombreJour),
                    prixLocation : row[0].prixLocation,
                    idClient : parseInt(req.body.idClient)
                }
                location.creat(contenu, idUser, (err)=>{
                    if(err){
                        res.send({message:'erreur erveur'});
                       }else{
                            location.read((err, row) => {
                                if(err){
                                    res.send({message:'erreur'})
                                }else{
                                    res.json(row);
                                }
                            })
                       }
                   }) 
            }else{
                res.send({message:"le voiture n' est pas disponnible"})
            }
        }
    })
    
})
app.delete('/',function(req,res){
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
    console.log(req);
    location.delete(req.query.idLocation, (err) =>{
        if (err) {
            res.send({message:'erreur erveur'});
        }else{
           res.send();
        }
    });
})

app.put('/', function(req, res){
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
   location.update(req.body,idUser, (err) =>{
        if(err) {
            res.send({message:'erreur erveur'});
        }else{
            location.read( (err, row) => {
                if (err){
                    res.send({message:'erreur erveur'});
                } else{
                    res.json(row);
                }
            });
        }
   })
})

module.exports = app;
