/*
* Auothor : obi ubaka
*/


(function($){
	$.widget("enigma.volumeControl", {
		options : {
			template : '<div style="width: 4px; height: 8px; ">&nbsp;</div>',
			bars : 10,
			value : 0,
			activeColor : '#0e8aff',
			inactiveColor : 'grey'
		},

		
		_create : function(){
			var ele = this.element;
			var settings = this.options;
			for(var i = 1; i <= settings.bars; i++){
				var level = (i * 1 / settings.bars);
				var zoom = 1 + level;
				var t = $(settings.template);						
				var width = t.width() + t.width() * level;						
				var height = t.height() + t.height() * level;
				t.css({
					width: width, 
					height: height,							
					background: settings.inactiveColor,
					display: 'inline-block', 
					margin: 1,
					cursor: 'pointer',
					'vertical-align': 'bottom'
				}).attr('volume-level', level);
				t.on('click', function(e){							
					var ele = $(e.target);
					var level = ele.attr('volume-level');
					this.options.value = level;
					if(settings.onChange){
						settings.onChange(level);
					}							
					ele.css({background: settings.activeColor});
					ele.prevAll('[volume-level]').css({background: settings.activeColor});
					ele.nextAll('[volume-level]').css({background: settings.inactiveColor});
				}.bind(this));	
				ele.append(t);					
			}
		},

		value : function(val){
			// No value passed, act as a getter.
	        if ( val === undefined ) {
	 
	            return this.options.value;
	 
	        // Value passed, act as a setter.
	        }
	        this.options.value = val;
	        var settings = this.options;
			this.element.children().each(function(){
				var ele = $(this);
				var level = ele.attr('volume-level');																
				var color = level <= val ? settings.activeColor : settings.inactiveColor;
				ele.css({background: color});													
			})
			if(settings.onChange){
				settings.onChange(val);
			}
		}
	})
}(jQuery));