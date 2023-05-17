const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const voiture = require('./controlleurs/voitureControlleur');
const categorie = require('./controlleurs/categorieControlleur');
const assurance = require('./controlleurs/assuranceControlleur');
const visiteTechnique = require('./controlleurs/visiteTechniqueControlleur');
const reparation = require('./controlleurs/reparationControlleur');
const client = require('./controlleurs/clientControlleur');
const location = require('./controlleurs/locationControlleur');
const authentificationClient = require('./controlleurs/authentificationClientContolleur');
const authentification = require('./controlleurs/authentificationContolleur');
const employer = require('./controlleurs/employerControlleur');
const image = require('./controlleurs/imageControlleur');
const bilan = require('./controlleurs/bilanControlleur');
const louerVoiture = require('./controlleurs/faireLocation')
const auditCategorie = require('./controlleurs/auditCategorieController')
const auditVoiture = require('./controlleurs/auditVoitureController')
const auditLocation = require('./controlleurs/auditLocationController');
const app = express();
const port = 3001;

app.use(express.json())


app.use(cors({
  origin : ["http://localhost:3000", "http://localhost:3002"],
  credentials : true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(session({
  key : "email",
  secret : "motDePasse",
  resave : false,
  saveInitialed : false,
  cookie : {
    expire : 60 * 60 * 24
  }
}))
app.use('/voiture', voiture);
app.use('/categorie', categorie);
app.use('/assurance', assurance);
app.use('/visiteTechnique', visiteTechnique);
app.use('/reparation', reparation);
app.use('/client', client);
app.use('/location', location);
app.use('/authentificationClient', authentificationClient);
app.use('/authentification', authentification);
app.use('/image', image);
app.use('/employer', employer);
app.use('/bilan', bilan);
app.use('/louerVoiture', louerVoiture);
app.use('/auditCategorie', auditCategorie);
app.use('/auditVoiture', auditVoiture);
app.use('/auditLocation', auditLocation);

app.listen(port, () => console.log('Example app listenning on port $port!'));