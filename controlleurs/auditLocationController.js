var express = require('express');
var locationAudit = require('../models/auditLocationModel');
const app = express.Router();

app.get('/', (req, res)=>{
    locationAudit.read( (err, row) => {
        if (err){
            res.send({message:'erreur erveur'});
        } else{
            res.json(row);
        }
    });
})

module.exports = app;