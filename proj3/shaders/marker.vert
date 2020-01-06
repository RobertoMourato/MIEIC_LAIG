#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	vec3 offset = vec3(-1.0,0.5,0);
	vec4 vertex=vec4(aVertexPosition + offset, 1.0);

	gl_Position = vertex;
	vTextureCoord = aTextureCoord;
}

	