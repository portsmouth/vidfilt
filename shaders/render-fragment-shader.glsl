precision highp float;

uniform sampler2D videoFrame;
uniform sampler2D videoFrameMinus1;
uniform sampler2D videoFrameMinus2;
uniform sampler2D videoFrameMinus3;

uniform float exposure;
uniform float invGamma;
uniform vec2 textureSize;

varying vec2 vTexCoord;

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

	gl_FragColor = vec4(C, 1.0);
}
