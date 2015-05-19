/**
 *
 * @param context
 * @param sx
 * @param sy
 * @param w
 * @param h
 * @param imgPath
 * @param zOrder
 * @param draggable
 * @param name
 * @constructor
 */
function Plate(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
    VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
    this.name = name;
    this.setDraggable(draggable);
    this.pot = null;
    this.state = this.OFF
    this.OFF = 0;
    this.ON = 1;
    this.imgPath = imgPath;
}

Plate.prototype = new VisualRenderObject();
Plate.prototype.constructor = Plate;

/**
 *  Platte an
 */
Plate.prototype.heat = function () {
    //  da verschiedene grafiken für vorne und hinten verwendet werden, muss es entsprechend abgefragt werden
    if(this.imgPath == 'images/platte_vorne.png') {
        this.changeImage("images/platte_vorne_on.png");
    } else {
        this.changeImage("images/platte_hinten_on.png");
    }

    this.state = this.ON;

    // wenn pot auf platte dann diesen zur heating animation bewegen
    if(this.pot != null) {
        this.pot.changeState(this.pot.HEATING)
    }
}

/**
 *    Platte aus
 */
Plate.prototype.off = function () {
    //  da verschiedene grafiken für vorne und hinten verwendet werden, muss es entsprechend abgefragt werden
    if(this.imgPath == 'images/platte_vorne.png') {
        this.changeImage("images/platte_vorne.png");
    } else {
        this.changeImage("images/platte_hinten.png");
    }

    this.state = this.OFF;

    // wenn pot auf platte dann diesen auf die cooling animation bewegen
    if(this.pot != null) {
        this.pot.changeState(this.pot.COOLING)
    }


}