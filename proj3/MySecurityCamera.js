

class MySecurityCamera extends CGFobject {
    constructor(scene){
        super(scene);
        this.rectangle = new MyRectangle(scene, "", 0, 0.55, 0, 0.55);
    }

    display() {
        this.rectangle.display();
    }
}