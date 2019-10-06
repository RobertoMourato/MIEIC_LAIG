/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        let deltaInner = 2 * Math.PI / this.slices;
        let deltaOuter = 2 * Math.PI / this.loops;

        for (let i = 0, innerAngle = 0; i <= this.slices; i++ , innerAngle += deltaInner) {
            for (let j = 0, outerAngle = 0; j <= this.loops; j++ , outerAngle += deltaOuter) {
                this.vertices.push((this.outer + this.inner * Math.cos(innerAngle)) * Math.sin(outerAngle),
                    (this.outer + this.inner * Math.cos(innerAngle)) * Math.cos(outerAngle),
                    this.inner * Math.sin(innerAngle));
                this.normals.push(Math.cos(innerAngle) * Math.cos(outerAngle),
                    Math.cos(innerAngle) * Math.sin(outerAngle),
                    Math.sin(innerAngle));
            }
        }

        for (let i = 0; i < this.loops; i++) {
            for (let j = 0; j < this.slices; j++) {
                this.indices.push(i * (this.loops + 1) + j + 1, i * (this.loops + 1) + j, (i + 1) * (this.loops + 1) + j);
                this.indices.push((i + 1) * (this.loops + 1) + j + 1, i * (this.loops + 1) + j + 1, (i + 1) * (this.loops + 1) + j);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
