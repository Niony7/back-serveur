var express = require('express');
var voiture = require('../models/voitureModel');
var images  = require('../models/imagesModel')
var location = require('../models/locationModel');
var categorie = require('../models/categorieModel');
const fileUpload = require('express-fileupload');
const mysqlx = require('@mysql/xdevapi');
const { json } = require('body-parser');
var dateFormat = require('dateformat')
var formatNombre = require('../config/chiffreFormat');
const app = express.Router();
app.use(fileUpload());
app.get('/', (req, res)=>{
    voiture.read( (err, row) => {
        if (err){
            res.send({message:'erreur serveur'});
        } else{
            row.forEach(voiture=>{
                voiture.prixLocationL = formatNombre(voiture.prixLocation)
            })
            res.json(row);
        }
    });
})
app.get('/util', async (req, res) => {
    var contenu={
        categories : [],
        fourchettePrix : [],
        date : dateFormat(new Date(Date.now()), 'yyyy-mm-dd')
    };
    categorie.read((err, row) => {
        if(err){
            res.send({message:'serveur en cour de maintenance'})
        }else{
            //contenu.categorie = row;
            contenu.categories=row;
            console.log(contenu.categories);
            voiture.fourchettePrix((err1, row1)=> {
                if(err1){
                    res.send({message:'serveur en cour de maintenance'})
                }else{
                    contenu.fourchettePrix = row1[0];
                    console.log(contenu.fourchettePrix);
                   res.send({contenu});
                }
            })
        }
    })
})

app.post('/recherche', (req,res)=>{
    var aujourdhui = new Date(Date.now())
    aujourdhui = dateFormat(aujourdhui, 'yyyy-mm-dd');
    if(aujourdhui == req.body.dateDebut){
        voiture.read_disponible((err, row)=>{
            if(err){
                res.send({message:'serveur en cour de maintenance'})
            }else{
                res.send(row);
            }
        })
    }else{
        voiture.read_disponible_futur(req.body.dateDebut,(err, row) => {
            if(err){
                res.send({message : 'erreur serveur'});
            }else {
                res.json(row);
                console.log(row);
            }
        })
    }
})
app.get('/disponible', (req,res)=>{
    voiture.read_disponible((err, row) => {
        if(err){
            res.send({message:'erreur serveur'});
        }else {
            row.forEach(voiture=>{
                voiture.prixLocation = formatNombre(voiture.prixLocation)
                return voiture
            })
            res.json(row);
        }
    })
})
app.get('/information/:idVoiture', (req,res)=>{
    voiture.read_one(req.params.idVoiture,(err, row) => {
        if(err){
            res.send({message:'erreur serveur'});
        }else {
            res.json(row[0]);
        }
    })
})
app.get('/:idVoiture', async (req, res) => {
    const idVoiture = req.params.idVoiture;
    images.read(idVoiture, (err, row)=>{
        if(err){
            res.send({message:'Erreur de serveur'});
        }else{
            res.send({images:row});
        }
    })
})

/*app.get('/:id_voiture', async (req, res) => {
    console.log("get image");
    const id_voiture = req.params.id_voiture;
    const image = await knex('images').where({numVoiture:id_voiture});
    if(image){
        console.log("hita");
        console.log(image);
        res.send(image);
    } else {
        console.log("tsy hita");
        res.send('No img');
    }
})*/
/*app.post('/', async (req, res) =>{

    voiture.creat(req.query, async (err)=>{
        if(err){
            res.send('err');
           }else{
               const voiture = {
                   id_voiture : req.query.id_voiture,
                   immatriculation : req.query.immatriculation,
                   couleur : req.query.couleur,
                   puissance : req.query.puissance,
                   kilometrage : req.query.kilometrage,
                   nbPlaces : req.query.nbPlaces,
                   etat : req.query.etat,
                   commentaire : req.query.commentaire
               }

               
           }
       })
    var contenu;
    var numVoiture = req.query.id_voiture;
    console.log(req.files.image)
    req.files.image.map( (file ) => {
        file.mv(__dirname+'/../../client/public/images/'+file.name);
        contenu = {
            'name' : file.name,
            'numVoiture' : req.query.id_voiture
        }
        images.create(contenu, (err) =>{
        })  
    })
})*/
app.post('/', async (req, res) =>{
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
    console.log(req.query)
    voiture.creat(JSON.parse(req.query.voiture), idUser,async (err, row)=>{
        if(err){
            res.send({message:"erreur lors de l' insertion de la voiture"});
           }else{
            res.send();
           }
       })
});
app.delete('/',function(req,res){
    
    console.log(parseInt(req.query.idVoiture));
   voiture.delete(parseInt(req.query.idVoiture), (err) =>{
        if (err) {
            res.send({message:'erreur de serveur'});
        }else{
            res.send()
        }
    });
})

app.put('/', function async (req, res){
    var idUser = ''
    if(req.session.employer) idUser = req.session.employer.idEmployer;
   
    console.log(req);
    const contenu = JSON.parse(req.query.model);
    console.log(req.query.images_a_supprimer);

    voiture.update(contenu, idUser, async (err) => {
        if(err){
            res.send({message:'erreur lors de la modification de voiture'})
        }else{
            res.send()
        }
    });
   
})
app.delete('/', (req, res) => {
    voiture.delete(req.query.idVoiture);
    res.send();
})
module.exports = app;
