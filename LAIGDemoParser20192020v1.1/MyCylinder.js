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

        var sa = Math.sin(ang);
        var saa = Math.sin(ang + alphaAng);
        var ca = Math.cos(ang);
        var caa = Math.cos(ang + alphaAng);

        this.vertices.push(this.base * ca, -this.base * sa, 0);
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
        this.texCoords.push(1 / this.slices, 0);

        ang += 2 * alphaAng;

        for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var ca = Math.cos(ang);

            this.vertices.push(this.base * ca, -this.base * sa, 0);
            this.vertices.push(this.top * ca, -this.top * sa, this.height);

            this.normals.push(ca, -sa, 0);
            this.normals.push(ca, -sa, this.height);

            this.indices.push((2 * i + 2), 2 * i, (2 * i + 1));
            this.indices.push((2 * i + 1), (2 * i + 3), (2 * i + 2));

            this.texCoords.push((i + 2) / this.slices, 1);
            this.texCoords.push((i + 2) / this.slices, 0);

            ang += alphaAng;
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
