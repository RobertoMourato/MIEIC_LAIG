class Plane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.init();
    }

    init() {
        this.controlVertexes = [
            [
                [-0.5, 0, 0.5, 1],
                [-0.5, 0, -0.5, 1]
            ],
            [
                [0.5, 0, 0.5, 1],
                [0.5, 0, -0.5, 1]
            ]
        ]
        this.nurbsSurface = new CFGnurbsSurface(1, 1, this.controlVertexes);
        this.nurbsObject = new CFGnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
    }

    display() {
        this.nurbsObject.display();
    }
}