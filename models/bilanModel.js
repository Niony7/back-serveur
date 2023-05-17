var connection = require('../config/connection_db');

class Bilan {
    static read_bilan_entreDate(dateDebut, dateFin,next){
        connection.query(" SELECT LVRA.*, VT.visiteTechnique FROM "
        +"(SELECT idVoiture, SUM(coutVisiteTechnique) as visiteTechnique FROM visiteTechnique "
        +"where datePayementVisiteTechnique between ? and ? group by idVoiture) AS VT "
        +"RIGHT JOIN "
        +"(SELECT LVR.*, A.assurance FROM "
        +"(SELECT idVoiture, SUM(coutAssurance)as assurance FROM assurance "
        +"WHERE datePayementAssurance between ? and ? group by idVoiture) As A "
        +"RIGHT JOIN "
        +"(SELECT LV.*, R.reparation FROM "
        +"(SELECT idVoiture ,SUM(coutReparation)as reparation FROM reparation "
        +"WHERE dateReparation  between ? and ? group by idVoiture) AS R "
        +"RIGHT JOIN "
        +"(SELECT V.idVoiture, V.immatriculation,COUNT(nombreJour) as nombreLocation, SUM(nombreJour) As cumulJour, SUM(recette) as recette FROM "
        +"(SELECT idVoiture,nombreJour, coutLocationJournalier, (nombreJour*coutLocationJournalier) As recette "
        +"FROM location WHERE dateDebut between ? and ?) AS L "
        +"RIGHT JOIN voiture AS V ON V.idVoiture=L.idVoiture  group by V.idVoiture) AS LV "
        +"ON LV.idVoiture=R.idVoiture) As LVR "
        +"ON LVR.idVoiture = A.idVoiture) AS LVRA "
        +"ON LVRA.idVoiture = VT.idVoiture "
        ,[dateDebut, dateFin, dateDebut, dateFin, dateDebut, dateFin, dateDebut, dateFin],(err, row) =>{
           if (err) throw err;
           next(err, row);
        })
    }
}
/*
static read_bilan_entreDate(dateDebut, dateFin,next){
        connection.query("SELECT X.idVoiture, X.immatriculation, X.nombreLocation, X.nombreJour, X.recette, Y.coutAssurance, "
            +"Y.coutReparation, Y.coutVisiteTechnique FROM "
            +"(SELECT V.idVoiture, V.immatriculation, LVR.nombreLocation, LVR.nombreJour, LVR.recette from voiture As V " 
            +"LEFT OUTER JOIN "
            +"(SELECT  LV.idVoiture, LV.immatriculation,COUNT(LV.idVoiture) As nombreLocation, SUM(LV.nombreJour) As nombreJour,SUM(LV.recette) As recette from "
            +"(SELECT L.dateDebut, L.nombreJour, L.coutLocationJournalier, V.idVoiture, "
            +"V.immatriculation ,(L.nombreJour*L.coutLocationJournalier) As recette FROM location As L LEFT JOIN voiture As V ON L.idVoiture = V.idVoiture WHERE "
            +" L.dateDebut BEETWEEN ? AND ?) As LV) As LVR "
            +"ON V.idVoiture = LVR.idVoiture) X LEFT OUTER JOIN "
            +"( "
            +"SELECT VRA.idVoiture, VRA.coutReparation, VRA.coutAssurance, VT.datePayementVisiteTechnique,SUM(VT.coutVisiteTechnique) as coutVisiteTechnique FROM "
            +"(SELECT VR.idVoiture, VR.coutReparation, A.DatePayementAssurance,SUM(A.coutAssurance) As coutAssurance FROM "
            +"(SELECT V.idVoiture, R.dateReparation ,SUM(R.coutReparation) As coutReparation FROM voiture As V LEFT JOIN "
            +"reparation As R ON V.idVoiture = R.idVoiture WHERE R.dateReparation BEETWEEN ? AND ?) AS VR LEFT JOIN assurance As A ON "
            +"VR.idVoiture = A.idVoiture WHERE A.DatePayementAssurance BEETWEEN ? AND ? ) As VRA "
            +"LEFT JOIN visitetechnique As VT ON VRA.idVoiture = VT.idVoiture WHERE VT.datePayementVisiteTechnique BEETWEEN ? AND ? "
            +") AS Y ON X.idVoiture = Y.idVoiture ", 
            [dateDebut, dateFin, dateDebut, dateFin, dateDebut, dateFin, dateDebut, dateFin],(err, row) =>{
           if (err) throw err;
           next(err, row);
        })
    }
*/


module.exports = Bilan;