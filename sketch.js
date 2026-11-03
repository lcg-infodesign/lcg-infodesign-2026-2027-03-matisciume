let myTable;

let maxPortata = 0;
let minPortata = 1000000;
let maxArea = 0;
let minArea = 100000000;
let distanza = 20;

// colori dei continenti
let continenti = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
let nomiItaliani = ["Africa", "Asia", "Europa", "Nord America", "Sud America", "Oceania"];
let colori = ["#E07A1F", "#D1495B", "#7B4FC9", "#2F6FDE", "#2E9E5B", "#ef17b9"];

// margini del grafico
let margine = 80;
let larghezzaLegenda = 50;
let spazioLegenda = 220; // spazio a sinistra per la legenda

async function setup() {
  //carico i dati
  myTable = await loadTable("assets/rivers_world - Data.csv", ",", "header")

  createCanvas(windowWidth, windowHeight);

  for(let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++){
    //carico portata e area del bacino
    let portata = myTable.getNum(numRiga, "discharge")
    let area = myTable.getNum(numRiga, "area")

    if(portata > maxPortata){ maxPortata = portata }
    if(portata < minPortata){ minPortata = portata }
    if(area > maxArea){ maxArea = area }
    if(area < minArea){ minArea = area }
  }

  console.log("portata min e max: ", minPortata, maxPortata)
  console.log("area min e max: ", minArea, maxArea)
}

function draw() {
  if(!myTable){ return }

  background("#ede6d4");

  // grafico inscritto in un quadrato
  let spazioLargo = width - spazioLegenda - margine;
  let spazioAlto = height - (margine + 30) - margine;
  let lato = min(spazioLargo, spazioAlto);

  // quadrato centrato
  let sinistra = spazioLegenda + (spazioLargo - lato) / 2;
  let destra = sinistra + lato;
  let alto = margine + 30 + (spazioAlto - lato) / 2;
  let basso = alto + lato;
  let centroX = (sinistra + destra) / 2;
  let centroY = (alto + basso) / 2;

  // titolo
  noStroke();
  fill("#1E2A38");
  textSize(40);
  textStyle(BOLD)
  textAlign(LEFT, TOP);
  text("Portata ed estensione dei fiumi del mondo", 25, 15);

  // quadrato tratteggiato
  noFill();
  stroke("#a9a9a971");
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 6]);
  rect(sinistra, alto, lato, lato);
  drawingContext.setLineDash([]);  

  // croce
  stroke("#1E2A38");
  strokeWeight(2);
  line(sinistra, centroY, destra, centroY);
  line(centroX, alto, centroX, basso);

  // diciture degli assi
  noStroke();
  fill("#1E2A38");
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text("GRANDE PORTATA", centroX, alto - 6);
  textAlign(CENTER, TOP);
  text("SCARSA PORTATA", centroX, basso + 6);
  textAlign(LEFT, BOTTOM);
  text("AREA POCO ESTESA", sinistra - 130, centroY + 7);
  textAlign(RIGHT, BOTTOM);
  text("AREA MOLTO ESTESA", destra + 137, centroY + 7);
  textStyle(NORMAL);

  let rigaHover = -1;

  for(let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++){

    let portata = myTable.getNum(numRiga, "discharge")
    let area = myTable.getNum(numRiga, "area")
    let continente = myTable.getString(numRiga, "continent")
    if(continente == "Australia"){ continente = "Oceania" }

    // scala logaritmica, perché i valori sono molto diversi tra loro
    let x = map(log(area), log(minArea), log(maxArea), sinistra + distanza, destra - distanza);
    let y = map(log(portata), log(minPortata), log(maxPortata), basso - distanza, alto + distanza);

    // colore in base al continente
    let indice = continenti.indexOf(continente);
    fill(colori[indice]);
    stroke('#ffffff');
    strokeWeight(1);
    circle(x, y, 10);

    // controllo se il mouse è sopra il fiume
    if(dist(mouseX, mouseY, x, y) < 6){
      rigaHover = numRiga;
    }
  }

  disegnaLegenda();

  // informazioni sul fiume sotto il mouse
  if(rigaHover >= 0){
    let nome = myTable.getString(rigaHover, "name")
    let paesi = myTable.getString(rigaHover, "countries")
    let portata = myTable.getNum(rigaHover, "discharge")
    let area = myTable.getNum(rigaHover, "area")
    let lunghezza = myTable.getNum(rigaHover, "length")
    let continente = myTable.getString(rigaHover, "continent")

    let testo = nome + "\n" +
      "Continente: " + continente + "\n" +
      "Portata: " + portata + " m³/s\n" +
      "Bacino: " + area + " km²\n" +
      "Lunghezza: " + lunghezza + " km\n" +
      "Paesi: " + paesi;

    let boxX = mouseX + 15;
    let boxY = mouseY + 15;
    if(boxX + 260 > width){ boxX = mouseX - 275 }
    if(boxY + 130 > height){ boxY = mouseY - 145 }

    fill(255);
    stroke("#1E2A38");
    rect(boxX, boxY, 260, 130, 6);
    noStroke();
    fill("#1E2A38");
    textAlign(LEFT, TOP);
    textSize(12);
    text(testo, boxX + 10, boxY + 10, 240, 115);
  }
}

function disegnaLegenda(){
  let x = larghezzaLegenda;
  let y = margine + 30;

  noStroke();
  fill("#1E2A38");
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text("LEGENDA", x, y);
  textStyle(NORMAL);
  textSize(12);

  for(let i = 0; i < continenti.length; i++){
    fill(colori[i]);
    circle(x + 6, y + 40 + i * 24, 10);
    fill("#1E2A38");
    textAlign(LEFT, CENTER);
    text(nomiItaliani[i], x + 20, y + 40 + i * 24);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}