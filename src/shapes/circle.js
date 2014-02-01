/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 */

(function(window) {
	
	/**
	 * an ellipse Object
	 * (Tiled specifies top-left coordinates, and width and height of the ellipse)
	 * @class
	 * @extends Object
	 * @memberOf me
	 * @constructor
	 * @param {me.Vector2d} v top-left origin position of the Ellipse
	 * @param {int} w width of the elipse
	 * @param {int} h height of the elipse
	 */
	me.Ellipse = Object.extend(
	/** @scope me.Ellipse.prototype */	{
	
		/**
		 * center point of the Ellipse
		 * @public
		 * @type me.Vector2d
		 * @name pos
		 * @memberOf me.Ellipse
		 */
		pos : new me.Vector2d(),
		 
		/**
		 * radius (x/y) of the ellipse
		 * @public
		 * @type me.Vector2d
		 * @name radius
		 * @memberOf me.Ellipse
		 */
		radius : new me.Vector2d(),
        

		// the shape type
		shapeType : "Ellipse",
		
		
		/** @ignore */
		init : function(v, w, h) {
			this.setShape(v, w, h);
		},

		/**
		 * set new value to the Ellipse shape
		 * @name setShape
		 * @memberOf me.Ellipse
		 * @function
		 * @param {me.Vector2d} v top-left origin position of the Ellipse
		 * @param {int} w width of the Ellipse
		 * @param {int} h height of the Ellipse	 
		 */
		setShape : function(v, w, h) {
			this.radius.set(w/2, h/2);
            this.pos.setV(v).add(this.radius); 
            return this;
		},

        /**
         * returns the bounding box for this shape, the smallest Rectangle object completely containing this shape.
         * @name getBounds
         * @memberOf me.Ellipse
         * @function
         * @param {me.Rect} [rect] an optional rectangle object to use when returning the bounding rect(else returns a new object)
         * @return {me.Rect} the bounding box Rectangle	object
         */
        getBounds : function(rect) {
             if (typeof(rect) !== 'undefined') {
                return rect.setShape(
                    this.pos.clone().sub(this.radius), 
                    this.radius.x * 2, 
                    this.radius.y * 2
                );
            } else {
                //will return a rect, with pos being the top-left coordinates 
                return new me.Rect(
                    this.pos.clone().sub(this.radius), 
                    this.radius.x * 2, 
                    this.radius.y * 2
                );
            }
        },
        
        /**
         * clone this Ellipse
         * @name clone
         * @memberOf me.Ellipse
         * @function
         * @return {me.Ellipse} new Ellipse	
         */
        clone : function() {
            return new me.Ellipse(this.pos, this.radius.x * 2, this.radius.y * 2);
        },


		/**
		 * debug purpose
		 * @ignore
		 */
		draw : function(context, color) {
			// http://tinyurl.com/opnro2r
			context.save();
			context.beginPath();

			context.translate(this.pos.x-this.radius.x, this.pos.y-this.radius.y);
			context.scale(this.radius.x, this.radius.y);
			context.arc(1, 1, 1, 0, 2 * Math.PI, false);

			context.restore();
			context.strokeStyle = color || "red";
			context.stroke();
		}
	});

})(window);
