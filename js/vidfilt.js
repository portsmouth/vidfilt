
/**
* Vidfilt is the global object providing access to all functionality in the system.
* @constructor
* @param {Filter} sceneObj - The object defining the filter we apply
*/
var Vidfilt = function(filterObj, videoElement)
{
	this.initialized = false;
	this.terminated = false;
	this.rendering = false;
	this.filterObj = filterObj;
  this.videoElement = videoElement;
	vidfilt = this;

	let container = document.getElementById("container");
	this.container = container;

	var render_canvas = document.getElementById('render-canvas');
	this.render_canvas = render_canvas;
	this.width = render_canvas.width;
	this.height = render_canvas.height;
	render_canvas.style.width = render_canvas.width;
	render_canvas.style.height = render_canvas.height;

	var text_canvas = document.getElementById('text-canvas');
	this.text_canvas = text_canvas;
	this.textCtx = text_canvas.getContext("2d");
	this.onVidfiltLink = false;
	this.onUserLink = false;

	window.addEventListener( 'resize', this, false );

	this.gui = null;
	this.guiVisible = true;

	// Instantiate renderer
	this.renderer = new Renderer();
	this.auto_resize = true;
		
	// Allow user to programmatically initialize the video filter
	this.initFilter();

	// Do initial resize:
	this.resize();

	// Create dat gui
	this.gui = new GUI(this.guiVisible);

	// Setup keypress and mouse events
	window.addEventListener( 'mousemove', this, false );
	window.addEventListener( 'mousedown', this, false );
	window.addEventListener( 'mouseup',   this, false );
	window.addEventListener( 'contextmenu',   this, false );
	window.addEventListener( 'click', this, false );
	window.addEventListener( 'keydown', this, false );

  this.videoElement.addEventListener('canplaythrough', startVideo, true);
  this.videoElement.addEventListener('ended', videoDone, true);

  let ME = this;
  this.videoElement.addEventListener("seeked", function(event) {
    if(videoElement.currentTime === 0){
        console.log('videoDone');
        ME.reset();
    }
  });
    
  this.videoElement.preload = 'auto';
  this.videoElement.crossOrigin = "";
  
  this.paused = false;
	this.initialized = true;
}

function startVideo()
{
    this.play();
    let THIS = vidfilt;
    this.intervalID = setInterval(function() { THIS.render(); }, 15);
}

function videoDone()
{
  console.log('Video ended');
}

Vidfilt.prototype.pause = function()
{
    this.videoElement.pause();
}

Vidfilt.prototype.play = function()
{
    this.videoElement.play();
}

/**
* Returns the current version number of the Vidfilt system, in the format [1, 2, 3] (i.e. major, minor, patch version)
*  @returns {Array}
*/
Vidfilt.prototype.getVersion = function()
{
	return [1, 0, 0];
}

Vidfilt.prototype.handleEvent = function(event)
{
	switch (event.type)
	{
		case 'resize':      this.resize();  break;
		case 'mousemove':   this.onDocumentMouseMove(event);  break;
		case 'mousedown':   this.onDocumentMouseDown(event);  break;
		case 'mouseup':     this.onDocumentMouseUp(event);    break;
		case 'contextmenu': this.onDocumentRightClick(event); break;
		case 'click':       this.onClick(event);  break;
		case 'keydown':     this.onkeydown(event);  break;
	}
}

/**
* Access to the Renderer object
*  @returns {Renderer}
*/
Vidfilt.prototype.getRenderer = function()
{
	return this.renderer;
}

Vidfilt.prototype.getFilter = function()
{
	return this.filterObj;
}

/**
* Access to the GUI object
*  @returns {GUI}
*/
Vidfilt.prototype.getGUI = function()
{
	return this.gui;
}

/**
 * @returns {WebGLRenderingContext} The webGL context
 */
Vidfilt.prototype.getGLContext = function()
{
	return GLU.gl;
}

/**
* Programmatically show or hide the dat.GUI UI
* @param {Boolean} show - toggle
*/
Vidfilt.prototype.showGUI = function(show)
{
	this.guiVisible = show;
}

Vidfilt.prototype.dumpFilter = function()
{
	let camera = this.camera;
	let controls = this.camControls;
	let renderer = this.renderer;

	var code = `/******* copy-pasted console output on 'O', begin *******/\n`;
	code += `
let renderer  = vidfilt.getRenderer();
	`;

	if (typeof this.filterObj.initGenerator !== "undefined")
	{
		code += this.filterObj.initGenerator();
	}
	
	code += this.guiVisible ? `\nvidfilt.showGUI(true);\n` : `\nvidfilt.showGUI(false);\n`;

	code += `
/** renderer settings **/
renderer.exposure = ${renderer.exposure};
renderer.gamma = ${renderer.gamma};

/******* copy-pasted console output on 'O', end *******/
	`;

	return code;
}

Vidfilt.prototype.initFilter= function()
{
	if (this.filterObj == null) return;
	if (typeof this.filterObj.program == "undefined") GLU.fail('Filter must define a "program" function!');

	// Call user-defined init function
	if (typeof this.filterObj.init != "undefined") this.filterObj.init(this);

	// Read optional filter name and URL, if provided
	this.filterName = '';
	this.filterURL = '';
	if (typeof this.filterObj.getName !== "undefined") this.filterName = this.filterObj.getName();
	if (typeof this.filterObj.getURL !== "undefined") this.filterURL = this.filterObj.getURL();
	
	// Compile GLSL shaders
  	this.renderer.compileShaders();

  	// Fix renderer to width & height, if they were specified
  	if ((typeof this.renderer.width!=="undefined") && (typeof this.renderer.height!=="undefined"))
  	{
  		this.auto_resize = false;
  		this._resize(this.renderer.width, this.renderer.height);
  	}

	this.reset(false);
}


// Renderer reset on camera or other parameters update
Vidfilt.prototype.reset = function(no_recompile = false)
{
	if (!this.initialized || this.terminated) return;
	this.renderer.reset(no_recompile);
}
   
// Render all
Vidfilt.prototype.render = function()
{
	var gl = GLU.gl;
	gl.viewport(0, 0, this.width, this.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	if (!this.initialized || this.terminated) return;
	if (this.filterObj == null) return;
	this.rendering = true;

	// Render video frame
  let new_frame = !this.paused;
	this.renderer.render(this.videoElement, new_frame);

	// Update HUD text canvas
	this.textCtx.textAlign = "left";   	// This determines the alignment of text, e.g. left, center, right
	this.textCtx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
	this.textCtx.font = '12px monospace';	// This determines the size of the text and the font family used
	this.textCtx.clearRect(0, 0, this.textCtx.canvas.width, this.textCtx.canvas.height);
	this.textCtx.globalAlpha = 0.95;
	this.textCtx.strokeStyle = 'black';
	this.textCtx.lineWidth  = 2;
	if (this.guiVisible)
	{
	  	if (this.onVidfiltLink) this.textCtx.fillStyle = "#ff5500";
	  	else                  this.textCtx.fillStyle = "#ffff00";
	  	let ver = this.getVersion();
	  	this.textCtx.strokeText('Vidfilt v'+ver[0]+'.'+ver[1]+'.'+ver[2], 14, 20);
	  	this.textCtx.fillText('Vidfilt v'+ver[0]+'.'+ver[1]+'.'+ver[2], 14, 20);
	  	
	  	if (this.filterName != '')
	  	{
	  		this.textCtx.fillStyle = "#ffaa22";
	  		this.textCtx.strokeText(this.filterName, 14, this.textCtx.canvas.height-25);
	  		this.textCtx.fillText(this.filterName, 14, this.textCtx.canvas.height-25);
	  	}
		if (this.filterURL != '')
		{
			if (this.onUserLink) this.textCtx.fillStyle = "#aaccff";
	  		else                 this.textCtx.fillStyle = "#55aaff";
	  		this.textCtx.strokeText(this.filterURL, 14, this.textCtx.canvas.height-40);
	  		this.textCtx.fillText(this.filterURL, 14, this.textCtx.canvas.height-40);
		}
	}

	gl.finish();
	this.rendering = false;
}

Vidfilt.prototype._resize = function(width, height)
{
	this.width = width;
	this.height = height;

	let render_canvas = this.render_canvas;
	render_canvas.width  = width;
	render_canvas.height = height;
	render_canvas.style.width = width;
	render_canvas.style.height = height;

	var text_canvas = this.text_canvas;
	text_canvas.width  = width;
	text_canvas.height = height

	this.renderer.resize(width, height);
}

Vidfilt.prototype.resize = function()
{
	if (this.terminated) return;
	if (this.auto_resize)
	{
		// If no explicit renderer size was set by user, resizing the browser window
		// resizes the render itself to match.
		let width = window.innerWidth;
		let height = window.innerHeight;
		this._resize(width, height);
		if (this.initialized)
			this.render();
	}
	else
	{
		// Otherwise if the user set a fixed renderer resolution, we scale the resultant render
		// to fit into the current window with preserved aspect ratio:
		let render_canvas = this.render_canvas;
		let window_width = window.innerWidth;
		let window_height = window.innerHeight;
		let render_aspect = render_canvas.width / render_canvas.height;
		let window_aspect = window_width / window_height;
		if (render_aspect > window_aspect)
		{
			render_canvas.style.width = window_width;
			render_canvas.style.height = window_width / render_aspect;
		}
		else
		{
			render_canvas.style.width = window_height * render_aspect;
			render_canvas.style.height = window_height;
		}
		var text_canvas = this.text_canvas;
		text_canvas.width = window_width;
		text_canvas.height = window_height;
	}
}


Vidfilt.prototype.onClick = function(event)
{
	if (this.onVidfiltLink)
	{
    	window.open("https://github.com/portsmouth/vidfilt");
    }
    if (this.onUserLink)
	{
		window.open(this.filterURL);
    }
	event.preventDefault();
}

Vidfilt.prototype.onDocumentMouseMove = function(event)
{
	// Check whether user is trying to click the Vidfilt home link, or user link
	var textCtx = this.textCtx;
	var x = event.pageX;
    var y = event.pageY;
	let linkWidth = this.textCtx.measureText('Vidfilt vX.X.X').width;
	if (x>14 && x<14+linkWidth && y>15 && y<25) this.onVidfiltLink = true;
	else this.onVidfiltLink = false;
	if (this.filterURL != '')
	{
		linkWidth = this.textCtx.measureText(this.filterURL).width;
		if (x>14 && x<14+linkWidth && y>this.height-45 && y<this.height-35) this.onUserLink = true;
		else this.onUserLink = false;
	}
}

Vidfilt.prototype.onDocumentMouseDown = function(event)
{
}

Vidfilt.prototype.onDocumentMouseUp = function(event)
{
}

Vidfilt.prototype.onDocumentRightClick = function(event)
{
}

Vidfilt.prototype.onkeydown = function(event)
{
	var charCode = (event.which) ? event.which : event.keyCode;
	switch (charCode)
	{
		case 122: // F11 key: go fullscreen
			var element	= document.body;
			if      ( 'webkitCancelFullScreen' in document ) element.webkitRequestFullScreen();
			else if ( 'mozCancelFullScreen'    in document ) element.mozRequestFullScreen();
			else console.assert(false);
			break;

		case 80: // P key: pause/play
      if (!this.paused)
      {
        this.paused = true;
        this.videoElement.pause();
      }
      else
      {
        this.paused = false;
        this.videoElement.play();
      }
			break;
      
    case 82: // R key: reset scene
      this.initFilter();
      this.reset(true);
      break;

		case 72: // H key: toggle hide/show dat gui
			this.guiVisible = !this.guiVisible;
			vidfilt.getGUI().toggleHide();
			break;
		
		case 79: // O key: output filter settings code to console
			let code = this.dumpFilter();
			console.log(code);
			break;
	}
}
