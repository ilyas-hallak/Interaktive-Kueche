/**
 * Daten werden geladen und initalisiert
 *
 * @param stage, verweis auf die stage von der kitchen.js
 * @param kitchen - kitchen.js object
 * @constructor
 */
function ResourceManager(stage, kitchen) {
    this.data = "";
    this.stage = stage;
    this.kitchen = kitchen;

    var self = this;
    Ajax.getJSON('http://localhost:8888/js/Resources.json', function(data) {
        self.data = data;
        self.init();
    });
}

/**
 * init all objects from the json file
 */
ResourceManager.prototype.init = function() {
    var self = this;

    // loop the resource array
    this.data.Resources.forEach(function(r, i, arr) {

        // hier wird das engültige objekt gespeichert
        var obj = "";

        // check object type (VisualRender, VisualAnimation)
        if(typeof r.animObj != "undefined") {
            // create the object over the global window context
            obj = new window[r.Obj](self.stage.getContext(), r.sx, r.sy, r.w, r.h, r.imgPath, r.zOrder, r.draggable, r.name, r.animObj);
        } else {
            var plateObj = null;
            var hoodObj = null;

            // auf plate angaben überprüfen überprüfen (wichtig bei buttons)
            if(typeof r.plate != "undefined") {
                self.kitchen.plates.forEach(function(plate, i, arr) {
                    if(r.plate == plate.name) {
                        plateObj =  plate;
                    }
                });
            }
            // auf abzugshauben angabe überprüfen (wichtig bei buttons)
            if((typeof r.hood != "undefined") || r.length) {
                hoodObj = self.kitchen.hood;
            }
           obj = new window[r.Obj](self.stage.getContext(), r.sx, r.sy, r.w, r.h, r.imgPath, r.zOrder, r.draggable, r.name, plateObj, hoodObj);
        }

        self.stage.addToStage(obj);

        // add to several array in the kitchen
        if(obj instanceof Pot) {
            self.kitchen.pots.push(obj);
        } else if(obj instanceof Ingredient) {
            self.kitchen.ingredient.push(obj);
        } else if(obj instanceof Plate) {
            self.kitchen.plates.push(obj);
        } else if(obj instanceof Button) {
            self.kitchen.buttons.push(obj);
        } else if(obj instanceof Door) {
            self.kitchen.doors.push(obj);
        }  else if(obj instanceof Faucet) {
            self.kitchen.faucet = obj;
        }  else if(obj instanceof VideoManager) {
            self.kitchen.videoManager = obj;
        }  else if(obj instanceof Hood) {
            self.kitchen.hood = obj;
        }
    });
}

