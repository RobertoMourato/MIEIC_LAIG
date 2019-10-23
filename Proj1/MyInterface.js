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

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'activeView', this.scene.viewIds).name('Active View').onChange(this.scene.onCameraChange.bind(this.scene));


        //this.gui.add(this.scene, 'activeLight').name('Light').onChange(this.scene.onLightChecklistChange.bind(this.scene));
        if (this.scene.activeLight0 != null)
            this.gui.add(this.scene, 'activeLight0').name(this.scene.lightIds[0]).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        
        if (this.scene.activeLight1 != null)
            this.gui.add(this.scene, 'activeLight1').name(this.scene.lightIds[1]).onChange(this.scene.onLightChecklistChange.bind(this.scene));

        if (this.scene.activeLight2 != null)
            this.gui.add(this.scene, 'activeLight2').name(this.scene.lightIds[2]).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        
        if (this.scene.activeLight3 != null)
            this.gui.add(this.scene, 'activeLight3').name(this.scene.lightIds[3]).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        
        if (this.scene.activeLight4 != null)
            this.gui.add(this.scene, 'activeLight4').name(this.scene.lightIds[4]).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        
        if (this.scene.activeLight5 != null)
            this.gui.add(this.scene, 'activeLight5').name(this.scene.lightIds[5]).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        
        if (this.scene.activeLight6 != null)
            this.gui.add(this.scene, 'activeLight6').name(this.scene.lightIds[6]).onChange(this.scene.onLightChecklistChange.bind(this.scene));
        
        if (this.scene.activeLight7 != null)
            this.gui.add(this.scene, 'activeLight7').name(this.scene.lightIds[7]).onChange(this.scene.onLightChecklistChange.bind(this.scene));

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