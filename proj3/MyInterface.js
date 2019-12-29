/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        
        this.initKeys();

        return true;
    }

    initGUI() {
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI({autoPlace: true});

        /*var customContainer = document.getElementById('my-gui-container');
        customContainer.appendChild(gui.domElement);*/

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'activeView', this.scene.viewIds).name('Active View').onChange(this.scene.onCameraChange.bind(this.scene));

        this.gui.add(this.scene, 'activeCameraView', this.scene.viewIds).name('VideoCamera View').onChange(this.scene.onVideoCameraChange.bind(this.scene));


        //this.gui.add(this.scene, 'activeLight').name('Light').onChange(this.scene.onLightChecklistChange.bind(this.scene));
        /*var controller_names = [];
        for (var i=0; i<this.scene.activeLights.length; i++) {
            controller_names[i] = this.scene.activeLights[i];
            this.gui.add(controller_names, i, this.scene.activeLights[i]).name('Light' + i).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        }*/
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}