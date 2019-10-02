/**
 * MySemiSphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class MySemiSphere extends CGFobject
{
	constructor(scene) 
	{
		super(scene);
		
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

        var ang = 2 * Math.PI / 5;
        var ang2 = (Math.PI/2) / 5;

	    for(var i = 0; i <= 5; i++)
	    {
	    	for(var j = 0; j < 5; j++)
	    	{    		
			this.vertices.push(Math.cos(ang2*i)*Math.cos(ang*j),Math.cos(ang2*i)*Math.sin(ang*j),Math.sin(ang2*i));
			this.normals.push(Math.cos(ang2*i)*Math.cos(ang*j),Math.cos(ang2*i)*Math.sin(ang*j),Math.sin(ang2*i));
	    	}
	    }
	for(var i = 0; i < 5;i++) {
		for(var j = 0; j < 5 - 1; j++) {
			this.indices.push(i*5 + j, i*5 + j+1, (i+1)*5 + j);
			this.indices.push(i*5 + j+1, (i+1)*5 + j+1, (i+1)*5 + j);
			this.indices.push( (i+1)*5 + j, i*5 + j+1, i*5 + j);
			this.indices.push( (i+1)*5 + j, (i+1)*5 + j+1,i*5 + j+1);
			this.texCoords.push(1, 1);
			this.texCoords.push(0, 0);
			this.texCoords.push(1, 0);
			this.texCoords.push(0, 1);
		}

		this.indices.push(i*5 + 5 - 1, i*5, (i+1)*5 + 5 - 1);
		this.indices.push(i*5, i*5 + 5, (i+1)*5 + 5 - 1);
		this.indices.push((i+1)*5 + 5 - 1, i*5,i*5 + 5 - 1);
		this.indices.push((i+1)*5 + 5 - 1,i*5 + 5 - 1,i*5);
	}
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();

	}
	updateTexCoord(coords){
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}