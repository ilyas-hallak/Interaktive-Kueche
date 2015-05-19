/**
 *
 *
 * Image:
 * -----------------
 * | 0 | 1 | 2 | 3 |
 * -----------------
 * | 4 | 5 | 6 | 7 |
 * -----------------
 *  { "image": {
 *          "tileWidth":
 *          "tileHeight":
 *          "imgWidth":
 *          "imgHeight":
 *      }
 *    "animations": {
 *          "default" : { "seq":[0], "loop": false },
 *          "cold": { "seq": [0], "loop": false },
 *          "cooling" { "seq": [], "loop": true },
 *
 *    }
 *  }
 *
 * @param context
 * @param sx
 * @param sy
 * @param w
 * @param h
 * @param imgPath
 * @param zOrder
 * @param animObj
 * @constructor
 */
function VisualRenderAnimation(context, sx, sy, w, h, imgPath, zOrder, animObj) {
    VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
    this.animations = animObj;
    this.tileWidth = this.animations.image.tileWidth || w;
    this.tileHeight = this.animations.image.tileHeight || h;

    // max columns of tiles in the sprite image
    // needed to calc x,y of the tile
    this.maxCols = this.animations.image.imgWidth / this.tileWidth;

    // current animation to run
    this.currentAnimation = this.animations.animations["default"].seq || [0];

    // act index of the current animation array
    this.currentAnimIndex = 0;

    // indicates if animation has to be looped
    this.loop = this.animations.animations["default"].loop || false;

    // animation interval in milliseconds
    this.animInterval = 120;

    // last time the tile has changed
    this.lastTileUpdateTime = 0;
}

VisualRenderAnimation.prototype = Object.create(VisualRenderObject.prototype);
VisualRenderAnimation.prototype.constructor = VisualRenderAnimation;

/**
 * Override
 */
VisualRenderAnimation.prototype.draw = function() {
    // in which col and row is the tile to draw
    var row = parseInt(this.currentAnimation[this.currentAnimIndex] / this.maxCols);
    var col = (this.currentAnimation[this.currentAnimIndex] % this.maxCols);

    // calc x,y position of the tile
    var imgX = col * this.tileWidth;
    var imgY = row * this.tileHeight;

    // draw tile
    this.context.drawImage(this.img, imgX, imgY, this.tileWidth, this.tileHeight, this.x, this.y, this.width, this.height);

    var delta = Date.now() - this.lastTileUpdateTime;

    if(delta > this.animInterval) {
        this.nextAnimTile();
        this.lastTileUpdateTime = Date.now();
     //   console.log( col + " " + row + " " + imgX + " " + imgY + " " + this.maxCols);
    }
}

/**
 * Calc the next tile to draw
 */
VisualRenderAnimation.prototype.nextAnimTile = function() {
    if(this.currentAnimIndex + 1 < this.currentAnimation.length) {
        this.currentAnimIndex++;
    } else if(this.loop) {
        this.currentAnimIndex = 0;
    }
}

/**
 * Change the current animation sequence
 * @param String seqName - name of the anim sequence
 */
VisualRenderAnimation.prototype.changeAnimSequence = function(seqName) {
     try {
        this.currentAnimation = this.animations.animations[seqName].seq;
        this.loop = this.animations.animations[seqName].loop;
        this.currentAnimIndex = 0;
     } catch(e) {
         console.log("no such animation sequence: " + seqName);
         /*this.currentAnimation = this.animations.animations["default"].seq;
         this.loop = this.animations.animations["default"].loop;
         this.currentAnimIndex = 0; */
     }

}