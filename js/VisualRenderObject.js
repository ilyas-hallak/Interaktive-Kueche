/**
 * 
 * Medieninformatik 2
 * (c) 2012 Bremen, Germany
 * Autorin: Yvonne Zöllner <yvonne.zoellner@hs-bremen.de>
 * Version 0.5
 * changeLog
 * v0.5
 * - functions to get center, topCenter and bottomCenter point added
 * - functions to get and set a hitZone are added
 *
 */
 /**
 * represents an object to be rendered on the stage
 * @param context - context object - the 2d context of the canvas
 * @param sx Number - the start x position
 * @param sy Number - the start y position
 * @param w Number - the width of the object
 * @param h Number - the height of the object
 * @param imgPath - the path of the image
 * @param zOrder - the order to be drawn on stage
 */
function VisualRenderObject(context, sx, sy, w, h, imgPath, zOrder ){
	this.context = context;
	this.x = sx;
	this.y = sy;
	this.startX = sx;
	this.startY = sy;
	this.zOrder = zOrder;
	this.width = w;
	this.height = h;
	this.imagePath = imgPath || null;
	this.img = null;
	// rotation
	this.rotation = 0;
	// indicates if object can be dragged
	this.draggable = false;
	// needed to remember where the user has clicked this object to drag
	this.selX = 0;
	this.selY = 0;
	if(this.imagePath !== null) {
		// setup the image
		this.img = new Image();
		this.img.src = this.imagePath;
	}
	
	// set the default hitzone
	this.setHitZone(0, 0, this.width, this.height);
	
}

/**
 * @return booloean if the object is draggable
 */
VisualRenderObject.prototype.isDraggable = function(){
	return this.draggable;
};

/**
 * Set this object draggable or not 
 * @param boolean drag - draggable
 */
VisualRenderObject.prototype.setDraggable = function(drag){
	this.draggable = drag;
};


/**
 * Get the position of this object. (x,y is the top left corner of the image)
 * w, h width and height f the object
 * @return Object - x, y, w, h, (width and height are also provided)
 */
VisualRenderObject.prototype.getPosition = function(){
	return {x:this.x, y:this.y, w:this.width,h:this.height}
};


/**
 * Get the center point of this VRObject as canvas coordinates
 * @return Object width center point { "cx":<x>, "cy":<y> }
 */
 VisualRenderObject.prototype.getCenter = function(){
	var x = this.x + this.width/2;
	var y = this.y + this.height/2;
	return { "cx":x, "cy":y };	
}

/**
 * Get the bottom center point of this VRObject as canvas coordinates
 * @return Object width bottom center point { "cx":<x>, "cy":<y> }
 */
 VisualRenderObject.prototype.getBottomCenter = function(){
	var x = this.x + this.width/2;
	var y = this.y + this.height;
	return { "cx":x, "cy":y };	
}

/**
 * Get the bottom center point of this VRObject as canvas coordinates
 * @return Object width bottom center point { "cx":<x>, "cy":<y> }
 */
 VisualRenderObject.prototype.getTopCenter = function(){
	var x = this.x + this.width/2;
	return { "cx":x, "cy":this.y };	
}


/**
 * Get the hitzone data for this Object. If not set, default hitzone is the whole size of this object (image)
 * @return Object {"hx":x, "hy":y, "hw":w, "hh":h}
 */
VisualRenderObject.prototype.getHitZone = function(){
	var x = this.x + this.hitZone.hx;
	var y = this.y + this.hitZone.hy;
	return  {"hx":x, "hy":y, "hw":this.hitZone.hw, "hh":this.hitZone.hh};

}

/**
 * Set a hitzone for this object. 
 * if hitzone schould be bigger than the image or outside the image, x and y can be negative numbers
 * @param Number left - x value according to the image (left top starting point (0/0))
 * @param Number top - y value according to the image (left top starting point (0/0))
 * @param Number width - width of the hitzone 
 * @param Number height - height og the hitzone
 *
 */
VisualRenderObject.prototype.setHitZone = function(left, top, width, height){
	this.hitZone = {"hx":left, "hy":top, "hw":width, "hh":height};
}


/**
 * Draw this object to the canvas. If a rotation is applied, it draws the rotated image
 */
VisualRenderObject.prototype.draw = function(){
	//console.log('draw Object');
	
	if(this.rotation === 0){
		this.context.drawImage(this.img, this.x, this.y, this.width, this.height);
		
	} else {
		// rotation: Because canvas is only one screen, rotate, translate and scale are applied to the whole canvas
		// Because we want only this object to rotate we have to do the following steps:
		// 1. save the actual canvas on the stack
		this.context.save();
		// 2. reset the transformation matrix (not necessary)
		// this.context.setTransform(1,0,0,1,0,0);
		// 3. rotate
		// 3a) translate the "origin" to the center of this object ("origin" is normally the top left of the canvas (0,0))
		// to rotate the center of this object
		this.context.translate(this.x + (this.width * 0.5), this.y + (this.height * 0.5) );
		// 3b) process radiant and rotate
		var angleInRadians = this.rotation * Math.PI/180;
		this.context.rotate(angleInRadians);
		// 4. canvas is rotated so draw the image (Origin is now center of the image)
		// "-this.width * 0.5": center of canvas is translated to the middle of this Object. 
		// So to draw it we need the x and y, and it's actual x and y is at -this.width * 0.5 and -this.height * 0.5
		this.context.drawImage(this.img, -this.width * 0.5, -this.height * 0.5, this.width, this.height);		
		// 5. restore the canvas (version as "saved" before)
		this.context.restore();	
		
	}
	
};

/**
 * change the image of this visual object
 * @param String img - the image path of the new image
 */
VisualRenderObject.prototype.changeImage = function(imgPath){
	var i = new Image();
	i.src = imgPath;
	this.img = i;
	
};

/**
 * set the rotation of this object
 * @param number degree - the rotation (0-360)
 */
VisualRenderObject.prototype.setRotation = function(degree){
	this.rotation = degree;
};

/**
 * get the rotation of this object
 * @return number - the actual rotation
 */
VisualRenderObject.prototype.getRotation = function(){
	return this.rotation;
};


/**
 * Reset position to start position
 */
VisualRenderObject.prototype.resetPosition = function(){
	this.x = this.startX;
	this.y = this.startY;
};

/**
 * Calculate and set the mouse drag position relative to this object
 * only for Drag & Drop process (Stage uses this function)
 * @param Object mousePos - the x and y value of the mouse at that moment
 */
VisualRenderObject.prototype.setDragPosition = function(mousePos){
	this.selX = mousePos.x - this.x;
	this.selY = mousePos.y - this.y;
};

/**
 * update the position of this object
 * only for dragging process (Stage uses this function)
 * @param Object - the actual mouse position
 */
VisualRenderObject.prototype.updateDragPosition = function(mousePos){
	this.x = mousePos.x - this.selX;
	this.y = mousePos.y - this.selY;
};
