/**
 * init the path and the soundpool
 * @constructor
 */
function SoundManager() {
    this.path = 'audio/';
    this.soundPool = {};
    this.loop = false;

    this.initPool();
}

/**
 * get a no playing sound by name and play this
 * @param name e.g. POT_INSERT, or other constants from the sounds Object
 */
SoundManager.prototype.getSound = function(name, loop) {
    this.loop = loop || false;
    var snd = this.getSoundFromPool(name);

    if(this.loop) {
        snd.setAttribute('loop', true);
    }

    return snd;
}

/**
 * gets a no playing sound from soundpool and plays this
 * @param name - this.sounds.POT_INSERT usw.
 * @param loop boolean
 * @returns {an}
 */
SoundManager.prototype.playSound = function(name, loop) {
    this.loop = loop || false;

    var snd = this.getSoundFromPool(name);

    if(this.loop) {
        snd.setAttribute('loop', true);
    }

    snd.play();

    return snd;
}

/**
 *  init the soundpool and adds each sound 4 times
 */
SoundManager.prototype.initPool = function() {
    for (var s in this.sounds){
        this.soundPool[s] = [];
        for(i = 0;i<4;i++) {
            this.soundPool[s].push(this.createAudioElement(this.sounds[s]));
        }
    }
}

/**
 * data table with the different sounds
 * @type {{POT_INSERT: string, POT_SHAKE: string}}
 */
SoundManager.prototype.sounds = {
        FAUCET:         'faucet.wav',
        MESSAGE_NORMAL: 'message_normal.wav',
        MESSAGE_ERROR:  'message_error.wav',
        POT_INSERT:     'pot-insert.wav',
        POT_HEATING:    'pot-heating-up-2.wav',
        POT_ALIGN:      'click.wav',
        DOOR_OPEN:      'door-10-open.wav',
        DOOR_CLOSE:     'door-10-close.wav',
        FREEZER_CLOSE:  'freezer-close-1.wav',
        FREEZER_OPEN:   'freezer-open-1.wav',
        FAN:            'kitchen-fan-1.wav',
        FINISH:         'finish.wav',
        BUTTON:         'button.wav'

};

/**
 * generate the html audio element
 * @param fileName
 * @returns {HTMLElement} Audio
 * TODO add XBrowser functions
 */
SoundManager.prototype.createAudioElement = function(fileName) {
    var audio = document.createElement("audio");
    audio.setAttribute('src', this.path + fileName);
    audio.setAttribute('type', "audio/wav");
    audio.setAttribute('controls', false);

    if(this.loop) {
        audio.setAttribute('loop', true);
    }
    return audio;
}

/**
 * get a sound from the soundpool which has 4 sounds from each sound
 * @param name Sound name e.g.: POT_INSERT
 * @returns an audio element from soundpool which is not in playing
 */
SoundManager.prototype.getSoundFromPool = function(name) {
    // iterate all sounds
    for( var prop in this.soundPool ) {
        if( this.soundPool.hasOwnProperty(prop)) {
            // iterate the same sounds
            for(i = 0;i < this.soundPool[ prop ].length;i++) {
                var tmp = this.soundPool[prop][i];
                // get the sound by its name
                if(tmp.src.indexOf(name) !== -1) {
                    // return if the sound is loaded and not played
                    if(/*tmp.readyState === 4 &&*/ tmp.paused) {
                       return tmp;
                    }
                }
            }
        }
    }
    return null;
}
/*
 readyState
 0 = HAVE_NOTHING - no information whether or not the audio/video is ready
 1 = HAVE_METADATA - metadata for the audio/video is ready
 2 = HAVE_CURRENT_DATA - data for the current playback position is available, but not enough data to play next frame/millisecond
 3 = HAVE_FUTURE_DATA - data for the current and at least the next frame is available
 4 = HAVE_ENOUGH_DATA - enough data available to start playing
* */