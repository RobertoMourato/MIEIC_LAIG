class Cylinder2 extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.init();
    }

    init() {//AINDA VOU MUDAR OS CONTROL VERTEXES, JA N ME LEMBRO MT BEM, TENHO DE REVER
        this.controlVertexes1 = [
            [
                [-0.5, 0, 0.5, 1],
                [-0.5, 0, -0.5, 1]
            ],
            [
                [0.5, 0, 0.5, 1],
                [0.5, 0, -0.5, 1]
            ]
        ];

        this.controlVertexes2 = [
            [
                [-0.5, 0, 0.5, 1],
                [-0.5, 0, -0.5, 1]
            ],
            [
                [0.5, 0, 0.5, 1],
                [0.5, 0, -0.5, 1]
            ]
        ];

        this.patch1 = new Patch(this.scene, 2, 4, this.slices / 2, this.stacks, this.controlVertexes1);
        this.patch2 = new Patch(this.scene, 2, 4, this.slices / 2, this.stacks, this.controlVertexes2);
    }

    display() {
        this.patch1.display();
        this.patch2.display();
    }
}