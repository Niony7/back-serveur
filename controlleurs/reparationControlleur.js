var express = require('express');
var reparation = require('../models/reparationModel');
var voiture = require('../models/voitureModel')
const app = express.Router();
var chiffreFormat = require('../config/chiffreFormat');
var dateFormat = require('dateformat');

app.get('/', (req, res)=>{
    reparation.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            row.forEach(reparation => {
                reparation.dateReparation = dateFormat(reparation.dateReparation, 'yyyy-mm-dd');
                reparation.coutReparationL = chiffreFormat(reparation.coutReparation);
            });
            res.json(row);
        }
    });
})
app.post('/', (req, res) =>{
    reparation.creat(req.body, (err, row)=>{
         if(err){
            res.send({message:'erreur erveur'});
            }else{
                voiture.read_one(req.body.idVoiture, (err1, row1)=>{
                    if(err1){
                        res.send({message:'erreur serveur'})
                    }else{
                        const reparation = {
                            idReparation : row.insertIndex,
                            dateReparation : req.body.dateReparation,
                            description : req.body.description,
                            idVoiture : req.body.idVoiture,
                            coutReparation : req.body.coutReparation,
                            coutReparationL : chiffreFormat(req.body.coutReparation),
                            voiture : row1[0].immatriculation
                        }
                     res.json(reparation);
                    }
                })
              
            }
        }) 
})
app.delete('/',function(req,res){
    console.log(req.query.idReparation);
    reparation.delete(req.query.idReparation, (err) =>{
        if (err) {
            res.send({message:'erreur erveur'});
        }else{
           res.send();
        }
    });
})

app.put('/', function(req, res){
   reparation.update(req.body, (err) =>{
        if(err) {
            res.send({message:'erreur erveur'});
        }else{
            voiture.read_one(req.body.idVoiture, (err1, row1)=>{
                if(err1){
                    res.send({message:'erreur serveur'})
                }else{
                    const reparation = {
                        idReparation : req.body.idReparation,
                        dateReparation : req.body.dateReparation,
                        description : req.body.description,
                        idVoiture : req.body.idVoiture,
                        coutReparation : req.body.coutReparation,
                        coutReparationL : chiffreFormat(req.body.coutReparation),
                        voiture : row1[0].immatriculation
                    }
                 res.json(reparation);
                }
            })
        }
   })
})

module.exports = app;
