

class MySecurityCamera extends CGFobject {
    constructor(scene){
        super(scene);
        this.rectangle = new MyRectangle(scene, "", 0, 0.55, 0, 0.55);
    }

    display() {
        //this.scene.pushMatrix();
        //this.scene.rotate(-Math.PI, 0, 0, 1);
        //this.scene.rotate(-Math.PI, 0, 1, 0);
        this.rectangle.display();
        //this.scene.popMatrix();
    }
}