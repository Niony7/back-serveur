var express = require('express');
const app = express.Router();
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '18Aina03Leon',
      database : 'base_location'
    }
  });

  app.get('/:idImage', async (req, res) => {
    const idImage = req.params.idImage;
    const image = await knex('images').where({idImage:idImage}).first();
    if(image){
        res.end(image.fichier);
    } else {
        res.send('No img');
    }
})

module.exports = app;