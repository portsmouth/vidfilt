
/** 
* @constructor 
*/
function Filter() {}

/**
* Optionally (but usually), provide this function to set initial state.
* @param {vidfilt} gravy - The Vidfilt object
*/
Filter.prototype.init = function(vidfilt)
{

}

/**
* Optionally, provide this function which generates the init code to re-generate 
* the current UI parameter settings. This will be dumped to the console (along with 
* the rest of the UI state) on pressing key 'O', allowing the scene and renderer
* state to be tweaked in the UI then saved by copy-pasting code into the init function.
*/
Filter.prototype.initGenerator = function()
{

}

/**
* Optional name (displayed in UI)
* @returns {String}
*/
Filter.prototype.getName = function() {  }

/**
* Optional clickable URL (displayed in UI)
* @returns {String}
*/
Filter.prototype.getURL = function() {  }

/////////////////////////////////////////////////////////////////////////////////////
// Shader code
/////////////////////////////////////////////////////////////////////////////////////

/**
* Returns a chunk of GLSL code defining the video filter. The API is be properly defined, but currently
* the filter is defined by a function of signature:
*```glsl
*     vec4 dofilter(sampler2D videoFrame,        // texture containing current frame of the video 
*                   sampler2D videoFrameMinus1,  // texture containing current-1 frame of the video 
*                   sampler2D videoFrameMinus2,  // texture containing current-2 frame of the video 
*                   sampler2D videoFrameMinus3,  // texture containing current-3 frame of the video 
*                   vec2 uv,                     // UV coords in [0,1] of the pixel whose color this function modifies
*                   vec2 textureSize)            // size in pixels of the frame textures
*```
* @returns {String}
*/
Filter.prototype.program = function()
{

}

/**
* Optional. Set up gui and callbacks for this scene via dat.GUI
* @param {GUI} gui - wrapper for dat.GUI object
*/
Filter.prototype.initGui = function(gui)            
{

}

/**
* Optional. Called whenever the UI is changed,
/* and must sync the params of the GLSL program with the current UI settings
* @param {Vidfilt} vidfilt - The Vidfilt object
* @param {GLU.this.Shader} program - wrapper of webGL program, see {@link GLU.this.Shader}
*/
Filter.prototype.syncProgram = function(vidfilt, program)
{

}
