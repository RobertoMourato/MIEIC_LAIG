

class MySecurityCamera extends CGFobject {
    constructor(scene, ){
        super(scene);
        this.rectangle = new MyRectangle(scene, "", 0, 0.5, 0, 0.5);
        //console.log('Ola');
        this.shader = new CGFshader(this.scene.gl, 'shaders/camera.vert', 'shaders/camera.frag');
        //console.log('Bye');
    }

    initBuffers(){

    }


    display() {
        //this.scene.setActiveShader(this.shader);
        this.scene.setActiveShader(this.shader);
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        //this.scene.setActiveShader(this.scene.defaultShader);
    }
}