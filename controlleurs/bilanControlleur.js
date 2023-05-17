var express = require('express');
var bilan = require('../models/bilanModel');
const app = express.Router();
var chiffeFormat = require('../config/chiffreFormat')
app.post('/', (req,res)=>{
    console.log(req.body);
    var dateDebut = new Date(req.body.dateDebut);
    var dateFin = new Date(req.body.dateFin);
    console.log(dateDebut);
    console.log(dateFin);

    var dateDebut1 = dateDebut.getFullYear() + '-0' + (dateDebut.getMonth()+1) + '-0'+dateDebut.getDate();
    var dateFin1 = dateFin.getFullYear() + '-' + (dateFin.getMonth()+1) + '-' +dateFin.getDate();

    console.log(dateDebut1);
    console.log(dateFin1);

    bilan.read_bilan_entreDate(dateDebut1, dateFin1, (err, row) => {
        if(err){
            res.send({message:'erreur serveur'});
        }else{
           
            row.forEach(bilan => {
                bilan.benefice = bilan.recette-bilan.reparation-bilan.assurance-bilan.visiteTechnique,
                bilan.recette = chiffeFormat(bilan.recette),
                bilan.visiteTechnique = chiffeFormat(bilan.visiteTechnique),
                bilan.assurance = chiffeFormat(bilan.assurance),
                bilan.reparation = chiffeFormat(bilan.reparation),
                bilan.benefice = chiffeFormat(bilan.benefice)
            });
            console.log(row);
            res.json(row );
        }
    })
})
app.post('/chart', (req,res)=>{
    console.log(req.body);
    var dateDebut = new Date(req.body.dateDebut);
    var dateFin = new Date(req.body.dateFin);
    console.log(dateDebut);
    console.log(dateFin);

    var dateDebut1 = dateDebut.getFullYear() + '-0' + (dateDebut.getMonth()+1) + '-0'+dateDebut.getDate();
    var dateFin1 = dateFin.getFullYear() + '-' + (dateFin.getMonth()+1) + '-' +dateFin.getDate();

    console.log(dateDebut1);
    console.log(dateFin1);

    bilan.read_bilan_entreDate(dateDebut1, dateFin1, (err, row) => {
        if(err){
            res.send({message:'erreur serveur'});
        }else{
           
            var labels = [];
            var dataRecette = [];
            var dataDepense = [];
            var dataBenefice = []
            row.forEach(bilan=>{
                labels.push(bilan.immatriculation);
                dataRecette.push(bilan.recette-0);
                dataDepense.push(bilan.reparation+bilan.visiteTechnique+bilan.assurance);
                dataBenefice.push(bilan.recette-bilan.reparation-bilan.visiteTechnique-bilan.assurance)
            })
            console.log(labels);
            console.log(dataRecette);
            console.log(dataDepense);
            console.log(dataBenefice);
            res.send({labels:labels, dataRecette:dataRecette, dataDepense:dataDepense, dataBenefice:dataBenefice})
        }
    })
})

module.exports = app;