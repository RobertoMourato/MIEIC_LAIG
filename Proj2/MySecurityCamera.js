

class MySecurityCamera extends CGFobject {
    constructor(scene, ){
        super(scene);
        this.rectangle = new MyRectangle(scene, "", 0, 30, 0, 15);

        //this.shader = new CGFshader(this.scene.gl, 'shaders/camera.vert', 'shaders/camera.frag');
    }


    display() {
        //this.scene.setActiveShader(this.shader);
        this.rectangle.display();
        //this.scene.setActiveShader(this.scene.defaultShader);
    }
}