var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var employer = require('../models/employerModel');
const app = express.Router();

app.get('/', (req, res)=>{
    employer.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            res.json(row);
        }
    });
})
app.post('/', (req, res) =>{
    employer.read_one(req.body.idEmployer, (err, row)=>{
        if(err){
            res.send({message:'erreur serveur'})
        }else{
            if(row[0]==undefined){
                bcrypt.hash(req.body.motDePasseEmployer, saltRounds, async (err, hashedMotDePasseEmployer) => {
                    const employer_a_inserer = {
                        idEmployer : req.body.idEmployer,
                        nomEmployer : req.body.nomEmployer,
                        prenomEmployer : req.body.prenomEmployer,
                        adresseEmployer : req.body.adresseEmployer,
                        telephoneEmployer : req.body.telephoneEmployer,
                        motDePasseEmployer : hashedMotDePasseEmployer,
                    }
                    employer.creat(employer_a_inserer, (err)=>{
                        if(err){
                            res.send({message:'erreur erveur'});
                            }else{
                            res.json(employer_a_inserer);
                        }
                    }) 
                })
            }else{
                res.send({message:"l' identifiant appartient a un autre employer"})
            }
        }
    })
   
})
app.delete('/',function(req,res){
    employer.delete(req.query.idEmployer, (err) =>{
        if (err) {
            res.send({message:'erreur erveur'});
        }else{
           res.send();
        }
    });
})

app.put('/', function(req, res){
    if(req.body.nouveauMotDePasse){
        bcrypt.hash(req.body.nouveauMotDePasse, saltRounds, async (err, hashedMotDePasse) => {
            const contenu = {
                idEmployer : req.body.employer.idEmployer,
                nomEmployer : req.body.employer.nomEmployer,
                prenomEmployer : req.body.employer.prenomEmployer,
                adresseEmployer : req.body.employer.adresseEmployer,
                telephoneEmployer : req.body.employer.telephoneEmployer,
                motDePasseEmployer : hashedMotDePasse,
            }
            employer.update_avecMotDePasse(contenu, (err) =>{
                    if(err) {
                        res.send({message:'erreur erveur'});
                    }else{
                        employer.read( (err, row) => {
                            if (err){
                                res.send({message:'erreur erveur'});
                            } else{
                                res.json(row);
                            }
                        });
                    }
            })
        })
    }else{
        employer.update_sansMotDePasse(req.body, (err) =>{
            if(err) {
                res.send({message:'erreur erveur'});
            }else{
                employer.read( (err, row) => {
                    if (err){
                        res.send({message:'erreur erveur'});
                    } else{
                        res.json(row);
                    }
                });
            }
    })
    }
    /*bcrypt.hash(req.body.motDePasse, saltRounds, async (err, hashedMotDePasse) => {
        const client = {
            id_client : req.body.id_client,
            nom : req.body.nom,
            email : req.body.email,
            adresse : req.body.adresse,
            telephone : req.body.telephone,
            motDePasse : hashedMotDePasse,
        }
        client.update(client, (err) =>{
                if(err) {
                    res.send('err');
                }else{
                    client.read( (err, row) => {
                        if (err){
                            res.send('err');
                        } else{
                            res.json(row);
                        }
                    });
                }
        })
    })*/
})

module.exports = app;
