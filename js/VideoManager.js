/**
 * wird vom RessourceManager aufgerufen
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
function VideoManager(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
    // set the hided positions
    this.HIDEDsx = 400;
    this.HIDEDsy = 600;

    // set the showed positions
    this.SHOWEDsx = 600;
    this.SHOWEDsy = 460;

    // call constructor
    VisualRenderObject.call(this, context, this.HIDEDsx, this.HIDEDsy, w, h, imgPath, zOrder);

    this.name = name;
    this.setDraggable(draggable);

    // states
    this.HIDDEN = 0;
    this.SHOWN = 1;

    // animation states
    this.HIDING = 2;
    this.SHOWING = 3;

    // default state
    this.currentState = this.HIDDEN;

    // default video file name
    this.currentVideo = "";

    // video html Element
    this.video = null;

    // video start/stop button from rezeptemanager
    this.videoButton = null;

}

VideoManager.prototype =  Object.create(VisualRenderObject.prototype);
VideoManager.prototype.constructor = VideoManager;

/**
 * defined video files
 * @type {{Welcome: string}}
 */
VideoManager.prototype.files = {
   "Welcome" : "EuleinAction.webm"
}

/**
 * show the video and init the html
 * @param videoFile
 */
VideoManager.prototype.show = function(videoFile) {
    this.currentVideo = videoFile;
    this.changeState(this.SHOWING);
    this.initHtml();
}

/**
 * hide and pause the video
 * reset this.currentvideo
 */
VideoManager.prototype.hide = function() {
    this.video.pause();
    this.currentVideo = "";
    this.changeState(this.HIDING);
}

/**
 * toggle show/hide
 * @param videoFile string - video filename
 */
VideoManager.prototype.toggle = function(videoFile) {
    // debugger;
    if(this.currentState == this.SHOWN) {
        this.hide();
    } else {
        this.show(videoFile);
    }
}

VideoManager.prototype.changeState = function(state) {
    switch(state) {
        case this.HIDDEN:
            this.currentState = this.HIDDEN;
            break;
        case this.SHOWN:
            this.currentState = this.SHOWN;
            break;
        case this.HIDING:
            this.currentState = this.HIDING;
            break;
        case this.SHOWING:
            this.currentState = this.SHOWING;
            break;
    }
}

/**
 * get called from the kitchen.js run method
 */
VideoManager.prototype.update = function() {

    // falls das video am ende gelangt ist, wird es ausgeblendet und die animation gestartet
    if(this.video != null && this.video.currentTime == this.video.duration) {
        this.video.setAttribute('class', 'hidden');
        this.changeState(this.HIDING);
    }

    // fernseher anzeigen
    if(this.currentState == this.SHOWING) {
        // solange die y koordinate runter zählen bis fernseher angewünschte position this.SHOWEDsy ist
        if(this.y >= this.SHOWEDsy) {
            this.y -= 1;
            this.videoButton.setAttribute('disabled', true);
        } else {
            this.changeState(this.SHOWN);
            this.video.setAttribute('src', 'video/' + this.currentVideo);
            this.video.setAttribute('class', 'visible');
            this.video.play();
            this.videoButton.removeAttribute('disabled');
        }
    } else if(this.currentState == this.HIDING) {
        // video per css ausblenden
        this.video.setAttribute('class', 'hidden');
        // solange die y koordinate hoch zählen bis fernseher angewünschte position this.SHOWEDsy ist
        if(this.y <= this.HIDEDsy) {
            this.y += 1;
            this.videoButton.setAttribute('disabled', true);
        } else {
            this.changeState(this.HIDDEN);
            this.videoButton.removeAttribute('disabled');

        }
    }

}

VideoManager.prototype.initHtml = function() {
    this.video = document.createElement('video');

    this.video.setAttribute('src', 'video/' + this.currentVideo);
    this.video.setAttribute('type', 'video/mp4');

    this.video.setAttribute('class', 'hidden');

    this.video.controls = true;

    document.querySelector('body').appendChild(this.video);

    this.videoButton = document.querySelector('#videoButton').querySelector('button');
}

