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
        this.gui.add(this.scene, 'filename', this.scene.filenames).name('Ambient')
                
        this.mode = this.gui.add(this.scene, 'activeMode', this.scene.modes).name('Mode').onChange(this.scene.onModeChange.bind(this.scene));
        this.bot1 = this.gui.add(this.scene, 'bot1ActiveLevel', this.scene.levels).name('Bot1 Level').onChange(this.scene.onBot1Change.bind(this.scene));
        this.bot2 = this.gui.add(this.scene, 'bot2ActiveLevel', this.scene.levels).name('Bot2 Level').onChange(this.scene.onBot2Change.bind(this.scene));

        this.play = this.gui.add(this.scene, 'play').name('Play')
    }

    initMenuGUI() {
        this.gui.remove(this.exit)
        this.mode = this.gui.add(this.scene, 'activeMode', this.scene.modes).name('Mode').onChange(this.scene.onModeChange.bind(this.scene)); 
        
        this.bot1 = this.gui.add(this.scene, 'bot1ActiveLevel', this.scene.levels).name('Bot1 Level').onChange(this.scene.onBot1Change.bind(this.scene));
        this.bot2 = this.gui.add(this.scene, 'bot2ActiveLevel', this.scene.levels).name('Bot2 Level').onChange(this.scene.onBot2Change.bind(this.scene));
        
        this.play = this.gui.add(this.scene, 'play').name('Play')

    }

    initGameGUI() {
        this.gui.remove(this.mode)
        this.gui.remove(this.play)
        this.gui.remove(this.bot1)
        this.gui.remove(this.bot2)
        this.exit = this.gui.add(this.scene, 'exit').name('Exit')
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