
/** 
* @constructor 
*/
function Filter() {}

/**
* Optionally (but usually), provide this function to set potential and raycaster initial state.
* This is called only once during execution, on loading the HTML page (or on global reset via 'R' key).
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
* Returns a chunk of GLSL code defining the 3D gravitational potential in which the light propagates.
* Light is deflected according to the local gradient of the potential.
* This function is mandatory! The code *must* define the function:
*```glsl
*      float POTENTIAL(vec3 X);
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
* @param {Gravy} gravy - The Gravy object
* @param {GLU.this.Shader} shader - wrapper of webGL fragment shader, see {@link GLU.this.Shader}
*/
Filter.prototype.syncProgram = function(vidfilt, program)
{

}
