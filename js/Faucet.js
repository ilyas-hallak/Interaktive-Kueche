/**
 * Wasserhahn
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
function Faucet(context, sx, sy, w, h, imgPath, zOrder, draggable, name, animObj) {
    VisualRenderAnimation.call(this, context, sx, sy, w, h, imgPath, zOrder, animObj);
    this.CLOSED = 0;
    this.OPENED = 1;

    // default state is closed
    this.currentState = this.CLOSED;

    this.sound = window.soundManager.getSound(window.soundManager.sounds.FAUCET, true);
}

Faucet.prototype =  Object.create(VisualRenderAnimation.prototype);
Faucet.prototype.constructor = Faucet;

/**
 * chage the current state and the animation
 * @param state - this.CLOSED, this.OPENED
 */
Faucet.prototype.changeState = function(state) {
    switch(state) {
        case this.OPENED:
            this.changeAnimSequence("opening");
            this.currentState = this.OPENED;
            break;
        case this.CLOSED:
            this.changeAnimSequence("closing");
            this.currentState = this.CLOSED;
            break;
    }
}

/**
 *  toggle the current state from this.OPENED and this.CLOSED
 */
Faucet.prototype.toggleState = function() {
    if(this.currentState == this.OPENED) {
        this.changeState(this.CLOSED);
        this.sound.pause();
    } else {
        this.changeState(this.OPENED);
        this.sound.play();
    }
}
