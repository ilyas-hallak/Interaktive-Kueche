/**
 * save the message element and init some message types  and sounds
 * @constructor
 */
function MessageManager() {
    this.element = document.querySelector("#message");

    // Message Types
    this.ERROR = 0;
    this.SUCCESS = 1;
    this.WARNING = 2;
    this.NORMAL = 3;

    // message sounds
    this.SOUND_NORMAL = window.soundManager.getSound(window.soundManager.sounds.MESSAGE_NORMAL);
    this.MESSAGE_ERROR = window.soundManager.getSound(window.soundManager.sounds.MESSAGE_ERROR);

}

/**
 * shows a message on the display
 * @param msg string Message
 * @param type this.MessageManager.ERROR, this.MessageManager.SUCCESS, this.MessageManager.WARNING, this.MessageManager.NORMAL
 */
MessageManager.prototype.showMessage = function(msg, type) {
    var self = this;

    // marquee für die laufschrift
    var text = document.createElement("marquee");
    text.innerHTML = msg;

    // farben definieren
    switch(type) {
        case this.ERROR:
            text.setAttribute('style', 'color: red;');
            this.MESSAGE_ERROR.play();
            break;
        case this.SUCCESS:
            text.setAttribute('style', 'color: green;');
            this.SOUND_NORMAL.play();
            break;
        case this.WARNING:
            text.setAttribute('style', 'color: orange;');
            this.SOUND_NORMAL.play();
            break;
        case this.NORMAL:
            text.setAttribute('style', 'color: white;');
            this.SOUND_NORMAL.play();
        default :
            text.setAttribute('style', 'color: white;');
            this.SOUND_NORMAL.play();

    }

    // vorherigen text löschen und neuen einfügen
    this.element.innerHTML = "";
    this.element.appendChild(text);

    // calc the time with the length of the message
    var time = msg.length * 1000;

    // reset the text
    window.setTimeout(function() {
        self.element.innerHTML = "";
    }, time);
}