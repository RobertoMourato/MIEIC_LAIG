/**
* MyCylinder
* @constructor
*/
class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks, height, base, top) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.base = base;
        this.top = top;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        var z;
        var alphaZ = this.height / this.stacks;

        var radius;
        var alphaRadius = (this.top - this.base) / this.stacks;

        /*var sa = Math.sin(ang);
        var saa = Math.sin(ang + alphaAng);
        var ca = Math.cos(ang);
        var caa = Math.cos(ang + alphaAng);*/

        /*this.vertices.push(this.base * ca, -this.base * sa, 0);
        this.vertices.push(this.top * ca, -this.top * sa, this.height);
        this.vertices.push(this.base * caa, -this.base * saa, 0);
        this.vertices.push(this.top * caa, -this.top * saa, this.height);

        this.normals.push(ca, -sa, 0);
        this.normals.push(ca, -sa, this.height);
        this.normals.push(caa, -saa, 0);
        this.normals.push(caa, -saa, this.height);

        this.texCoords.push(0, 1);
        this.texCoords.push(0, 0);
        this.texCoords.push(1 / this.slices, 1);
        this.texCoords.push(1 / this.slices, 0);*/

        //ang += 2 * alphaAng;

        
        for (var i = 0; i <= this.slices; i++) {
            z = 0;
            radius = this.base;

            for (var j = 0; j < this.stacks; j++) {
                var ca = Math.cos(ang);
                var sa = Math.sin(ang);

                this.vertices.push(radius * ca, radius * sa, z);

                this.normals.push(ca, -sa, z);
                
                /*  Indices
                      p2 ___ p4
                        |  /|
                        | / |
                        |/__| 
                      p1     p3
                */
                var p1 = j + i * (this.stacks + 1);
                var p2 = p1 + 1;
                var p3 = j + (i + 1) * (this.stacks + 1);
                var p4 = p3 + 1;

                if (i != this.slices){
                    this.indices.push(p1, p3, p4);
                    this.indices.push(p1, p4, p2);
                }

                this.texCoords.push(i / this.slices, j / this.stacks);

                z += alphaZ;
                radius += alphaRadius;
            }

            this.vertices.push(radius * ca, radius * sa, z);
            this.normals.push(ca, -sa, z);
            this.texCoords.push(i / this.slices, 1);

            ang += alphaAng;
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    scaleFactors(length_s, length_t) {
	    return;
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
