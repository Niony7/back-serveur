var express = require('express');
var visiteTechnique = require('../models/visiteTechniqueModel');
var voiture = require('../models/voitureModel');
const app = express.Router();
var dateFormat = require('dateformat');
var chiffreFormat = require('../config/chiffreFormat')
app.get('/', (req, res)=>{
    visiteTechnique.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            row.forEach(visiteTechnique => {
                visiteTechnique.dateDebutVisiteTechnique = dateFormat(visiteTechnique.dateDebutVisiteTechnique, 'yyyy-mm-dd');
                visiteTechnique.dateFinVisiteTechnique = dateFormat(visiteTechnique.dateFinVisiteTechnique, 'yyyy-mm-dd');
                visiteTechnique.datePayementVisiteTechnique = dateFormat(visiteTechnique.datePayementVisiteTechnique, 'yyyy-mm-dd');
                visiteTechnique.coutVisiteTechniqueL = chiffreFormat(visiteTechnique.coutVisiteTechnique);
            });
            res.json(row);
        }
    });
})
app.post('/', (req, res) =>{
    visiteTechnique.creat(req.body, (err, row)=>{
         if(err){
            res.send({message:'erreur erveur'});
            }else{
               
                voiture.read_one(req.body.idVoiture, (err1, row1)=>{
                    if(err1){
                        res.send({message:'erreur serveur'})
                    }else{
                        const visite = {
                            idVisiteTechnique: row.insertIndex,
                            dateDebutVisiteTechnique : req.body.dateDebutVisiteTechnique,
                            dateFinVisiteTechnique : req.body.dateFinVisiteTechnique,
                            idVoiture : req.body.idVoiture,
                            coutVisiteTechnique : req.body.coutVisiteTechnique,
                            coutVisiteTechniqueL : chiffreFormat(req.body.coutVisiteTechnique),
                            datePayementVisiteTechnique : req.body.datePayementVisiteTechnique,
                            voiture : row1[0].immatriculation
                        }
                        res.json(visite);
                    }
                })
             
            }
        }) 
})
app.delete('/',function(req,res){
    visiteTechnique.delete(req.query.idVisiteTechnique, (err) =>{
        if (err) {
            res.send({message:'erreur erveur'});
        }else{
           res.send();
        }
    });
})

app.put('/', function(req, res){
    var contenu ={
        idVisiteTechnique : req.body.idVisiteTechnique,
        dateDebutVisiteTechnique : req.body.dateDebutVisiteTechnique,
        dateFinVisiteTechnique : req.body.dateFinVisiteTechnique,
        coutVisiteTechnique : parseInt(req.body.coutVisiteTechnique),
        datePayementVisiteTechnique : req.body.datePayementVisiteTechnique,
        idVoiture : parseInt(req.body.idVoiture)
    }
    visiteTechnique.update(contenu, (err) =>{
        if(err) {
            res.send({message:'erreur erveur'});
        }else{
            voiture.read_one(contenu.idVoiture, (err1, row1)=>{
                if(err1){
                    res.send({message:'erreur serveur'})
                }else{
                    contenu.voiture = row1[0].immatriculation;
                    contenu.coutVisiteTechniqueL = chiffreFormat(contenu.coutVisiteTechnique);
                    res.send(contenu);
                }
            })
           
        }
   })
})

module.exports = app;
