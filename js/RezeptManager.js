/**
 * laden und init der rezepte
 * @param stage
 * @param soundmanager
 * @param messageManager
 * @param videoManager
 * @constructor
 */
function RezepteManager(stage, soundmanager, messageManager, videoManager) {
    // html elemente
    this.rezeptListElement = document.querySelector('#Rezepte-list');
    this.rezeptListElement.className = "visible";
    this.rezeptDetailsElement = document.querySelector('#Rezepte-details');

    // headline
    this.rezeptHead = document.querySelector('#rezepte-head');

    this.soundManager = soundmanager;
    this.messageManager = messageManager;
    this.videoManager = videoManager;
    this.stage = stage;

    // daten speicher
    this.data = null;

    // aktueller schritt beim kochen
    this.step = 0;

    // index of the selected rezept
    this.rezeptIndex = 0;

    // current pot which is in use
    this.currentPotName = null;

    var self = this;
    Ajax.getJSON('http://localhost:8888/js/Rezepte.json', function(data) {
        self.data = data;
        self.renderRezepte();
    });

    // merker ob rezept schon gestartet wurde oder nicht
    // wichtig weil die check methode teils in der kitchen.run aufgerufen wird
    this.isStarted = false;
}

/**
 * html render der rezeptauswahl
 */
RezepteManager.prototype.renderRezepte = function() {
    var self = this;

    this.rezeptHead.innerHTML = "Rezeptauswahl:";

    this.data.Rezepte.forEach(function(rezept, i, arr) {
        var li = document.createElement('li');
        var taskText = document.createTextNode(rezept.Titel);
        li.appendChild(taskText);

        li.addEventListener('click', function(e) {
            self.rezeptDetailsElement.innerHTML = '';
            var tD = self.renderDetail(rezept);
            self.rezeptIndex = i;
            self.changeView();
        });

        self.rezeptListElement.appendChild(li);
    });
}

/**
 * rendern der rezeptdetails
 * @param rezept array - einzelnes rezept aus der json
 */
RezepteManager.prototype.renderDetail = function(rezept) {
    var self = this;

    this.rezeptHead.innerHTML = "Rezeptdetails:";

    // HEAD

    var headLine = document.createElement('p');
    headLine.appendChild(document.createTextNode(rezept.Titel));
    self.rezeptDetailsElement.appendChild(headLine);

    // ZUTATEN
    var zut = document.createElement('p');
    zut.innerHTML = "Zutaten: ";
    for(var i = 0; i < rezept.Zutaten.length; i++){
        if(i != 0) {
            zut.innerHTML += ', ';
        }
        zut.innerHTML += rezept.Zutaten[i];
    }
    self.rezeptDetailsElement.appendChild(zut);


    // DESC
    var desc = document.createElement('p');
    desc.innerHTML = rezept.Beschreibung;
    self.rezeptDetailsElement.appendChild(desc);


    // BACK BUTTON
    var backLink = document.createElement('a');
    backLink.innerHTML = "<button>Rezept aussuchen</button>";
    backLink.href = "javascript:void(0)";
    backLink.addEventListener('click', function() {
        // wieder auf die rezeptauswahl zurück
       self.changeView();
    });
    self.rezeptDetailsElement.appendChild(backLink);

    // START BUTTON
    var backLink = document.createElement('a');
    backLink.innerHTML = "<button>Los Gehts!</button>";
    backLink.href = "javascript:void(0)";
    backLink.addEventListener('click', function() {
        self.messageManager.showMessage("Du hast " + self.data.Rezepte[self.rezeptIndex].Titel + " gew&auml;hlt, Viel Spass!", self.messageManager.NORMAL);
        // die einzelnen schritte im Detail anzeigen
        self.showDetails();
        self.isStarted = true;
    });
    self.rezeptDetailsElement.appendChild(backLink);

    // VIDEO BUTTON
    // nur bei spaghetti bolognese anzeigen
   if(rezept.Titel == "Spaghetti Bolognese") {
       var backLink = document.createElement('a');
       backLink.innerHTML = "<button>Anleitung Anschauen/Ausblenden!</button>";
       backLink.href = "javascript:void(0)";
       backLink.id = "videoButton";
       backLink.addEventListener('click', function() {
           self.videoManager.toggle(self.videoManager.files.Welcome);
       });
       self.rezeptDetailsElement.appendChild(backLink);
   }
}

/**
 * die css klasse von rezeptauswahl und rezept details elementen auf visible/hidden toggeln
 */
RezepteManager.prototype.changeView = function() {
    if(this.rezeptListElement.className == "visible") {
        this.rezeptListElement.className = "hidden";
        this.rezeptDetailsElement.className = "visible";
    } else {
        this.rezeptDetailsElement.className = "hidden";
        this.rezeptListElement.className = "visible";
    }
}

/**
 * anzeigen der genauen schritte
 * ab hier startet der kochvorgang
 */
RezepteManager.prototype.showDetails = function() {
    var self = this;

    // ausgewähltes rezept holen
    var rezept = this.data.Rezepte[this.rezeptIndex];

    // einzelne schritte als liste rendern
    var ul = document.createElement('ul');
    for(var i = 0; i < rezept.Anleitung.length; i++){
        var schritt = document.createElement('li');
        var schrittText = document.createTextNode(rezept.Anleitung[i]);

        schritt.appendChild(schrittText);
        schritt.className = (i == 0) ? 'current' : 'muted';
        ul.appendChild(schritt);
    }
    this.rezeptDetailsElement.innerHTML = "";
    this.rezeptDetailsElement.appendChild(ul);

    // ABORT BUTTON
    var backLink = document.createElement('a');
    backLink.innerHTML = "<button>Kochvorgang Abbrechen!</button>";
    backLink.href = "javascript:void(0)";
    backLink.addEventListener('click', function() {

        self.messageManager.showMessage("Kochvorgang wurde abgebrochen! K&uuml;che wird neu geladen..." ,self.messageManager.NORMAL);

        // reset der küche beim abbrechen
        setTimeout(function() {
            location.reload();
        }, 10000);

        // show
        self.rezeptListElement.className = "hidden";
        self.changeView();

    });
    this.rezeptDetailsElement.appendChild(backLink);
}

/**
 * goes a step forward till the steps are finished
 */
RezepteManager.prototype.nextStep = function() {
    var self = this;

    var li = self.rezeptDetailsElement.getElementsByTagName('li');
    // reset the color of the current elements
    li[this.step].className = '';
    li[this.step].className = 'muted';

    // checken ob schon am ende der schritte angekommen
    if(this.step == this.data.Rezepte[this.rezeptIndex].Require.length - 1) {
        this.finish();
    }  else {
        // set the next element
        li[++this.step].className = 'current';
    }
}

/**
 * checkt den aktuellen schritt beim kochen
 * wird an enstsprechenden stellen eingebaut wo zwei objekte miteinander interagieren (zutat in topf usw.)
 * @param source Plate, Pot, Ingredient etc.
 * @param target Plate, Pot, Ingredient etc.
 */
RezepteManager.prototype.check = function(source, target) {
    if(this.isStarted) {
        // aktuellen schritt speichern
        var step = this.data.Rezepte[this.rezeptIndex].Require[this.step];
        var self = this;

        var isTargetOk = false;
        var isSourceOk = false;

        // beim ersten schritt den benutzten pot speichern
        // es wird danach nur noch auf currentpotname geprüft
        if(this.step == 0) {
            if(source instanceof Pot) {
                this.currentPotName = source.name;
            } else if(target instanceof Pot) {
                this.currentPotName = target.name;
            }
        }

        // AUF WASSER ÜBERPRÜFEN
        if(step.source == "water") {
            if(target instanceof Pot && target.hasWater) {
                isSourceOk = true;
                isTargetOk = true;
            }
        } else if(step.target == "ON") {
            // PLATTE AUF AN ÜBERPRÜFEN
            if(target instanceof Button) {
                if(target.state == target.ON) {
                    isSourceOk = true;
                    isTargetOk = true;
                }
            }
        } else {
            // SOURCE OBJ CHECKEN
            if(step.source instanceof Array) {
                // array durchlaufen und passenden pot raus suchen
                step.source.forEach(function(el) {
                    if(el == self.currenPotName && el instanceof Pot) {
                        isSourceOk = true;
                    } else if(el == source.name) {
                        isSourceOk = true;
                    }
                });
            } else if(source.name == step.source) {
                // ansonsten auf namen überprüfen ob der passt
                isSourceOk = true;
            }

            // TARGET OBJ CHECKEN
            if(step.target instanceof Array) {
                // array durchlaufen und passenden pot raus suchen
                var self = this;
                step.target.forEach(function(el) {
                    // als ziel muss es der richtige topf sein, daher mit currentPotName checken
                    if(target.name == self.currentPotName) {
                        isTargetOk = true;
                    } else if(el == target.name && !(target instanceof Pot)) {
                        // auf name soll nur geprüft werden wenn es kein pot ist
                        isTargetOk = true;
                    }
                });
            } else if(target.name == step.target) {
                // auf namen überprüfen
                isTargetOk = true;
            } else if(typeof step.target == "number") {
                // falls der Schritt eine temperatur erreichen ist
                if(target == step.target) {
                    isTargetOk = true;
                }
            }
        }

        // falls beide schritte ok sind
        if(isTargetOk && isSourceOk) {
            this.nextStep();

            // remove ingredient from stage
            if(source instanceof Ingredient && target instanceof Pot) {
                this.stage.removeFromStage(source);
                target.setIngredient(source);

                this.soundManager.playSound(this.soundManager.sounds.POT_INSERT);
                this.messageManager.showMessage("Weiter geht's!", this.messageManager.SUCCESS);
            }
        } else {
           // reset position of ingredient
           if(source instanceof Ingredient) {

               // zutat wieder auf bühne und auf ursprungsposition
               this.stage.addToStage(source);
               source.resetPosition();

               if(target instanceof Pot) {
                   // hinzugefügtes element aus ingredient array aus pot entfernen
                   target.ingredient =  target.ingredient.splice(0, target.ingredient.length - 1);
               }

               this.messageManager.showMessage("Das war falsch! Versuch's noch mal!", this.messageManager.ERROR);
            }
        }
    }
}

/**
 * wenn alle schritte fertig und richtig gemacht wurden wird diese methode aufgerufen
 */
RezepteManager.prototype.finish = function() {

    window.soundManager.playSound(window.soundManager.sounds.FINISH);

    // küche wird per page reload neu geladen
    setTimeout(function() {
        location.reload();
    }, 20000);

    alert("Du hast das Rezept erfolgreich beendet!, Die K&uuml;che wird in wenigen Augenblicken neu gestartet!");


    this.isStarted = false;
}