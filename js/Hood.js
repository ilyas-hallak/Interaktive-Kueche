/**
 * Abzugshaube
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
function Hood(context, sx, sy, w, h, imgPath, zOrder, draggable, name){
    VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);

    this.name = name;
    this.setDraggable(draggable);
    this.ON = 1;
    this.OFF = 0;
    this.state = this.OFF;
}

Hood.prototype = new VisualRenderObject();
Hood.prototype.constructor = Hood;

/**
 * an/aus schalten der Abzugshaube
 */
Hood.prototype.toggle = function() {
    if(this.state == this.ON) {
        this.state = this.OFF;
        this.changeImage('images/Haube.png');
    } else {
        this.state = this.ON;
        this.changeImage('images/haube_licht.png');
    }
}
