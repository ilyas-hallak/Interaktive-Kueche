/**
 * Pot Klasse
 * @param context
 * @param sx
 * @param sy
 * @param w
 * @param h
 * @param imgPath
 * @param zOrder
 * @param draggable
 * @param name
 * @param animObj
 * @constructor
 */
function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name, animObj) {
    VisualRenderAnimation.call(this, context, sx, sy, w, h, imgPath, zOrder, animObj);

    // Konstanten
    this.MIN_TEMP = 21;
    this.MAX_TEMP = 100;
    this.COLD = 0;
    this.COOLING = 1;
    this.HEATING = 2;
    this.BOILING = 3;
    this.name = name;
    this.setDraggable(draggable);
    this.ingredient = [];
    this.temp = this.MIN_TEMP;
    // plate is default null
    this.pla = null;
    this.state = this.COLD;
    // save current time for animations
    this.lastUpdate = new Date().getTime();

    // wasser im topf
    this.hasWater = false;
}

Pot.prototype =  Object.create(VisualRenderAnimation.prototype);
Pot.prototype.constructor = Pot;

/**
 * hängt eine zutat an das zuaten array im pot
 * @param i typ Ingredient
 */
Pot.prototype.setIngredient = function (i) {
    this.ingredient.push(i);
}

/**
 * koch abkühlen
 */
Pot.prototype.coolDown = function() {
    // solange mindest temperatur nicht erreicht ist, topf temparatur runter zählen
    if(this.temp > this.MIN_TEMP){
        this.temp--;
    } else {
        // wenn mindesttemperatur erreicht ist, topf auf kalt stellen
        this.changeState(this.COLD);
    }
}

/**
 * topf aufheitzen
 */
Pot.prototype.heatUp = function() {
    // solange maximal temperatur nicht erreicht ist, topf temparatur runter zählen
    if(this.temp < this.MAX_TEMP) {
        this.temp++;
    } else {
        // wenn maximaltemperatur erreicht wurde, die animation auf boiling stellen
        this.changeState(this.BOILING);
    }
}

/**
 * wird in der kitchen.run aufgerufen
 * @param timestamp_run, aktueller timestamp der in der run mit übergeben wird
 */
Pot.prototype.update = function(timestamp_run) {
    // zeit differenz vom letzten aufruf berechnen
    // somit wird der topf nur alle 200ms aufgeheizt (abfragen weiter unten)
    var timedif = timestamp_run - this.lastUpdate;

    // Temperatur-Updates
    if(this.pla != null) {
        // Topf steht auf platte, platte ist an
        if(this.pla.state == this.pla.ON){
            // bei zeitdifferenz von 200 wird der koch weiter aufgeheizt
            if(timedif > 200) {
                this.heatUp();
                // übergebener timestamp für nächste berechnung speichern
                this.lastUpdate = timestamp_run;
            }
        }
    }
    // Topf steht auf platte, platte ist aus
    if(this.pla != null){
        if(this.pla.state == this.pla.OFF){
            if(timedif > 200){
                this.coolDown();
                this.lastUpdate = timestamp_run;
            }
        }
    }
    // Topf steht nicht auf platte
    // daher abkühlen lassen
    if(this.pla == null){
        if(timedif > 200){
            this.coolDown();
            this.lastUpdate = timestamp_run;
        }
    }
}

Pot.prototype.changeState = function(state) {
    switch(state) {
        case this.COLD:     this.changeAnimSequence("cold");
                            break;

        case this.COOLING:  this.changeAnimSequence("cooling");
                            break;

        case this.HEATING:  this.changeAnimSequence("heating");
                            //window.soundManager.playSound(window.soundManager.sounds.POT_HEATING, true);
                            break;

        case this.BOILING:  this.changeAnimSequence("boiling");
                            break;
    }
}

/**
 * Pot wird auf einer platte ausgerichtet
 *
 *
 * @param target - Plate, Zielplatte auf dem der Pot ausgerichtet werden soll
 */
Pot.prototype.align = function (target) {
    // unterscheidung von pfanne und normalen topf
    if(this.name == "pan1") {
        this.y = target.y - target.height - 5;
        this.x = target.x - 6;
    } else {
        this.y = target.y - target.height - 37;
        this.x = target.x - 12;
    }
    window.soundManager.playSound(window.soundManager.sounds.POT_ALIGN);
}
