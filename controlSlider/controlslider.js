(function($){
	$.widget("controlpoint.controlSlider", {
		options : {			
			innerBar : '<div class="controlSlider-innerBar"></div>',
			innerMostBar : '<div class="controlSlider-innerMostBar"></div>',
			handle : '<div class="controlSlider-handle"></div>',
			handleRatio : 4,
			isHandleRounded : false,
			ratio : 0.5,
			triggerOnValueSet : false,
			innerRatio : 0
		},
		_create : function(){
			this.element.addClass("controlSlider-outerBar");
			var outerBar = this.outerBar = $(this.element);
			var innerBar = this.innerBar = $(this.options.innerBar);
			var innerMostBar = this.innerMostBar = $(this.options.innerMostBar);
			var handle = this.handle = $(this.options.handle);

			this.element.append(outerBar);
			outerBar.append(innerMostBar).append(innerBar);
			innerBar.append(handle);

			var handleHeight = outerBar.height() + outerBar.height() * this.options.handleRatio;
			
			if(this.options.isHandleRounded){
				handle.css({
					width: handleHeight,
					"border-radius": "50%"
				});
			}

			handle.css({
				height: handleHeight,
				bottom: (handleHeight - outerBar.height())/2,
				left: handle.width() / 2
			});			

			handle.on('mousedown', function(e){
				this.mousedownHandle = true;
				this.dragX = e.clientX;				
				this.innerBarWidthBeforeDrag = this.innerBar.width();								
			}.bind(this));
			outerBar.on('mousedown', function(e){						
				if(e.target.className != "controlSlider-handle"){
					this._onBarClicked(parseInt(e.offsetX));
				}
			}.bind(this));
			$(window).on('mouseup', function(e){
				this.mousedownHandle = false;					
				if(e.target.className == "controlSlider-handle" || e.target.className == "controlSlider-outerBar"){
					this._valueChanged();
				}
			}.bind(this));
			$(window).on('mousemove', function(e){				
				if(this.mousedownHandle){							
					var diff = e.clientX - this.dragX;
					this._onHandleMoved(diff);					
				}
			}.bind(this));

			this.value(this.options.ratio);
			this.innerValue(this.options.innerRatio);
		},

		_onHandleMoved : function(amount){
			var w = this.innerBarWidthBeforeDrag + amount;
			if(w < 0 || w > this.outerBar.width()){
				return;
			}			
			var percentage = w / this.outerBar.width() * 100;
			this.innerBar.css({
				width: percentage + "%"
			});			
			this._valueChanged(true);
		},

		_onBarClicked : function(offset){			
			this.innerBar.css({
				width: offset
			});	
			this._valueChanged(true);
		},

		_valueChanged : function(trigger){
			this.ratio = this.innerBar.width() / this.outerBar.width();			
			if(trigger){
				this._trigger("onValueChange" , null, { value: this.ratio.toFixed(2) });
			}
		},

		value : function(value){			
			if(value === undefined){
				return this.ratio;
			}

			if(value >= 0 || value <= 1){
				var w = value * 100;
				this.innerBar.css({
					width: w + "%"
				});
				this._valueChanged(this.options.triggerOnValueSet);
			}
		},

		innerValue : function(value){			
			if(value === undefined){
				return this.innerRatio;
			}

			if(value >= 0 || value <= 1){
				var w = value * 100;
				this.innerMostBar.css({
					width: w + "%"
				});				
				this.innerRatio = value;
			}
		}
	})
}(jQuery))