var express = require('express');
var voitureAudit = require('../models/auditVoitureModel');
const app = express.Router();

app.get('/', (req, res)=>{
    voitureAudit.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            res.json(row);
        }
    });
})

module.exports = app;