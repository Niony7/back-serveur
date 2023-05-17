var express = require('express');
const bcrypt = require('bcrypt');
var authentification = require('../models/authentificationClientModel');
const app = express.Router();

app.get('/', (req, res) => {
    console.log(req.session.client)
   if( req.session.client !== undefined) {
        res.send({loggedIn : true, client : req.session.client})
    } else {
        res.send( { loggedIn : false})
    }
})
app.delete('/', (req, res) => {
    req.session = undefined;
    res.send({loggedIn:false})
})
app.post('/', (req,res) => {
    authentification.read(req.body.email, (err, row) => {
        if (err){
            res.send({message:'erreur de serveur'});
        }else{
            if(row[0] !== undefined){
                //console.log(row[0] !== undefined);
                
                console.log(req.session.client);
                bcrypt.compare(req.body.motDePasse, row[0].motDePasse, async (error, response) =>{
                    if(error){
                        res.send({message:'erreur de serveur'})
                        throw err;
                    } 
                    if(response){
                        req.session.client = row[0];
                        res.send({client : row[0]})
                    }else{
                        res.send({message : 'mot de passe diso'});
                    }
                })
            }else{
                res.send({message:'email incorrect'})
            }
        }
    })
})

module.exports = app;