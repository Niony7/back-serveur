function formatNombre(nombre){
  if(nombre==null){
    return 0
  }
    var chaine = String(parseFloat(nombre)), // convertit en chaine
        newChaine = '', // nouvelle chaine vide
        longueur = chaine.length, // longueur du nombre
        b = 0, // espacement
        i = 0, // boucle
        point = -1; // position virgule
        virgule = '00'; // initialise la virgule à vide
 
    // récupère sa position (-1 = inexistante)
    point = chaine.indexOf('.', 0);
     
    // si un point existe
    if(point != -1){
      virgule = chaine.substr(point+1, longueur); // stock nombre après le point
      chaine = chaine.substr(0, point); // supprime ceux après
      longueur -= (longueur-point); // recalcule la longueur
    }
     
    // permet de savoir quand faire l'espacement
    if(longueur%3 != 0){
      b = 3 - longueur%3;
    }
     
    // boucle la nouvelle chaine
    for(i=0; i < longueur; i++){
     
      // si atteint 3 nombre
      if(b == 3){
      newChaine += ' '; // espacement
      b = 0; // reset
      }
       
      b++;  // incrémente nombre
      newChaine += chaine[i]; // attribut le nombre à la new chaine
    }
    if(virgule != '00'){
        newChaine+= ','+virgule;
    }
     // rajoute la virgule et le nombre allant après
     
    // retourne le résultat
    return(newChaine);
}
module.exports = formatNombre;