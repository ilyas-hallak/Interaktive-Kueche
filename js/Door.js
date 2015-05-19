/**
 * Allgemeine Tür klasse, für die Schranktüren und den Kühlschrank
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
function Door(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
    VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);

    this.name = name;
    this.setDraggable(draggable);
    this.oWidth = w;

    // zustands konstanten
    this.OPENED = 1;
    this.CLOSED = 0;

    // animations konstanten
    this.OPENING = 2;
    this.CLOSING = 3;

    // breite der geschlossenen Tür
    this.CLOSED_WIDTH = 10;

    this.currentState = this.CLOSED;
}

Door.prototype =  Object.create(VisualRenderObject.prototype);
Door.prototype.constructor = Door;

/**
 * toggle the state from closing and opening
 */
Door.prototype.toggleState = function() {
    if(this.currentState == this.OPENED) {
        this.changeState(this.CLOSING);
        window.soundManager.playSound(window.soundManager.sounds.DOOR_CLOSE);
    } else {
        this.changeState(this.OPENING);
        window.soundManager.playSound(window.soundManager.sounds.DOOR_OPEN);
    }
}

Door.prototype.changeState = function(state) {
    switch(state) {
        case this.OPENED:
            this.width = this.CLOSED_WIDTH;
            this.currentState = this.OPENED;
            break;
        case this.CLOSED:
            this.width = this.oWidth;
            this.currentState = this.CLOSED;
            break;
        case this.OPENING:
            this.currentState = this.OPENING;
            break;
        case this.CLOSING:
            this.currentState = this.CLOSING;
            break;
    }
}

/**
 * starts the animation if the current state is set
 * called from the kitchen.run method
 */
Door.prototype.update = function() {

    if(this.currentState == this.OPENING) {
        if(this.widh >= this.CLOSED_WIDTH) {
            // zählt bei jedem aufruf die türbreite -3
            this.width -= 3;
        } else {
            // wenn gewünschte breite this.CLOSED_WIDTH erreicht dann ist die tür offen
            this.changeState(this.OPENED);
        }
    } else if(this.currentState == this.CLOSING) {
        if(this.width <= this.oWidth) {
            // zählt bei jedem aufruf +10 der breite
            this.width += 10;
        } else {
            // wenn ursprungsbreite erreicht ist die tür geschlossen
            this.changeState(this.CLOSED);
        }
    }
}
