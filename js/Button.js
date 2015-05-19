/**
 * Button für Hertplatten
 * @param context
 * @param sx
 * @param sy
 * @param w
 * @param h
 * @param imgPath
 * @param zOrder
 * @param draggable
 * @param name
 * @param plate
 * @param hood
 * @constructor
 */
function Button(context, sx, sy, w, h, imgPath, zOrder, draggable, name, plate, hood){
    VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
    this.name = name;
    this.setDraggable(draggable);
    this.ON = 1;
    this.OFF = 0;
    this.state = this.OFF;

    // verbindung zur platte
    this.pl = plate;

    // save the hood (abzugshaube) to turn it on and off
    this.hood = hood;
}
Button.prototype = new VisualRenderObject();
Button.prototype.constructor = Button;

/**
 * toggle the button on and off
 */
Button.prototype.changeState = function()
{
    window.soundManager.playSound(window.soundManager.sounds.BUTTON);

    if(this.state == this.ON) {
        this.state = this.OFF;
        this.changeImage('images/knob_off.png');
        this.hood.toggle();
        this.pl.off();
    } else {
        this.state = this.ON;
        this.changeImage('images/knob_on.png');
        this.hood.toggle();
        this.pl.heat();
    }
}