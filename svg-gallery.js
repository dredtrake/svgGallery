/*
*
 * svg-gallery.js: a new svg gallery
 *
 * 2013-10-31
 * 
 * By dredtrake@gmail.com
 *
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
'use strict';
var SvgGallery = (function(JQUERY, SVG){
	var SvgGallery = function (params){
		var defaults = {
					_item : 'canvas',
					_dataURL : '',
					_data : '',
					_folderSrc : '',
					_width : '1920',
					_height : '1080',
					_preserveAspectRatio : "xMidYMid slice",
					_transition : "squares",
					onclick : function(){ return false},
					_duration : 650,
					_animationUpType : ">",
					_animationDownType : "<",
					_order : 'desc',
					_loop : false,
					onanimate : function (){return false;},
					ready : function (){return false;}
				};
		this.options = JQUERY.extend({}, defaults, params);
		this.images = [];
		this.draw = '';
		this.i = null;
	};
	SvgGallery.prototype = {
		constructor : SvgGallery,
		options : {},
		//~ draw : null,
		svg : null,
		_width : 0,
		_height : 0,
		diag : null,
		circ : null,
		rect : null,
		_angle : null,
		_isSliding : 0,
		_maxSliding : null,
		isLocalStorage : 0,
		simpleUp : 0,
		init : function init (){
			if(!this.options._dataURL && !this.options._data) {
				$("#"+this.options._item).html('<p>Please feed me with some yummy json!!</p>');
				return;
			}
			this._width = this.options._width;
			this._height = this.options._height;
			this._angle = this.getAngle(0, this._height, this._width, 0);
			this.draw = SVG(this.options._item);
			this.svg = JQUERY('#'+this.options._item).find('svg')[0];
			this.svg.setAttribute('viewBox', '0 0 '+this._width+' '+this._height);
			this.svg.setAttribute('preserveAspectRatio', this.options._preserveAspectRatio);
			var _this = this;
			if(this.options._data){
				this._maxSliding = this.options._data.length;
				this.drawScene(this.options._data);
			}else{
				JQUERY.ajax({
					url : _this.options._dataURL,
					type:"get",
					dataType:"json",
					success:function (e){
						_this._maxSliding = e.length;
						_this.drawScene(e);
					}
				});
			}
		},
		// TODO : add a onload images listener.
		// run bindMouseWheel on this event...
		//~ ADD Loop event
		drawScene : function drawScene (_e){
			var _l = _e.length;
			for(this.i= 0; this.i < _l; ++this.i){
				var _prefixe = this.options._folderSrc || "";
				this.images[this.i] = this.draw.image(_prefixe+_e[this.i].img_src, this._width, this._height);
				this.images[this.i].style('cursor', 'pointer');
				this.images[this.i].data('id', _e[this.i].id);
				this.images[this.i].data('nom', _e[this.i].nom);
				this.images[this.i].data('description', _e[this.i].description);
				this.images[this.i].click(this.options.onclick);
			}
			this.i -= 1;
			this.circ = this.draw.circle(.2);
			this.circ.back();
			this.rect = this.draw.rect(.2, .2);
			this.rect.back();
			this.diag = this.draw.rect(.2, this._height);
			this.diag.back();
			this.bindMouseWheel();
			this.options.ready();
		},
		extractDelta : function extractDelta (_e){
			if (_e.wheelDelta)	return _e.wheelDelta;
			if (_e.detail)		return _e.detail * -40;
			if (_e.originalEvent && _e.originalEvent.wheelDelta)	return _e.originalEvent.wheelDelta;
		},
		getAngle : function getAngle(x1,y1,x2,y2){
			var angle = Math.atan((x2-x1)/(y1-y2))/(Math.PI/180);
			angle = Math.round(angle);
			if ( angle > 0 ){
				 if (y1 < y2){
					return angle;
				 }else{
					return 180 + angle;
				 }
			} else {
				if (x1 < x2){
					return 180 + angle;
				}else{
					return 360 + angle;
				}
			}
		},
		bindMouseWheel : function bindMouseWheel (){
			if (this.svg.addEventListener) {
				// IE9, Chrome, Safari, Opera
				this.svg.addEventListener("mousewheel", this.animateGallery.bind(this), false);
				//~ // Firefox
				this.svg.addEventListener("DOMMouseScroll", this.animateGallery.bind(this), false);
			}
			// IE 6/7/8
			else{
				this.svg.attachEvent("onmousewheel", this.animateGallery.bind(this));
			}
		},
		animateGallery : function (_e){
			var _delta = this.extractDelta(_e);
			switch(this.options._transition){
				case "diagonales" : 
					this.diagonales(_delta);
					break;
				case "circles" : 
					this.circles(_delta);
					break;
				case "squares" : 
					this.squares(_delta);
					break;
				defaults :
					this.diagonales(_delta);
					break;
			}
		},
		diagonales : function diagonales (_delta){
			var _this = this;
			if(this._isSliding){
				return;
			}
			if(_delta < 0){				
				if(this.i > 0){
					this._isSliding = 1;
					this.simpleUp = 0;
					--this.i;
					this.diag.attr({'width' : .2, 'height' : this._height})	
						.move(this._width, 0)
						.skew(360-this._angle, 0)
					this.images[this.i].clipWith(this.diag).front();
					this.diag.animate(this.options._duration,  this.options._animationDownType) 
						.move(0, 0)
						.attr('width', this._width * 2)
						.after(function() {
							this.attr('width', 0);
							_this._isSliding = 0;
							_this.images[_this.i].unclip();
							_this.options.onanimate();
						});
				}else{
					return;
				}
			}else{
				if(this.i == this._maxSliding-1){
					return;
				}
				this._isSliding = 1;
				if(this.simpleUp){
					this.images[this.i+1].front().backward();
				}
				this.images[this.i].clipWith(this.diag);
				
				this.diag.attr({'width' : this._width*2, 'height' : this._height})
					.move(0, 0)
					.animate(this.options._duration,  this.options._animationUpType) 
					.move(this._width, 0)
					.attr('width', .2)
					.after(function() {
						this.attr('width', 0);
						_this.images[_this.i].unclip();
						_this._isSliding = 0;
						++_this.i;
						_this.images[_this.i].front();
						_this.options.onanimate();
					});	
				this.simpleUp = 1;
			}
		},
		circles : function circles (_delta){
			var _this = this;
			if(this._isSliding){
				return;
			}
			if(_delta < 0){				
				if(this.i > 0){
					this._isSliding = 1;
					this.simpleUp = 0;
					--this.i;
					this.circ.attr('rx', .2)					
						.attr('ry', .2)					
					this.circ.center(.1, .1)
						.move(this._width/2, this._height/2)
					this.images[this.i].clipWith(this.circ).front();
					this.circ.animate(this.options._duration, this.options._animationDownType) 
						.center(this._width/2, this._height/2)
						.attr('rx', this._width)
						.attr('ry', this._width)
						.after(function() {
							_this._isSliding = 0;
							_this.images[_this.i].unclip();
							this.attr('rx', 0);
							this.attr('ry', 0);
							_this.options.onanimate();
						});
				}else{
					return;
				}
			}else{
				if(this.i == this._maxSliding-1){
					return;
				}
				this._isSliding = 1;
				if(this.simpleUp){
					this.images[this.i+1].front().backward();
				}
				this.images[this.i].clipWith(this.circ);
				this.circ.attr('rx', this._width)
					.attr('ry', this._width)
					.center(this._width/2, this._height/2)
					.animate(this.options._duration,  this.options._animationUpType) 
					.center(.1, .1)
					.move(this._width/2, this._height/2)
					.attr('rx', .2)
					.attr('ry', .2)
					.after(function() {
						this.attr('rx', 0);
						this.attr('ry', 0);
						_this.images[_this.i].unclip();
						_this._isSliding = 0;
						++_this.i;
						_this.images[_this.i].front();
						_this.options.onanimate();
					});
				this.simpleUp = 1;
			}
		},
		squares : function squares (_delta){
			var _this = this;
			if(this._isSliding){
				return;
			}
			if(_delta < 0){				
				if(this.i > 0){
					this._isSliding = 1;
					this.simpleUp = 0;
					--this.i;
					this.rect.attr({'width' : .2, 'height' : .2})	
						.move(this._width/2, this._height/2);
					this.images[this.i].clipWith(this.rect).front();
					this.rect.animate(this.options._duration,  this.options._animationDownType) 
						.move(0, -(this._height/2))
						.attr({'width' : this._width, 'height' : this._width})
						.after(function() {
							_this._isSliding = 0;
							_this.images[_this.i].unclip();
							this.attr({'width' : 0, 'height' : 0});
							_this.options.onanimate();
						});
				}else{
					return;
				}
			}else{
				if(this.i == this._maxSliding-1){
					return;
				}
				this._isSliding = 1;
				if(this.simpleUp){
					this.images[this.i+1].front().backward();
				}
				this.images[this.i].clipWith(this.rect);				
				this.rect.attr({'width' : this._width, 'height' : this._width})
					.move(0,  -(this._height/2))
					.animate(this.options._duration,  this.options._animationUpType) 
					.move(this._width / 2, this._height / 2)
					.attr({'width' : .2, 'height' : .2})
					.after(function() {
						this.attr({'width' : 0, 'height' : 0});
						_this.images[_this.i].unclip();
						_this._isSliding = 0;
						++_this.i;
						_this.images[_this.i].front();
						_this.options.onanimate();
					});	
				this.simpleUp = 1;
			}
		},
		bubbles : function (){
			// random bubbles
		},
		swipe : function (direction){
			// swipe as diagonal do, but form a side (up, down, left, right)
		},
		getID : function getID (){
			return this.images[this.i].data('id');
		}
	};
	return SvgGallery;
})($, SVG);