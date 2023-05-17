var express = require('express');
var categorie = require('../models/categorieModel');
const app = express.Router();

app.get('/', (req, res)=>{
    console.log(req.session.employer)
    console.log(req.session.admin)
    categorie.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            res.json(row);
        }
    });
})
app.post('/', (req, res) =>{
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
    categorie.read_one(req.body.idCategorie, (err, row)=>{
        if(err){
            res.send({message:'erreur serveur'})
        }else{
            if(row[0]==undefined){
                categorie.creat(req.body, idUser, (err1)=>{
                    if(err1){
                       res.send({message:'erreur erveur'});
                       }else{
                           const voiture = {
                               idCategorie : req.body.idCategorie,
                               nomCategorie : req.body.nomCategorie
                           }
                        res.json(voiture);
                       }
                   }) 
            }else{
                res.send({message:"l' identifiant choisi existe deja dans la base de donnes"})
            }
        }
    })
})
app.delete('/',function(req,res){
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
    console.log(req.query.idCategorie);
    categorie.delete(req.query.idCategorie, idUser, (err) =>{
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
   categorie.update(req.body, idUser, (err) =>{
        if(err) {
            res.send({message:'erreur erveur'});
        }else{
            categorie.read( (err, row) => {
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
