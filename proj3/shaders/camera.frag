#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float timeFactor;

void main() {
	vec2 textureCoords = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y); 
	//gl_FragColor = texture2D(uSampler, textureCoords);
	vec4 textureColor = texture2D(uSampler, textureCoords);

	/*	Radial Gradient
	*	
	*/
	float gradientValue = 1.0 - (((textureCoords.x - 0.5) * (textureCoords.x - 0.5) + (textureCoords.y - 0.5) * (textureCoords.y - 0.5)) / 0.35);
	if (gradientValue < 0.0) gradientValue = 0.0;

	vec4 gradientColor = vec4(textureColor.r * gradientValue, textureColor.g * gradientValue, textureColor.b * gradientValue, 1.0);
	gl_FragColor = gradientColor;

	/*	Stripes
	*
	*/
	float stripeValue = 2.0;
	if(mod(textureCoords.y * 175.0 - timeFactor, 2.0) > 1.0)
		gl_FragColor = vec4(gradientColor.rgb * stripeValue + 0.1, 1.0);
	
	/* 	REC spot
	* 	RECvalue - value to find if point texCoords(x,y) is inside the RECspot elipsis (center at (x->0.06, y->0.03))
	*/
	float RECvalue = (((textureCoords.x-0.06)*(textureCoords.x-0.06)) / (0.015*0.015))  + (((textureCoords.y - 1.0 + 0.1)*(textureCoords.y - 1.0 + 0.1)) / (0.03*0.03));
	if (RECvalue < 1.0 && mod(timeFactor, 3.0) < 1.5)
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

	// Frame
	if (textureCoords.x < 0.01 || textureCoords.x > 0.99 || textureCoords.y < 0.02 || textureCoords.y > 0.98)
		gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);

	
}