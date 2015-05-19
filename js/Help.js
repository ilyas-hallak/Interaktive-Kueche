/**
 * Hilfsklasse für den Hilfe-Layer
 * @constructor
 */
function Help() {
    this.ON = 1;
    this.OFF = 0;

    this.currentState = this.OFF;

    // html elemente speichern
    this.helpLayer = document.querySelector('#HelpLayer'); // layer wrapper
    this.helpContent = document.querySelector('#helpContent'); // content vom layer

    this.helpButton = document.querySelector('#HelpLayer img'); // button vom layer

    var self = this;

    // hilfe layer bei klicken an/aus schalten
    this.helpButton.addEventListener('click', function() {
        self.toggle();
    });

    this.helpContent.className = "hidden";
}

Help.prototype.toggle = function() {
    if(this.currentState == this.ON) {
        this.currentState = this.OFF;
        this.helpContent.className = "hidden";
        // die größe des layers verkleinern
        this.helpContent.setAttribute('style', 'height: 30px;');
    } else {
        this.currentState = this.ON;
        this.helpContent.className = "visible";
        // größe für den layer bestimmen um diesen quasi über die ganze Küche zu legen
        this.helpContent.setAttribute('style', 'height: 600px;');
    }
}