var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var client = require('../models/clientModel');
const app = express.Router();

app.get('/', (req, res)=>{
    client.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            res.json(row);
        }
    });
})
app.post('/', (req, res) =>{
    client.read_one(req.body.email, (err, row)=>{
        if(err){
            res.send({message:'erreur serveur'})
        }else{
            if(row[0] === undefined){
                bcrypt.hash(req.body.motDePasse, saltRounds, async (err, hashedMotDePasse) => {
                    const client_a_inserer = {
                        nom : req.body.nom,
                        email : req.body.email,
                        adresse : req.body.adresse,
                        telephone : req.body.telephone,
                        motDePasse : hashedMotDePasse,
                    }
                    client.creat(client_a_inserer, (err1, row1)=>{
                        if(err1){
                            res.send({message:'erreur serveur'});
                        }else{
                            console.log(row1)
                            client_a_inserer.idClient=row1.insertId;
                            res.json(client_a_inserer);
                        }
                    }) 
                })
            }else{
                res.send({message:'email appartient a un autre client'})
            }
           
        }
    })

    /**/
})
app.delete('/',function(req,res){
    console.log(req.query.id_client);
    client.delete(req.query.id_client, (err) =>{
        if (err) {
            res.send({message:'erreur erveur'});
        }else{
           res.send();
        }
    });
})

app.put('/', function(req, res){
    console.log(req.body)
    if(req.body.nouveauMotDePasse){
        bcrypt.hash(req.body.nouveauMotDePasse, saltRounds, async (err, hashedMotDePasse) => {
            const contenu = {
                idClient : req.body.client.idClient,
                nom : req.body.client.nom,
                email : req.body.client.email,
                adresse : req.body.client.adresse,
                telephone : req.body.client.telephone,
                motDePasse : hashedMotDePasse,
            }
            client.update_avecMotDePasse(contenu, (err) =>{
                    if(err) {
                        res.send({message:'erreur erveur'});
                    }else{
                        res.send();
                    }
            })
        })
    }else{
        client.update_sansMotDePasse(req.body, (err) =>{
            if(err) {
                res.send({message:'erreur erveur'});
            }else{
                res.send();
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
