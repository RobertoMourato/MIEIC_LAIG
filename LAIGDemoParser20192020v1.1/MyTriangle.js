/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
		this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		//vector1=(x2-x1,y2-y1,z2-z1)
		//vector2=(x3-x1,y3-y1,z3-z1)
		//cross product:
		this.normal = [
			(this.y2 - this.y1) * (this.z3 - this.z1) - (this.y3 - this.y1) * (this.z2 - this.z1),
			-((this.x2 - this.x1) * (this.z3 - this.z1) - (this.x3 - this.x1) * (this.z2 - this.z1)),
			(this.x2 - this.x1) * (this.y3 - this.y1) - (this.x3 - this.x1) * (this.y2 - this.y1)
		];

		//Facing Z positive
		this.normals = [
			...this.normal,
			...this.normal,
			...this.normal
		];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	scaleFactors(length_s, length_t) {
		var a = Math.sqrt( Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
		var b = Math.sqrt( Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y3, 2) + Math.pow(this.z3 - this.z2, 2));
		var c = Math.sqrt( Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));

		var cosAlpha = (a * a - b * b + c * c) / (2* a* c);
		var sinAlpha = Math.sqrt(1-cosAlpha*cosAlpha);

		this.texCoords = [
			0, 0,
			a / length_s, 0,
			c*cosAlpha/length_s, c*sinAlpha / length_t
		];
		this.updateTexCoordsGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

