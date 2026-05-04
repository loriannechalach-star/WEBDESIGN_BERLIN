// SCRIPT POUR CARTE 


const triggers = document.querySelectorAll('.map_image path, polygon');
const mini_cercle = document.querySelector('.mini_cercle');
const map = document.querySelector('.map')

function entree () { //Ce qui se passe quand la souris entre dans un etat
mini_cercle.classList.add('visible');
const etatcoords = this.getBoundingClientRect();//recuperer coordonnées de l'etat
const mapcoords = map.getBoundingClientRect();//récupérer les coordonnées de la carte

const coords = {
    top: (etatcoords.top - mapcoords.top) + (etatcoords.height/2)-8,
    left: (etatcoords.left - mapcoords.left) + (etatcoords.width/2)-8,
}; //le 8 correspond à la moitié de la taille du mini_cercle, pour bien le centrer
mini_cercle.style.setProperty('transform', `translate(${coords.left}px,${coords.top}px)`);//Le minicercle se place sur le bon etat au moment du hover

CRITERIA_STATE = this.id; //recupérer le nom de l'etat dans l'id de la carte
//Affichage de la description en fonction de l'etat
fetch('data2.json')
    .then((response) => response.json())
    .then((dataFetched) => {
        // console.log(dataFetched)

        let CRITERIA_YEAR = document.querySelector(".select_annee").value;
        const CRITERIA_INDICATOR = 'Number of Drug Overdose Deaths';
        // const CRITERIA_MONTH = 'April';

        let selecteurannee = document.querySelector(".select_annee")//détetce le changement de l'année
        selecteurannee.addEventListener('change', function (){
            CRITERIA_YEAR = document.querySelector(".select_annee").value;
        });

        const dataReduced = dataFetched.filter(d => {
            if (
                // d.Month === CRITERIA_MONTH &&
                d.Year === CRITERIA_YEAR &&
                d && d["State Name"] === CRITERIA_STATE &&
                d.Indicator === CRITERIA_INDICATOR
            ) return true
            else return false;
        })
        // console.log(dataReduced); //création d'un tableau filtré avec seulement les données qu'on a besoin

        const dataValues = dataReduced.map(d => (
            d && d["Data Value"] // Il y a un espace dans le fichier json donc il faut écrira comme ça
        ));
        // console.log(dataValues);//tableau avec seulement les valeurs qu'on a besoin

        // Fonction pour calculer la somme des valeurs du tableau
function calculerSomme(dataValues) {
    let somme = 0;
    // Parcourir le tableau et ajouter chaque valeur à la somme
    for (let i = 0; i < dataValues.length; i++) {
          somme += parseInt(dataValues[i]);
    }
  
    return somme;
  }
  // Appeler la fonction et afficher le résultat
  const resultat = calculerSomme(dataValues);
//   console.log("La somme des valeurs du tableau est : " + resultat);

        d3.select(".info_sup h3") //nom de l'etat
        .data(dataReduced)
        .text((d,i) => `${d && d["State Name"]}` );

        d3.select(".info_sup p") //description
        .data(dataReduced)
        .html((d) => "<p>" + resultat + " overdose deaths <br> in " + d.Year);

        d3.select(".cercle p") //cercle
        .data(dataReduced)
        .text(resultat);
    })
}

function sortie () {//Ce qui se passe quand la souris sort dans l'etat
    mini_cercle.classList.remove('visible');
}


triggers.forEach(trigger => trigger.addEventListener('mouseenter',entree));//quand la souris entre déclenche la fonction entree
// triggers.forEach(trigger => trigger.addEventListener('mouseenter',animation));//quand la souris entre déclenche la fonction animation
triggers.forEach(trigger => trigger.addEventListener('mouseleave',sortie)); //idem pour la fonction sorite



//réparer Florida, pour bien centrer le mini_cercle parce que l'etat a une forme particulière
const florida = document.getElementById('Florida')
florida.addEventListener('mouseenter', function (){
    mini_cercle.classList.add('visible');

const etatcoords = this.getBoundingClientRect();
const mapcoords = map.getBoundingClientRect();

const coords = {
    top: (etatcoords.top - mapcoords.top) + (etatcoords.height/2)-8,
    left: (etatcoords.left - mapcoords.left) + (etatcoords.width/1.3)-8,
}; //le 8 correspond à la moitié de la taille du mini_cercle, pour bien le centrer
mini_cercle.style.setProperty('transform', `translate(${coords.left}px,${coords.top}px)`);
});

//----------------------------------------------------------------

//Couleurs sur la carte
//On trie le tableau en fonction de l'année et l'indicateur. Ensuite pour chaque état on fait la somme des value. Et si la value est entre ça et ça alors fill de cette couleur
fetch('data2.json')
    .then((response) => response.json())
    .then((dataFetched) => {

        let CRITERIA_YEAR = document.querySelector(".select_annee").value;
        const CRITERIA_INDICATOR = 'Number of Drug Overdose Deaths';
        // const CRITERIA_MONTH = 'April';

        let selecteurannee = document.querySelector(".select_annee")//détetce le changement de l'année
        //Pour que au moment ou on modifie le select, les couleurs changent
        selecteurannee.addEventListener('change', function (){
            CRITERIA_YEAR = document.querySelector(".select_annee").value;
            // console.log(CRITERIA_YEAR)

            d3.selectAll(".map_image path, polygon").each(function (d, i) {
                CRITERIA_STATE = this.id;
                // console.log(CRITERIA_STATE)
                const dataReduced = dataFetched.filter(d => {
                    if (
                        // d.Month === CRITERIA_MONTH &&
                        d.Year === CRITERIA_YEAR &&
                        d && d["State Name"] === CRITERIA_STATE &&
                        d.Indicator === CRITERIA_INDICATOR
                    ) return true
                    else return false;
                })
                // console.log(dataReduced);
        
                const dataValues = dataReduced.map(d => (
                    d && d["Data Value"] // Il y a un espace dans le fichier json donc il faut écrira comme ça
                ));
                // console.log(dataValues);
                function calculerSomme(dataValues) {
                    let somme = 0;
                    // Parcourir le tableau et ajouter chaque valeur à la somme
                    for (let i = 0; i < dataValues.length; i++) {
                          somme += parseInt(dataValues[i]);
                    }
                  
                    return somme;
                  }
                  // Appeler la fonction et afficher le résultat
                  const resultat = calculerSomme(dataValues);
                //   console.log("La somme des valeurs du tableau est : " + resultat);
    
                  if (resultat < 1000) {
                    d3.select(this).style("fill", "#ABF3E9");
                } else if (resultat >= 1000 && resultat < 5000) {
                    d3.select(this).style("fill", "#80C4C3");
                } else if (resultat >= 5000 && resultat < 10000) {
                    d3.select(this)
                    .style("fill","#5C9DA4");
                  } else if (resultat >= 10000 && resultat < 20000) {
                    d3.select(this)
                    .style("fill","#4D8B96");
                  } else if (resultat >= 20000 && resultat < 30000) {
                    d3.select(this)
                    .style("fill","#3A7581");
                  } else {
                    d3.select(this)
                    .style("fill","#1F5766");
                  };
    
            });
        });

        //Pour que les couleurs soient déjà affichés avant qu'on change le select
        d3.selectAll(".map_image path, polygon").each(function (d, i) {
            CRITERIA_STATE = this.id;
            // console.log(CRITERIA_STATE)
            const dataReduced = dataFetched.filter(d => {
                if (
                    // d.Month === CRITERIA_MONTH &&
                    d.Year === CRITERIA_YEAR &&
                    d && d["State Name"] === CRITERIA_STATE &&
                    d.Indicator === CRITERIA_INDICATOR
                ) return true
                else return false;
            })
            // console.log(dataReduced);
    
            const dataValues = dataReduced.map(d => (
                d && d["Data Value"] // Il y a un espace dans le fichier json donc il faut écrira comme ça
            ));
            // console.log(dataValues);
            function calculerSomme(dataValues) {
                let somme = 0;
                // Parcourir le tableau et ajouter chaque valeur à la somme
                for (let i = 0; i < dataValues.length; i++) {
                      somme += parseInt(dataValues[i]);
                }
              
                return somme;
              }
              // Appeler la fonction et afficher le résultat
              const resultat = calculerSomme(dataValues);
            //   console.log("La somme des valeurs du tableau est : " + resultat);

              if (resultat < 1000) {
                d3.select(this).style("fill", "#ABF3E9");
            } else if (resultat >= 1000 && resultat < 5000) {
                d3.select(this).style("fill", "#80C4C3");
            } else if (resultat >= 5000 && resultat < 10000) {
                d3.select(this)
                .style("fill","#5C9DA4");
              } else if (resultat >= 10000 && resultat < 20000) {
                d3.select(this)
                .style("fill","#4D8B96");
              } else if (resultat >= 20000 && resultat < 30000) {
                d3.select(this)
                .style("fill","#3A7581");
              } else {
                d3.select(this)
                .style("fill","#1F5766");
              };

        });
    })