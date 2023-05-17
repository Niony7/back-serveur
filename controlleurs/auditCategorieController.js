var express = require('express');
var categorieAudit = require('../models/auditCategorieModel');
const app = express.Router();

app.get('/', (req, res)=>{
    categorieAudit.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            res.json(row);
        }
    });
})

module.exports = app;