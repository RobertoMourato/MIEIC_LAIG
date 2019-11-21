#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord+vec2(timeFactor*.01,0.0));

	if (coords.y > -0.75)
		gl_FragColor =  vec4(1.0,1.0,0.0, 1.0);
	else
	{
        gl_FragColor =  vec4(0.0,0.0,1.0, 1.0);
	}
}