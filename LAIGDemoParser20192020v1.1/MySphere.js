/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);

        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var ang_slices = 2 * Math.PI / this.slices;
        var ang_stacks = (Math.PI / 2) / this.stacks;

        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                this.vertices.push(this.radius * Math.cos(ang_stacks * i) * Math.cos(ang_slices * j), this.radius * Math.cos(ang_stacks * i) * Math.sin(ang_slices * j), this.radius * Math.sin(ang_stacks * i));
                this.normals.push(Math.cos(ang_stacks * i) * Math.cos(ang_slices * j), Math.cos(ang_stacks * i) * Math.sin(ang_slices * j), Math.sin(ang_stacks * i));
                this.texCoords.push(j / this.slices, 0.5 + i / (2 * this.stacks));
                }
            //this.texCoords.push(1, 0.5 - i / this.stacks);
            
            for (var j = 0; j <= this.slices; j++) {
                this.vertices.push(this.radius * Math.cos(ang_stacks * i) * Math.cos(ang_slices * j), this.radius * Math.cos(ang_stacks * i) * Math.sin(ang_slices * j), this.radius * Math.sin(-ang_stacks * i));
                this.normals.push(Math.cos(-ang_stacks * i) * Math.cos(ang_slices * j), Math.cos(-ang_stacks * i) * Math.sin(ang_slices * j), Math.sin(-ang_stacks * i));
                this.texCoords.push(j / this.slices, 0.5 - i / (2 * this.stacks));
               
            }
            //this.texCoords.push(1, i / this.stacks + 0.5);
        }

        /*// Z+ pole vertex
        this.vertices.push(0,0,this.radius);
        this.normals.push(0,0,1);
        this.texCoords.push(0.5, 1);
        // Z- pole vertex
        this.vertices.push(0,0,-this.radius);
        this.normals.push(0,0,-1);
        this.texCoords.push(0.5, 0);
        
        var zPositiveIndex = (this.vertices.length / 3) - 2;
        var zNegativeIndex = (this.vertices.length / 3) - 1;*/

        for (var i = 0; i <= 2 * this.stacks; i+=2) {
            for (var j = 0; j < this.slices; j++) {

                var k0 =  i * (this.slices + 1) + j;
                var k1 = i * (this.slices + 1) + j + 1;
                var k2 = (i + 2) * (this.slices + 1) + (j + 1);
                var k3 = (i + 2) * (this.slices + 1) + j;

                /*if (j + 1 == this.slices){
                    k1 = i * this.slices;
                    k2 = (i + 2) * this.slices;
                }*/
                this.indices.push(k0, k1, k2);
                this.indices.push(k0, k2, k3);
                /*if (2 * this.stacks - i != 0){
                    this.indices.push(k0, k1, k2);
                    this.indices.push(k0, k2, k3);
                }
                if (2 * this.stacks - i == 0) 
                    this.indices.push(k0, k1, zPositiveIndex);*/
            }
            
            for (var j = 0; j < this.slices; j++) {

                var k0 =  (i + 1) * (this.slices + 1) + j;
                var k1 = (i + 1) * (this.slices + 1) + j + 1;
                var k2 = (i + 3) * (this.slices + 1) + (j + 1);
                var k3 = (i + 3) * (this.slices + 1) + j;

                this.indices.push(k0, k2, k1);
                this.indices.push(k0, k3, k2);
                /*if (2 * this.stacks - i != 0) {
                    this.indices.push(k0, k2, k1);
                    this.indices.push(k0, k3, k2);                    
                }
                if (2 * this.stacks - i == 0) 
                    this.indices.push(k1, k0, zNegativeIndex);*/
            }
            
        }

        
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }
    updateTexCoord(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}