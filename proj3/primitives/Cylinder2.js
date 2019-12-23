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

    init() {
        this.controlVertexes1 = [
                [-this.base, 0, 0, 1],
                [-this.base, this.base*4/3, 0, 1],
                [this.base, this.base*4/3, 0, 1],
                [this.base, 0, 0, 1],
                [-this.top, 0, this.height, 1],
                [-this.top, this.top*4/3, this.height, 1],
                [this.top, this.top*4/3, this.height, 1],
                [this.top, 0, this.height, 1]
        ];

        this.controlVertexes2 = [
                [this.base, 0, 0, 1],
                [this.base, -this.base*4/3, 0, 1],
                [-this.base, -this.base*4/3, 0, 1],
                [-this.base, 0, 0, 1],
                [this.top, 0, this.height, 1],
                [this.top, -this.top*4/3, this.height, 1],
                [-this.top, -this.top*4/3, this.height, 1],
                [-this.top, 0, this.height, 1]
        ];

        this.patch1 = new Patch(this.scene, 2, 4, this.slices / 2, this.stacks, this.controlVertexes1);
        this.patch2 = new Patch(this.scene, 2, 4, this.slices / 2, this.stacks, this.controlVertexes2);
    }

    display() {
        this.patch1.display();
        this.patch2.display();
    }
}