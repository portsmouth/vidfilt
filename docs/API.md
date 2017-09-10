
## Classes

<dl>
<dt><a href="#Vidfilt">Vidfilt</a></dt>
<dd></dd>
<dt><a href="#Renderer">Renderer</a></dt>
<dd></dd>
<dt><a href="#Filter">Filter</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#GLU">GLU</a> : <code>object</code></dt>
<dd><p>Namespace for webGL utility wrappers.
Functions for loading shader uniform variables are exposed to the user
for convenience.</p>
</dd>
</dl>

<a name="Vidfilt"></a>

## Vidfilt
**Kind**: global class  

* [Vidfilt](#Vidfilt)
    * [new Vidfilt(sceneObj)](#new_Vidfilt_new)
    * [.getVersion()](#Vidfilt+getVersion) ⇒ <code>Array</code>
    * [.getRenderer()](#Vidfilt+getRenderer) ⇒ [<code>Renderer</code>](#Renderer)
    * [.getGUI()](#Vidfilt+getGUI) ⇒ <code>GUI</code>
    * [.getGLContext()](#Vidfilt+getGLContext) ⇒ <code>WebGLRenderingContext</code>
    * [.showGUI(show)](#Vidfilt+showGUI)

<a name="new_Vidfilt_new"></a>

### new Vidfilt(sceneObj)
Vidfilt is the global object providing access to all functionality in the system.


| Param | Type | Description |
| --- | --- | --- |
| sceneObj | [<code>Filter</code>](#Filter) | The object defining the filter we apply |

<a name="Vidfilt+getVersion"></a>

### vidfilt.getVersion() ⇒ <code>Array</code>
Returns the current version number of the Vidfilt system, in the format [1, 2, 3] (i.e. major, minor, patch version)

**Kind**: instance method of [<code>Vidfilt</code>](#Vidfilt)  
<a name="Vidfilt+getRenderer"></a>

### vidfilt.getRenderer() ⇒ [<code>Renderer</code>](#Renderer)
Access to the Renderer object

**Kind**: instance method of [<code>Vidfilt</code>](#Vidfilt)  
<a name="Vidfilt+getGUI"></a>

### vidfilt.getGUI() ⇒ <code>GUI</code>
Access to the GUI object

**Kind**: instance method of [<code>Vidfilt</code>](#Vidfilt)  
<a name="Vidfilt+getGLContext"></a>

### vidfilt.getGLContext() ⇒ <code>WebGLRenderingContext</code>
**Kind**: instance method of [<code>Vidfilt</code>](#Vidfilt)  
**Returns**: <code>WebGLRenderingContext</code> - The webGL context  
<a name="Vidfilt+showGUI"></a>

### vidfilt.showGUI(show)
Programmatically show or hide the dat.GUI UI

**Kind**: instance method of [<code>Vidfilt</code>](#Vidfilt)  

| Param | Type | Description |
| --- | --- | --- |
| show | <code>Boolean</code> | toggle |

<a name="Renderer"></a>

## Renderer
**Kind**: global class  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| exposure | <code>number</code> | <code>3.0</code> | image exposure, on a log scale |
| gamma | <code>number</code> | <code>2.2</code> | image gamma correction |

<a name="new_Renderer_new"></a>

### new Renderer()
Interface to the renderer.

<a name="Filter"></a>

## Filter
**Kind**: global class  

* [Filter](#Filter)
    * [.init(gravy)](#Filter+init)
    * [.initGenerator()](#Filter+initGenerator)
    * [.getName()](#Filter+getName) ⇒ <code>String</code>
    * [.getURL()](#Filter+getURL) ⇒ <code>String</code>
    * [.program()](#Filter+program) ⇒ <code>String</code>
    * [.initGui(gui)](#Filter+initGui)
    * [.syncProgram(gravy, shader)](#Filter+syncProgram)

<a name="Filter+init"></a>

### filter.init(gravy)
Optionally (but usually), provide this function to set potential and raycaster initial state.
This is called only once during execution, on loading the HTML page (or on global reset via 'R' key).

**Kind**: instance method of [<code>Filter</code>](#Filter)  

| Param | Type | Description |
| --- | --- | --- |
| gravy | <code>vidfilt</code> | The Vidfilt object |

<a name="Filter+initGenerator"></a>

### filter.initGenerator()
Optionally, provide this function which generates the init code to re-generate 
the current UI parameter settings. This will be dumped to the console (along with 
the rest of the UI state) on pressing key 'O', allowing the scene and renderer
state to be tweaked in the UI then saved by copy-pasting code into the init function.

**Kind**: instance method of [<code>Filter</code>](#Filter)  
<a name="Filter+getName"></a>

### filter.getName() ⇒ <code>String</code>
Optional name (displayed in UI)

**Kind**: instance method of [<code>Filter</code>](#Filter)  
<a name="Filter+getURL"></a>

### filter.getURL() ⇒ <code>String</code>
Optional clickable URL (displayed in UI)

**Kind**: instance method of [<code>Filter</code>](#Filter)  
<a name="Filter+program"></a>

### filter.program() ⇒ <code>String</code>
Returns a chunk of GLSL code defining the 3D gravitational potential in which the light propagates.
Light is deflected according to the local gradient of the potential.
This function is mandatory! The code *must* define the function:
```glsl
     float POTENTIAL(vec3 X);
```

**Kind**: instance method of [<code>Filter</code>](#Filter)  
<a name="Filter+initGui"></a>

### filter.initGui(gui)
Optional. Set up gui and callbacks for this scene via dat.GUI

**Kind**: instance method of [<code>Filter</code>](#Filter)  

| Param | Type | Description |
| --- | --- | --- |
| gui | <code>GUI</code> | wrapper for dat.GUI object |

<a name="Filter+syncProgram"></a>

### filter.syncProgram(gravy, shader)
Optional. Called whenever the UI is changed,
/* and must sync the params of the GLSL program with the current UI settings

**Kind**: instance method of [<code>Filter</code>](#Filter)  

| Param | Type | Description |
| --- | --- | --- |
| gravy | <code>Gravy</code> | The Gravy object |
| shader | [<code>this.Shader</code>](#GLU.this.Shader) | wrapper of webGL fragment shader, see [this.Shader](#GLU.this.Shader) |

<a name="GLU"></a>

## GLU : <code>object</code>
Namespace for webGL utility wrappers.
Functions for loading shader uniform variables are exposed to the user
for convenience.

**Kind**: global namespace  

* [GLU](#GLU) : <code>object</code>
    * [.this.Shader](#GLU.this.Shader)
        * [new this.Shader()](#new_GLU.this.Shader_new)
        * [.uniformI(name, i)](#GLU.this.Shader.uniformI)
        * [.uniformF(name, f)](#GLU.this.Shader.uniformF)
        * [.uniform2F(name, f1, f2)](#GLU.this.Shader.uniform2F)
        * [.uniform1Fv(name, fvec)](#GLU.this.Shader.uniform1Fv)
        * [.uniform2Fv(name, fvec2)](#GLU.this.Shader.uniform2Fv)
        * [.uniform3F(name, f1, f2, f3)](#GLU.this.Shader.uniform3F)
        * [.uniform3Fv(name, fvec3)](#GLU.this.Shader.uniform3Fv)
        * [.uniform4F(name, f1, f2, f3, f4)](#GLU.this.Shader.uniform4F)
        * [.uniform4Fv(name, fvec4)](#GLU.this.Shader.uniform4Fv)
        * [.uniformMatrix4fv(name, matrixArray16)](#GLU.this.Shader.uniformMatrix4fv)

<a name="GLU.this.Shader"></a>

### GLU.this.Shader
**Kind**: static class of [<code>GLU</code>](#GLU)  

* [.this.Shader](#GLU.this.Shader)
    * [new this.Shader()](#new_GLU.this.Shader_new)
    * [.uniformI(name, i)](#GLU.this.Shader.uniformI)
    * [.uniformF(name, f)](#GLU.this.Shader.uniformF)
    * [.uniform2F(name, f1, f2)](#GLU.this.Shader.uniform2F)
    * [.uniform1Fv(name, fvec)](#GLU.this.Shader.uniform1Fv)
    * [.uniform2Fv(name, fvec2)](#GLU.this.Shader.uniform2Fv)
    * [.uniform3F(name, f1, f2, f3)](#GLU.this.Shader.uniform3F)
    * [.uniform3Fv(name, fvec3)](#GLU.this.Shader.uniform3Fv)
    * [.uniform4F(name, f1, f2, f3, f4)](#GLU.this.Shader.uniform4F)
    * [.uniform4Fv(name, fvec4)](#GLU.this.Shader.uniform4Fv)
    * [.uniformMatrix4fv(name, matrixArray16)](#GLU.this.Shader.uniformMatrix4fv)

<a name="new_GLU.this.Shader_new"></a>

#### new this.Shader()
Represents a webGL vertex or fragment shader:

<a name="GLU.this.Shader.uniformI"></a>

#### this.Shader.uniformI(name, i)
Provide an integer (via uniform1i) to the currently bound shader

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| i | <code>number</code> | The integer value |

<a name="GLU.this.Shader.uniformF"></a>

#### this.Shader.uniformF(name, f)
Provide a float (via uniform1f) to the currently bound shader

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| f | <code>number</code> | The float value |

<a name="GLU.this.Shader.uniform2F"></a>

#### this.Shader.uniform2F(name, f1, f2)
Provide a vec2 uniform (via uniform2f) to the currently bound shader

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| f1 | <code>number</code> | The first float value |
| f2 | <code>number</code> | The second float value |

<a name="GLU.this.Shader.uniform1Fv"></a>

#### this.Shader.uniform1Fv(name, fvec)
Provide an array of floats (via uniform1Fv) to the currently bound shader
  i.e. the shader declares e.g. `uniform float values[19];`

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| fvec | <code>Float32Array</code> | An array of floats |

<a name="GLU.this.Shader.uniform2Fv"></a>

#### this.Shader.uniform2Fv(name, fvec2)
Provide an array of vec2 (via uniform2fv) to the currently bound shader
  i.e. the shader declares e.g. `uniform vec2 vectors[19];`

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| fvec2 | <code>Float32Array</code> | An array of floats, 2 per vector |

<a name="GLU.this.Shader.uniform3F"></a>

#### this.Shader.uniform3F(name, f1, f2, f3)
Provide a vec3 uniform (via uniform3f) to the currently bound shader

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| f1 | <code>number</code> | The first float value |
| f2 | <code>number</code> | The second float value |
| f3 | <code>number</code> | The third float value |

<a name="GLU.this.Shader.uniform3Fv"></a>

#### this.Shader.uniform3Fv(name, fvec3)
Provide an array of vec3 (via uniform3fv) to the currently bound shader
  i.e. the shader declares e.g. `uniform vec3 vectors[19];`

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| fvec3 | <code>Float32Array</code> | An array of floats, 3 per vector |

<a name="GLU.this.Shader.uniform4F"></a>

#### this.Shader.uniform4F(name, f1, f2, f3, f4)
Provide a vec4 uniform (via uniform4F) to the currently bound shader

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| f1 | <code>number</code> | The first float value |
| f2 | <code>number</code> | The second float value |
| f3 | <code>number</code> | The third float value |
| f4 | <code>number</code> | The fourth float value |

<a name="GLU.this.Shader.uniform4Fv"></a>

#### this.Shader.uniform4Fv(name, fvec4)
Provide an array of vec4 (via uniform4fv) to the currently bound shader
  i.e. the shader declares e.g. `uniform vec4 vectors[19];`

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| fvec4 | <code>Float32Array</code> | An array of floats, 4 per vector |

<a name="GLU.this.Shader.uniformMatrix4fv"></a>

#### this.Shader.uniformMatrix4fv(name, matrixArray16)
Provide a matrix (via uniformMatrix4fv) to the currently bound shader
 i.e. the shader declares e.g. `uniform mat4 matrix;`

**Kind**: static method of [<code>this.Shader</code>](#GLU.this.Shader)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform variable |
| matrixArray16 | <code>Float32Array</code> | An array of 16 floats |


