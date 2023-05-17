var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var authentification = require('../models/authentificationModel');
const app = express.Router();

app.get('/', (req, res) => {
    //res.send({loggedIn : true, admin : true})
    console.log('req.session')
    console.log(req.session.employer)
   if( req.session.admin !== undefined) {
        res.send({loggedIn : true, adminStatus : true, admin : req.session.admin})
    }else if(req.session.employer !==undefined){
        res.send({loggedIn : true, employer : req.session.employer})
    }else {
        res.send( { loggedIn : false})
    }
})
app.delete('/', (req, res) => {
    req.session = undefined;
    res.send({loggedIn:false})
})
app.post('/', (req,res) => {
    authentification.readAdmin(req.body.identifiant, (err, row) => {
        if (err){
            res.send({message:'erreur de serveur'});
        }else{
            if(row[0] === undefined){
                authentification.readEmployer(req.body.identifiant, (err1, row1) => {
                    console.log(row1);
                    if(row1[0] !== undefined){
                        bcrypt.compare(req.body.motDePasse, row1[0].motDePasseEmployer, async (error, response) =>{
                            console.log("employer" + response);
                            if(error){
                                res.send({message:'erreur de serveur'})
                                throw err;
                            } 
                            if(response){
                                req.session.employer = row1[0];
                                res.send({employer : row1[0]})
                            }else{
                                res.send({message : 'mot de passe diso'});
                            }
                        })
                       
                    }else{
                        res.send({message:'identifiant incorect'})
                    }
                })
            }else{
                bcrypt.compare(req.body.motDePasse, row[0].motDePasse, async (error, response) =>{
                    if(error){
                        res.send({message:'err'})
                        throw err;
                    } 
                    if(response){
                        console.log('vraiii')
                        req.session.admin = row[0];
                        res.send({admin : row[0], adminStatus : true})
                    }else{
                        res.send({message : 'mot de passe erronee'});
                    }
                })
            }
        }
    })
})
app.put('/', (req,res) => {
  /*  bcrypt.hash(req.body.nouveauMotDePasse, saltRounds, async (err2, hashedMotDePasseEmployer) => {
        if(err2){
            res.send({message:'erreur de cryptage'})
        }else{
            const compte= {
                idAdmin : 1,
                identifiant : req.body.nouveauIdentifiant,
                motDePasse : hashedMotDePasseEmployer
            }
             authentification.update(compte, (err3)=>{
                if(err3){
                    res.send({message:'erreur serveur'});
                }else{
                    res.send();
                }
            })
        }
    })*/
  authentification.readAdmin(req.body.ancienIdentifiant, (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        }else{
            if(row[0] !== undefined){
                authentification.readEmployer(req.body.nouveauIdentifiant, (err1, row1)=>{
                    if(err1){
                        res.send({message:'erreur erveur'});
                    }else{
                        if(row1[0] == undefined){
                            bcrypt.compare(req.body.ancienMotDePasse, row[0].motDePasse, async (error, response) =>{
                                if(error){
                                    res.send({message:'erreur serveur bcript'})
                                }
                                if(response){
                                   
                                    bcrypt.hash(req.body.nouveauMotDePasse, saltRounds, async (err2, hashedMotDePasseEmployer) => {
                                        if(err2){
                                            res.send({message:'erreur de cryptage'})
                                        }else{
                                            const compte= {
                                                idAdmin : row[0].idAdmin,
                                                identifiant : req.body.nouveauIdentifiant,
                                                motDePasse : hashedMotDePasseEmployer
                                            }
                                             authentification.update(compte, (err3)=>{
                                                if(err3){
                                                    res.send({message:'erreur serveur'});
                                                }else{
                                                    res.send();
                                                }
                                            })
                                        }
                                    })
                                   
                                }else{
                                    res.send({message : 'mot de passe erronnee'})
                                }
                            })
                        }else{
                            res.send({message:'le nouveau identifiant appartient a un employer'})
                        }
                    }
                })
            }else{
                res.send({message:'identifiant erronne'})
            }
        }
    })

})


module.exports = app;