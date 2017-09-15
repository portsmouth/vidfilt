var Shaders = {

'render-fragment-shader': `#version 300 es
precision highp float;

uniform sampler2D videoFrame;
uniform sampler2D videoFrameMinus1;
uniform sampler2D videoFrameMinus2;
uniform sampler2D videoFrameMinus3;

uniform float exposure;
uniform float invGamma;
uniform vec2 textureSize;

in vec2 vTexCoord;
out vec4 outputColor;

// User-code injection
FILTER

void main() 
{
	// Read video frame
	vec4 imagePixel = dofilter(videoFrame, videoFrameMinus1, videoFrameMinus2, videoFrameMinus3,
								vTexCoord, textureSize);
	
	// Apply exposure 
	float gain = pow(2.0, exposure);
	vec4 c = gain * imagePixel; 
	
	// Reinhard tonemap
	vec3 C = vec3(c.r/(1.0+c.r), c.g/(1.0+c.g), c.b/(1.0+c.b));

	// Apply gamma
	C = pow(C, vec3(invGamma));

	outputColor = vec4(C, 1.0);
}
`,

'render-vertex-shader': `#version 300 es
precision highp float;

in vec3 Position;
in vec2 TexCoord;
out vec2 vTexCoord;

void main(void)
{
	gl_Position = vec4(Position, 1.0);
	vTexCoord = TexCoord;
}
`,

}