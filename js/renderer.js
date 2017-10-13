
/**
* Interface to the renderer.
* @constructor
* @property {number} [exposure=3.0]             - image exposure, on a log scale
* @property {number} [gamma=2.2]                - image gamma correction
*/
var Renderer = function()
{
	this.gl = GLU.gl;
	var gl = GLU.gl;

	// renderer parameters
	this.exposure = 0.0;
	this.gamma = 1.0;

	this.historySize = 4;
	this.vidBufferArray = [];

	// Create a quad VBO for rendering textures
	this.quadVbo = this.createQuadVbo();

	// Initialize shaders
	this.shaderSources = GLU.resolveShaderSource(["render"]);
}

Renderer.prototype.createQuadVbo = function()
{
	var vbo = new GLU.VertexBuffer();
	vbo.addAttribute("Position", 3, this.gl.FLOAT, false);
	vbo.addAttribute("TexCoord", 2, this.gl.FLOAT, false);
	vbo.init(4);
	vbo.copy(new Float32Array([
		 1.0,  1.0, 0.0, 1.0, 1.0,
		-1.0,  1.0, 0.0, 0.0, 1.0,
		-1.0, -1.0, 0.0, 0.0, 0.0,
		 1.0, -1.0, 0.0, 1.0, 0.0
	]));
	return vbo;
}

Renderer.prototype.reset = function()
{
	this.time_ms = 0.0;
	this.frameNum = 0;
	this.compileShaders();

	let gl = GLU.gl;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

Renderer.prototype.compileShaders = function()
{
	var filterObj = vidfilt.getFilter();
	if (filterObj==null) return;
	
	// Inject code for the current filter:
	replacements = {};
	replacements.FILTER = filterObj.program();

	// shaderSources is a dict from name (e.g. "trace")
	// to a dict {v:vertexShaderSource, f:fragmentShaderSource}
	this.filterProgram = new GLU.Shader('render', this.shaderSources, replacements);
}

Renderer.prototype.getStats = function()
{
	stats = {};
	return stats;
}

Renderer.prototype.isEnabled = function()
{
	return this.enabled;
}

Renderer.prototype.render = function(videoElement, new_frame = false)
{
	var gl = GLU.gl;

	var timer_start = performance.now();

	// Bind filter program:
	let filterObj = vidfilt.getFilter();
	if (filterObj==null) return;
	this.filterProgram.bind();
	if (typeof filterObj.syncProgram !== "undefined")
	{
		filterObj.syncProgram(vidfilt, this.filterProgram);
	}
	
	this.filterProgram.uniformF("exposure", this.exposure);
	this.filterProgram.uniformF("invGamma", 1.0/this.gamma);
	this.filterProgram.uniform2F("textureSize", this.width, this.height);

	// Determine which frame buffer to overwrite
	let currentIndex = (this.frameNum % this.historySize);

	// Pull the current frame out of the video, as a GL texture
	let newframe = this.vidBufferArray[currentIndex];
	newframe.bind(0);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);
	newframe.setFilter();

	if (this.frameNum >= this.historySize)
	{
		// Determine history of previous buffers
		let frame0 = this.vidBufferArray[(currentIndex + this.historySize - 0) % this.historySize];
		let frame1 = this.vidBufferArray[(currentIndex + this.historySize - 1) % this.historySize];
		let frame2 = this.vidBufferArray[(currentIndex + this.historySize - 2) % this.historySize];
		let frame3 = this.vidBufferArray[(currentIndex + this.historySize - 3) % this.historySize];

		frame0.bind(0); this.filterProgram.uniformTexture("videoFrame",       frame0);
		frame1.bind(1); this.filterProgram.uniformTexture("videoFrameMinus1", frame1);
		frame2.bind(2); this.filterProgram.uniformTexture("videoFrameMinus2", frame2);
		frame3.bind(3); this.filterProgram.uniformTexture("videoFrameMinus3", frame3);
		
		// Draw texture to viewport aligned quad:
		this.quadVbo.bind();
		this.quadVbo.draw(this.filterProgram, this.gl.TRIANGLE_FAN);
	}

	var timer_end = performance.now();
	var frame_time_ms = (timer_end - timer_start);
	this.time_ms += frame_time_ms;

  if (new_frame)
	 this.frameNum += 1;
}

Renderer.prototype.resize = function(width, height)
{
	this.width = width;
	this.height = height;

	// Delete pre-existing buffers
	for (var n=0; n<this.vidBufferArray.length; ++n)
	{
		let vidBuffer = this.vidBufferArray[n];
		vidBuffer.delete();
	}

	// Create new array of video frame buffers
	this.vidBufferArray = [];
	for (var n=0; n<this.historySize; ++n)
	{
		let vidBuffer = new GLU.Texture(width, height, 3, false, true, true, null);
		this.vidBufferArray.push(vidBuffer);
	}

	this.reset();
}
