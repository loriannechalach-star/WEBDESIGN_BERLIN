//Afficher le graphique de Alaska et heroine par défaut
CRITERIA_STATE = "Alaska";
fetch('data2.json')
    .then((response) => response.json())
    .then((dataFetched) => {
 // on définis la plage d'années de 2015 à 2023
 const yearRange = Array.from({ length: 9 }, (_, index) => (2015 + index).toString());

 // on definit l'indicateur comme Methadone ou heroine
 const CRITERIA_INDICATOR = 'Heroin (T40.1)';

 // on stocke la somme dans un tableau
 const sumValuesByYear = Array(yearRange.length).fill(0); 

 // on filtre en fonction des critères
 dataFetched.forEach(d => {
     if (
         yearRange.includes(d.Year) &&
         d && d["State Name"] === CRITERIA_STATE &&
         d.Indicator === CRITERIA_INDICATOR
     ) {
         // Convertissez la valeur de données en nombre
         const numericValue = parseFloat(d["Data Value"].replace(',', ''));
         // remplace les NaN en 0 
         const yearIndex = yearRange.indexOf(d.Year);
         if (!isNaN(numericValue)) {
             sumValuesByYear[yearIndex] += numericValue;
            //  console.log(sumValuesByYear)
         }
     }
 });


    const dataPoints = yearRange.map((year, index) => ({
        x: parseInt(year, 10), // Utilisez parseInt pour obtenir un nombre entier mais ça marche pas 
        y: sumValuesByYear[index]
    }));
    dataPoints.unshift({ x:2015, y: 0 });

    dataPoints.push({ x: 2023, y: 0 })

    // Utilisez D3.js pour créer un graphique en ligne
    const svg = d3.select('.graphique');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(dataPoints, d => d.x));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(dataPoints, d => d.y)]);

    const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .curve(d3.curveLinearClosed);

    // Effacez le contenu existant du groupe
        svg.select(".graphGroup").remove();


    // Ajoutez un groupe pour le tracé du graphe
    const graphGroup = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('class',"graphGroup");
   


    // Ajoutez la ligne du graphique avec le dégradé
    const linePath = graphGroup.append('path')
    .data([dataPoints])
    .attr('class', 'line')
    .attr('d', line)
    .style('stroke', 'white') //  dégradé
    .style('stroke-width', 3) // épaisseur du trait
    .attr('fill', 'url(#line-gradient)');

    // Création et Ajout du dégradé au SVG
    svg.append("defs").append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y(0))
        .attr("x2", 0).attr("y2", y(d3.max(dataPoints, d => d.y)))
        .selectAll("stop")
        .data([
            { offset: "0%", color: "#e42a2a00" },
            { offset: "50%", color: "#da5a587a" },
            { offset: "100%", color: "#ed8240d8" }
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    // pour obtenir la longueur totale du chemin
    const totalLength = linePath.node().getTotalLength();

    // Ajout de l'animation du tracé
    linePath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500) // Durée de l'animation en millisecondes
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    // Ajout des cercles pour chaque point de données
    graphGroup.selectAll('circle')
        .data(dataPoints)
        .enter().append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 4) // Rayon du cercle
        .attr('fill', 'white') // Couleur du cercl
        .style('stroke', 'url(#line-gradient)')
        .style('stroke-width', 3); // épaisseur du trait

    // Ajout des axes x et y
    graphGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .style('fill','white')
        .selectAll('text')
        .style('fill', 'white') 
        .style('font-size', '1rem'); 
        

    graphGroup.append('g')
        .call(d3.axisLeft(y))
        .attr('fill', 'white')
        .selectAll('text')
        .style('fill', 'white') 
        .style('font-size', '1rem'); 

        d3.select(".graphiqueboutons p")
        .text("Heroine in " + CRITERIA_STATE)

    
});

function tracergraph () {//fonction qui trace le graphique
//on récupère les etats choisis
CRITERIA_STATE = this.id;
fetch('data2.json')
    .then((response) => response.json())
    .then((dataFetched) => {
 // on définis la plage d'années de 2015 à 2023
 const yearRange = Array.from({ length: 9 }, (_, index) => (2015 + index).toString());

 // on definit l'indicateur comme Methadone ou heroine
 const CRITERIA_INDICATOR = 'Heroin (T40.1)';

 // on stocke la somme dans un tableau
 const sumValuesByYear = Array(yearRange.length).fill(0); 

 // on filtre en fonction des critères
 dataFetched.forEach(d => {
     if (
         yearRange.includes(d.Year) &&
         d && d["State Name"] === CRITERIA_STATE &&
         d.Indicator === CRITERIA_INDICATOR
     ) {
         // Convertissez la valeur de données en nombre
         const numericValue = parseFloat(d["Data Value"].replace(',', ''));
         // remplace les NaN en 0 
         const yearIndex = yearRange.indexOf(d.Year);
         if (!isNaN(numericValue)) {
             sumValuesByYear[yearIndex] += numericValue;
            //  console.log(sumValuesByYear)
         }
     }
 });


    const dataPoints = yearRange.map((year, index) => ({
        x: parseInt(year, 10), // Utilisez parseInt pour obtenir un nombre entier mais ça marche pas 
        y: sumValuesByYear[index]
    }));

    dataPoints.unshift({ x:2015, y: 0 });

    dataPoints.push({ x: 2023, y: 0 })

    //  D3.js pour créer un graphique en ligne
    const svg = d3.select('.graphique');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(dataPoints, d => d.x));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(dataPoints, d => d.y)]);

    const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .curve(d3.curveLinearClosed);

    // Effacez le contenu existant du groupe
        svg.select(".graphGroup").remove();


    // Ajoutez un groupe pour le tracé du graphe
    const graphGroup = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('class',"graphGroup");
   


    // Ajoutez la ligne du graphique avec le dégradé
    const linePath = graphGroup.append('path')
    .data([dataPoints])
    .attr('class', 'line')
    .attr('d', line)
    .style('stroke', 'white') //  dégradé
    .style('stroke-width', 3) // épaisseur du trait
    .attr('fill', 'url(#line-gradient)');

    // Création et Ajout du dégradé au SVG
    svg.append("defs").append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y(0))
        .attr("x2", 0).attr("y2", y(d3.max(dataPoints, d => d.y)))
        .selectAll("stop")
        .data([
            { offset: "0%", color: "#E42A2A" },
            { offset: "50%", color: "#DA5B58" },
            { offset: "100%", color: "#ED8240" }
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    // pour obtenir la longueur totale du chemin
    const totalLength = linePath.node().getTotalLength();

    // Ajout de l'animation du tracé
    linePath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500) // Durée de l'animation en millisecondes
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    // Ajout des cercles pour chaque point de données
    graphGroup.selectAll('circle')
        .data(dataPoints)
        .enter().append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 4) // Rayon du cercle
        .attr('fill', 'white')// Couleur du cercl
        .style('stroke', 'url(#line-gradient)')
        .style('stroke-width', 3); // épaisseur du trait


    // Ajout des axes x et y
    graphGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .style('fill','white')
        .selectAll('text')
        .style('fill', 'white') 
        .style('font-size', '1rem'); 
        

    graphGroup.append('g')
        .call(d3.axisLeft(y))
        .attr('fill', 'white')
        .selectAll('text')
        .style('fill', 'white') 
        .style('font-size', '1rem'); 

        d3.select(".graphiqueboutons p")
        .text("Heroine in " + CRITERIA_STATE)

    
});

        // au moment du clique sur la carte on descend vers le graphe correspondant
        document.querySelector('.graph').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

function tracedrogue () {//fonction qui trace le graphique
    //on récupère l'indicateur choisis
    const CRITERIA_INDICATOR = this.id;
    
    fetch('data2.json')
        .then((response) => response.json())
        .then((dataFetched) => {
            
     // on définis la plage d'années de 2015 à 2023
     const yearRange = Array.from({ length: 9 }, (_, index) => (2015 + index).toString());
    
     // on stocke la somme dans un tableau
     const sumValuesByYear = Array(yearRange.length).fill(0); 
    
     // on filtre en fonction des critères
    dataFetched.forEach(d => {
         if (
             yearRange.includes(d.Year) &&
             d && d["State Name"] === CRITERIA_STATE &&
             d.Indicator === CRITERIA_INDICATOR
         ) {
             // Convertissez la valeur de données en nombre
             const numericValue = parseFloat(d["Data Value"].replace(',', ''));
             // remplace les NaN en 0 
             const yearIndex = yearRange.indexOf(d.Year);
             if (!isNaN(numericValue)) {
                 sumValuesByYear[yearIndex] += numericValue;
                //  console.log(sumValuesByYear)
             }
         }
     });

        const dataPoints = yearRange.map((year, index) => ({
            x: parseInt(year, 10), // Utilisez parseInt pour obtenir un nombre entier mais ça marche pas 
            y: sumValuesByYear[index]
        }));

        dataPoints.unshift({ x:2015, y: 0 });

        dataPoints.push({ x: 2023, y: 0 })

        console.log(dataPoints)

        //  créer un graphique en ligne
        const svg = d3.select('.graphique');
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;
    
        const x = d3.scaleLinear()
            .range([0, width])
            .domain(d3.extent(dataPoints, d => d.x));
    
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(dataPoints, d => d.y)]);
    
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveLinearClosed);
    
        // Effacer le contenu existant du groupe
            svg.select(".graphGroup").remove();
    
    
        // Ajout d' un groupe pour le tracé du graphe
        const graphGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class',"graphGroup");
       
    
    
        // Ajout de la ligne du graphique avec le dégradé
        const linePath = graphGroup.append('path')
            .data([dataPoints])
            .attr('class', 'line')
            .attr('d', line)
            .style('stroke', 'white') //  dégradé
            .style('stroke-width', 3) // épaisseur du trait
            .attr('fill', 'url(#line-gradient)');
    
        // Création et Ajout du dégradé au SVG
        svg.append("defs").append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceO'e(zé&nUse")
            .attr("x1", 0).attr("y1", y(0))
            .attr("x2", 0).attr("y2", y(d3.max(dataPoints, d => d.y)))
            .selectAll("stop")
            .data([
                { offset: "0%", color: "#E42A2A" },
                { offset: "50%", color: "#DA5B58" },
                { offset: "100%", color: "#ED8240" }
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);
    
        // pour obtenir la longueur totale du chemin
        const totalLength = linePath.node().getTotalLength();
    
        // Ajout de l'animation du tracé
        linePath
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500) // Durée de l'animation en millisecondes
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
           
    
        // Ajout des cercles pour chaque point de données
        graphGroup.selectAll('circle')
            .data(dataPoints)
            .enter().append('circle')
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', 4) // Rayon du cercle
            .attr('fill', 'white') // Couleur du cercl
            .style('stroke', 'url(#line-gradient)')
            .style('stroke-width', 3); // épaisseur du trait
            
            
    
        // Ajout des axes x et y
        graphGroup.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .style('fill','white')
            .selectAll('text')
            .style('fill', 'white') 
            .style('font-size', '1rem'); 
            
    
        graphGroup.append('g')
            .call(d3.axisLeft(y))
            .attr('fill', 'white')
            .selectAll('text')
            .style('fill', 'white') 
            .style('font-size', '1rem'); 

            // d3.select('.info h3')
            // .text(this.value);

            d3.select(".graphiqueboutons p")
        .text(this.value + " in " + CRITERIA_STATE)
    });
    
            // au moment du clique sur la carte on descend vers le graphe correspondant
            document.querySelector('.graph').scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log(CRITERIA_INDICATOR)
            console.log(CRITERIA_STATE)
    };
document.querySelectorAll('.map_image path, polygon').forEach(trigger => trigger.addEventListener('click',tracergraph));//tracer le graphique quand on clique sur le bouton

document.querySelectorAll(".graphiqueboutons input[type=button]").forEach(trigger => trigger.addEventListener('click',tracedrogue));//tracer le graphique quand on clique sur le bouton

//Afficher la bonne descritpion pour chaque drogue 

document.querySelectorAll(".graphiqueboutons input[type=button]").forEach(trigger => trigger.addEventListener('click', function () {
    document.querySelectorAll(".info div").forEach(div => {
        div.classList.remove("visible");
        div.classList.add("invisible");
    });
    document.querySelector(".info ." + this.value).classList.add("visible");
    document.querySelector(".info ." + this.value).classList.remove("invisible");
}));