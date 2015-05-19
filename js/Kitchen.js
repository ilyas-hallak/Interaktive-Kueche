function Kitchen(canvasId) {

    // browser fenster auf passende größe resizen, wichtig für die css klassen und den html elementen position: absolute;
    window.resizeTo(597, 1279);

    // get the right requestAnimationFrame for this browser
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    // create a new stage object
    this.stage = new Stage(canvasId);

    // init the soundmanager
    this.soundmanager = new SoundManager();

    // set the soundmanager global
    window.soundManager = this.soundmanager;

    // init MessageManager
    this.messageManager = new MessageManager();

    this.messageManager.showMessage("Herzlich Willkommen! W&auml;hle Links ein Rezept um zu Kochen! Viel Spa&szlig;!", this.messageManager.NORMAL);

    this.help = new Help();

    // lists
    // werden geladen und vom ResourceManager beschrieben
    this.pots = [];
    this.ingredient = [];
    this.plates = [];
    this.buttons = [];
    this.doors = [];
    this.faucet = null;
    this.videoManager = null;
    this.hood = null;

    // init alle resourcen aus der json
    this.resouceManager = new ResourceManager(this.stage, this);

    // init Rezeptemanager nachdem alles andere vorhanden ist
    this.rezeptemanager = new RezepteManager(this.stage, this.soundmanager, this.messageManager, this.videoManager);

    // timestamp für animationen
    this.timestampOnload = null;

    // Events
    this.stage.registerEvent('dragend', this);
    this.stage.registerEvent('click', this);
    this.stage.registerEvent('mouseover', this);
    this.stage.registerEvent('mouseout', this);



    // parameter this (kitchen itself) needed, because of the closure within the run function
    this.run(this);
}

Kitchen.prototype.onMouseover = function(e) {
    // change the cursor to pointer by the following elements
    if(e.target instanceof Door || e.target instanceof Button || e.target instanceof Faucet || e.target instanceof Pot || e.target instanceof Ingredient) {
        document.querySelector("canvas").setAttribute('style', 'cursor: pointer;')
    }
}

Kitchen.prototype.onMouseout = function(e) {
    // remove the pointer by mouse  out
    document.querySelector("canvas").setAttribute('style', 'cursor: normal;')
}


/**
 *
 * @param e Event
 */
Kitchen.prototype.onDragend = function (e) {
    // check ingredient obj
    if (e.target instanceof Ingredient) {
        var ing = e.target;
        // check all pots in the kitchen
        for (var i = 0; i < this.pots.length; i++) {
            if (this.isAbove(ing, this.pots[i])) {
                // check rezept step
                this.rezeptemanager.check(ing, this.pots[i]);
            }
        }
    }

    // topf bewegt
    if(e.target instanceof Pot == true) {
        var p = e.target;
        var isSet = false;
        // loop plates
        for(var i = 0; i < this.plates.length; i++) {
            // wenn der Pot auf eine Plate gestellt wurde
            if(this.isAbove(p, this.plates[i])) {
                p.align(this.plates[i]);
                this.rezeptemanager.check(p, this.plates[i]);
                isSet = true;
            } else {
                if(!isSet) {
                    p.pla = null;
                    p.update();
                }
            }
        }
        // loop pots
        for (var i = 0; i < this.pots.length; i++) {
            if(this.isAbove(this.pots[i], this.faucet)) {
                // rezept überprüfung
                this.rezeptemanager.check(null, this.pots[i]);
            }
        }

    }
}

Kitchen.prototype.onClick = function (ev) {
    // knopf gedrückt
    if (ev.target instanceof Button) {
        ev.target.changeState();
        this.rezeptemanager.check(null, ev.target);
    } else if(ev.target instanceof Door) {
        var door = ev.target;
        door.toggleState();

    }  else if(ev.target instanceof Faucet) {
        ev.target.toggleState();
    }
}


/**
 * check if two diffrent object one above the other
 * @param source object from type VisualRenderObject
 * @param target object from type VisualRenderObject
 * @returns {boolean} above or not
 */
Kitchen.prototype.isAbove = function (source, target) {

    // dürfen nur vom typ visualrenderobject sein
    if (!(source.__proto__ instanceof VisualRenderObject) || !(target.__proto__ instanceof VisualRenderObject)) {
        return false;
    }

    // check if the pot is under the faucet
    if(source instanceof Pot && target instanceof Faucet) {
        cx = source.getCenter().cx;
        cy = source.getCenter().cy;
        zone = target.getHitZone();

        if ((cx > zone.hx && cx < zone.hx + zone.hw) && ( cy > zone.hy && cy < zone.hy + zone.hh)) {
            // faucet is on?
            if(target.currentState == target.OPENED) {
                source.hasWater = true;
                return true;
            }
        }
    }

    // checken ob eine zutat über dem topf ist
    if (source instanceof Ingredient) {
        cx = source.getCenter().cx;
        cy = source.getCenter().cy;
        zone = target.getHitZone();

        if ((cx > zone.hx && cx < zone.hx + zone.hw) && ( cy > zone.hy && cy < zone.hy + zone.hh)) {
            return true;
        }
    }

    // checken ob ein pot über der platte
    if (source instanceof Pot) {

        // get the middlepoint of the pot bottom
        cx = source.getCenter().cx;
        cy = source.getCenter().cy + ( source.height / 2);

        // get hitzone from the plate
        zone = target.getHitZone();

        if ((cx > zone.hx && cx < zone.hx + zone.hw) && ( cy > zone.hy && cy < zone.hy + zone.hh)) {
            target.pot = source;
            source.pla = target;
            return true;
        }
    }
    return false;
}

/**
 * Animation loop
 * @param kit the kitchen object
 */
Kitchen.prototype.run = function (kit) {

    // aktuelle zeit für animation speichern
    var timestamp_run = new Date().getTime();

    // update vom pot
    for( var i = 0; i < this.pots.length; i++) {
        // update für die animation aufrufen
        this.pots[i].update(timestamp_run);

        // nur wenn der topf kocht soll nach dem rezept überprüft werden (resourcen sparender)
        if(this.pots[i].temp == this.pots[i].MAX_TEMP) {
            this.rezeptemanager.check(this.pots[i], this.pots[i].temp);
        }
    }

    // update der türen
    for( var i = 0; i < this.doors.length; i++){
        this.doors[i].update();
    }

    // videomanager updaten
    this.videoManager.update();

    // Always render after the updates
    kit.stage.render();

    // keep the loop going
    window.requestAnimationFrame(function(){ kit.run(kit);});

}



