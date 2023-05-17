var express = require('express');
var assurance = require('../models/assuranceModel');
var voiture = require('../models/voitureModel');
const app = express.Router();
var dateFormat = require('dateformat');
var chiffreFormat = require('../config/chiffreFormat');
app.get('/', (req, res)=>{
    assurance.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            row.forEach(assurance => {
                assurance.dateDebutAssurance = dateFormat(assurance.dateDebutAssurance, 'yyyy-mm-dd');
                assurance.dateFinAssurance = dateFormat(assurance.dateFinAssurance, 'yyyy-mm-dd');
                assurance.datePayementAssurance = dateFormat(assurance.datePayementAssurance, 'yyyy-mm-dd');
                assurance.coutAssuranceL = chiffreFormat(assurance.coutAssurance)
            });
            res.json(row);
        }
    });
})
app.post('/', (req, res) =>{
    assurance.creat(req.body, (err, row)=>{
         if(err){
            res.send({message:'erreur erveur'});
            }else{
                voiture.read_one(req.body.idVoiture, (err1, row1)=>{
                    if(err1){
                        res.send({message:'erreur serveur'})
                    }else{
                        const assurance = {
                            idAssurance : row.insertIndex,
                            agence : req.body.agence,
                            dateDebutAssurance : req.body.dateDebutAssurance,
                            dateFinAssurance : req.body.dateFinAssurance,
                            idVoiture : req.body.idVoiture,
                            coutAssurance : req.body.coutAssurance,
                            datePayementAssurance : req.body.datePayementAssurance,
                            coutAssuranceL : chiffreFormat(req.body.coutAssurance),
                            voiture : row1[0].immatriculation
                        }
                        res.json(assurance);
                    }
                })
               
            }
        }) 
})
app.delete('/',function(req,res){
    console.log(req.query.idAssurance);
    assurance.delete(req.query.idAssurance, (err) =>{
        if (err) {
            res.send({message:'erreur erveur'});
        }else{
           res.send();
        }
    });
})

app.put('/', function(req, res){
   assurance.update(req.body, (err) =>{
        if(err) {
            res.send({message:'erreur erveur'});
        }else{
           voiture.read_one(req.body.idVoiture, (err1, row1)=>{
               if(err1){
                   res.send({message:'erreur serveur'});
               }else{
                const assurance = {
                    idAssurance : req.body.idAssurance,
                    agence : req.body.agence,
                    dateDebutAssurance : req.body.dateDebutAssurance,
                    dateFinAssurance : req.body.dateFinAssurance,
                    idVoiture : req.body.idVoiture,
                    coutAssurance : req.body.coutAssurance,
                    datePayementAssurance : req.body.datePayementAssurance,
                    coutAssuranceL : chiffreFormat(req.body.coutAssurance),
                    voiture : row1[0].immatriculation
                }
                res.json(assurance);
               }
           })
        }
   })
})

module.exports = app;
