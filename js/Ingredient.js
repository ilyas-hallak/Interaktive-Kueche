/**
 *   Zutat:
 *   wird als eigene Klasse definiert damit es besser erkannt und abgefragt werden kann
 */
function Ingredient(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	this.name = name;
	this.setDraggable(draggable);
}

Ingredient.prototype = new VisualRenderObject();
Ingredient.prototype.constructor = Ingredient;
