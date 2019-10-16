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

		var a_aux = Math.sqrt((this.x2 - this.x1) ^ 2 + (this.y2 - this.y1) ^ 2 + (this.z2 - this.z1) ^ 2);
		this.a = a_aux;
		var b_aux = Math.sqrt((this.x3 - this.x2) ^ 2 + (this.y3 - this.y2) ^ 2 + (this.z3 - this.z2) ^ 2);
		this.b = b_aux;
		var c_aux = Math.sqrt((this.x1 - this.x3) ^ 2 + (this.y1 - this.y3) ^ 2 + (this.z1 - this.z3) ^ 2);
		this.c = c_aux;
		var cos_aux = (this.a * this.a - this.b * this.b + this.c * this.c) / 2 * this.a * this.c;
		this.cos = cos_aux;
		var sin_aux = Math.sqrt(1 - this.cos * this.cos);
		this.sin=sin_aux;

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
			/*0, 0,
			this.a, 0,
			this.c*this.cos, this.c*this.sin*/
			0,1,
			1,1,
			0,0,
			1,0
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 */
	updateTexCoords(lengthS, lengthT) {
		this.texCoords = [
			0, 0,
			this.a/lengthS, 0,
			this.c*this.cos/lengthS, this.c*this.sin/lengthT
		];
		this.updateTexCoordsGLBuffers();
	}
}

