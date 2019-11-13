class Patch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;
        this.init();
    }

    init() {
        this.controlVertexes = [];

        for (var i = 0; i < this.npointsU; i++) {
            var aux = [];
            for (var j = 0; j < this.npointsV; j++) {
                aux.push([this.controlPoints[this.npointsV * i + j][0], this.controlPoints[this.npointsV * i + j][1], this.controlPoints[this.npointsV * i + j][2], 1]);
            }
            this.controlVertexes.push(aux);
        }

        this.nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlVertexes);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
    }

    display() {
        this.nurbsObject.display();
    }
}