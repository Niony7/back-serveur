var express = require('express');
var location = require('../models/locationModel');
const voiture = require('../models/voitureModel');
const app = express.Router();
var dateFormat = require('dateformat');
app.post('/', (req, res)=>{
    var aujourdhui = dateFormat(new Date(Date.now()), 'yyyy-mm-dd');
    console.log(req.body)
    if(req.body.dateDebut == aujourdhui){

    voiture.read_one(req.body.idVoiture, (err, row)=>{
        if(err){
            res.send({message:'erreur'});
        }else{
            console.log(row[0].disponibilite);
            if(row[0].disponibilite==1){
                const contenu = {
                    idVoiture : req.body.idVoiture,
                    dateDebut : req.body.dateDebut,
                    nombreJour : req.body.nombreJour,
                    prixLocation : row[0].prixLocation,
                    idClient : req.session.client.idClient 
                }
                console.log(contenu);
                location.creat(contenu, (err)=>{
                    if(err){
                        res.send({message:'err'});
                       }else{
                            res.send();
                       }
                   })
            }else{
                res.send({message:"le voiture n' est pas disponnible"})
            }
        }
        })
    }else{
        voiture.isDisponibleFutur(req.body, (err, row1)=>{
            console.log(row1)
            console.log(row1.length)
            if(row1.length !== 0){
                const contenu = {
                    idVoiture : req.body.idVoiture,
                    dateDebut : req.body.dateDebut,
                    nombreJour : req.body.nombreJour,
                    prixLocation : row1[0].prixLocation,
                    idClient : req.session.client.idClient 
                }
               location.creat(contenu, (err1)=>{
                    if(err){
                        res.send({message:'serveur en cour de maintenance'});
                    }else{
                            res.send();
                    }
                  
                })
            }else{
                res.send({message: 'voiture indisponible'});
            }
        })
    }
})
app.get('/', (req, res) => {
    console.log(req.session);
    location.readLocationClient(req.session.client.idClient, (err, row)=>{
        if(err){
            res.send({message:'erreur'})
        }else{
            row.forEach(location => {
                location.dateDebut = dateFormat(location.dateDebut, 'yyyy-mm-dd')
                location.dateRestitution = dateFormat(location.dateRestitution, 'yyyy-mm-dd')
            });
            res.json(row);
        }
    })
})
module.exports = app;