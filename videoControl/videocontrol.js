(function($){
	$.widget("controlpoint.videoControl", {
		options : {
			"z-index" : 2147483648
		},

		_create : function(){
			var supportedTags = ["video", "audio"]
			if(!this.options.templateUrl && supportedTags.indexOf(this.element.context.tagName.toLowerCase()) < 0){
				return;
			}else{
				this.element.context.controls = false;
				var style = $('head').find('style#videoControl');
				if(style.length < 1){
					$('head').append('<style id="videoControl">video::-webkit-media-controls-enclosure{display: none;}</style>');
				}
				
				this.element.wrap("<div></div>");
			}
			$.get(this.options.templateUrl, function(res){
				var ui = this.ui = $(res);								
				ui.hide();
				$(this.element).after(ui);	
				ui.css({
					position: "absolute",
					"z-index": this.options["z-index"]							
				});

				// Handling hiding and showing the control

				$(this.element).on("mouseover", function(e){
					if(this.mousetimeout){
						clearTimeout(this.mousetimeout);
					}
					this.ui.fadeIn();
					this.mouseover = true;					
				}.bind(this));

				$(this.element).on("mouseout", function(e){					
					this.mousetimeout = setTimeout(function(){
						this.mouseover = false;	
						this.ui.fadeOut();
					}.bind(this), 1000);				
				}.bind(this));

				$(this.ui).on("mouseover", function(e){
					if(this.mousetimeout){
						clearTimeout(this.mousetimeout);
					}
				}.bind(this));

				$(this.ui).on("mouseout", function(e){					
					this.mousetimeout = setTimeout(function(){
						this.mouseover = false;	
						this.ui.fadeOut();
					}.bind(this), 1000);				
				}.bind(this));		

				//End of handling control hide		
				this.calculateSize = function(fullscreen){		
					this.ui.hide();			
					var scale = this.element.context.clientWidth / this.ui.width();
					if(this.element.context.clientWidth >= 400){
						scale = 1;
					}
					var width = this.ui.width() * scale;
					var height = this.ui.height() * scale;
					var left, top;
					if(!fullscreen){
						left = (this.element.context.offsetLeft + this.element.context.clientWidth - width) / 2;
						top = this.element.context.offsetTop + this.element.context.clientHeight - height;
					}else{
						console.log($(window).width());
						left = (this.element.context.offsetLeft + this.element.context.clientWidth - width) / 2;
						top = "80%";
					}				
					this.ui.css({
						"transform" : "scale(" + scale + ", " + scale + " )",
						"-webkit-transform" : "scale(" + scale + ", " + scale + " )",
						"-moz-transform" : "scale(" + scale + ", " + scale + " )",
						"-o-transform" : "scale(" + scale + ", " + scale + " )",
						"-ms-transform" : "scale(" + scale + ", " + scale + " )",
						"transform-origin" : "0 0",
						"-webkit-transform-origin" : "0 0",
						"-moz-transform-origin" : "0 0",
						"-o-transform-origin" : "0 0",
						"-ms-transform-origin" : "0 0",
						"left" : left,
						"top" : top
					}).show();
				};

				$(this.element).on("resize", this.calculateSize.bind(this, false));

				var volumeSlider = this.volumeSlider = ui.find(".volSlider");
				var timeSlider = this.timeSlider = ui.find(".timeSlider");	
				var timeText = this.timeText = ui.find(".timeText");
				var play = this.play = ui.find(".play");
				var ffoward = this.ffoward = ui.find(".ffoward");
				var bfoward = this.bfoward = ui.find(".bfoward");
				var menu = this.menu = ui.find(".menu");
				var fullscreen = this.fullscreen = ui.find(".fullscreen");
				var loop = this.loop = ui.find(".loop");

				this.element.on("play", function(){
					console.log("playing...");
					this.play.removeClass("fa-play");
					this.play.addClass("fa-pause");
				}.bind(this));

				this.element.on("pause", function(){
					console.log("paused...");
					this.play.removeClass("fa-pause");
					this.play.addClass("fa-play");
				}.bind(this));				

				play.on("click", function(){					
					if(this.element.context.paused){
						this.element.context.play();
						clearInterval(this.intervalFFoward);
						clearInterval(this.intervalRewind);
					}else{
						this.element.context.pause();
					}
				}.bind(this));

				ffoward.on("click", function(){
					clearInterval(this.intervalFFoward);
					this.element.context.pause();					
					this.intervalFFoward = setInterval(function(){
				       this.element.context.playbackRate = 1.0;
				       if(video.currentTime == this.element.context.duration){
				           clearInterval(this.intervalFFoward);				           
				       }
				       else{
				           this.element.context.currentTime += .1;
				       }
				    }.bind(this),30);
				}.bind(this));

				bfoward.on("click", function(){					
					clearInterval(this.intervalRewind);
					this.element.context.pause();
					this.intervalRewind = setInterval(function(){
				       this.element.context.playbackRate = 1.0;
				       if(this.element.context.currentTime == 0){
				           clearInterval(this.intervalRewind);				           
				       }
				       else{
				           this.element.context.currentTime += -.1;
				       }
				    }.bind(this),30);
				}.bind(this));

				fullscreen.on("click", function(){
					if (fullScreenApi.supportsFullScreen) {
						var isFull = fullScreenApi.isFullScreen(this.element);						
						this.ui.hide();
						if(isFull){
							this.element.cancelFullScreen();										
						}else{
							this.element.requestFullScreen();												
						}						
					}
				}.bind(this))

				loop.on("click", function(){
					if(this.element.context.loop){
						this.element.context.loop = false;
						this.loop.removeClass("active");
					}else{
						this.element.context.loop = true;
						this.loop.addClass("active");
					}
				}.bind(this));

				$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {	
					var isFull = fullScreenApi.isFullScreen(this.element);
					console.log(isFull);
					if(!isFull){							
						setTimeout(function(){
							this.calculateSize(false);
							this.ui.fadeIn();
						}.bind(this), 500);
					}else{						
						setTimeout(function(){
							this.calculateSize(true);
							this.ui.fadeIn();
						}.bind(this), 500);							
					}	
				}.bind(this));

				this.element.on("loadedmetadata", function(){
					if(this.element.context.loop){						
						this.loop.addClass("active");
					}

					this.volumeSlider.controlSlider({
						isHandleRounded : true,
						handleRatio : 3,
						ratio : this.element.context.volume,
						onValueChange : function(e, data){													
							this.element.context.volume = data.value;						
						}.bind(this)
					});

					this.timeSlider.controlSlider({
						isHandleRounded : false,
						handleRatio : 3,
						ratio : 0,
						onValueChange : function(e, data){							
							var time = data.value * this.element.context.duration;							
							this.element.context.currentTime = time;
						}.bind(this)
					});

					this.element.on("timeupdate", function(e){
						var ratio = this.element.context.currentTime / this.element.context.duration;
						var buffered = this.element.context.buffered.end(this.element.context.buffered.length - 1) / this.element.context.duration;						
						this.timeSlider.controlSlider("value", ratio.toFixed(2));
						this.timeSlider.controlSlider("innerValue", buffered);
						var hr = Math.floor(this.element.context.currentTime / 3600);
						var min = Math.floor((this.element.context.currentTime %  3600) / 60);
						var sec = Math.floor((this.element.context.currentTime %  60));
						var text = hr + ":" + min + ":" + sec;
						this.timeText.text(text);
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
	})
}(jQuery))