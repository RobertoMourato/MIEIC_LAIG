var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;

        this.materialStack = [];
        this.textureStack = [];
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.mode = "Player vs Player";
        this.activeMode = "Player vs Player";
        this.modes = ["Player vs Player", "Player vs CPU", "CPU vs CPU"];
        
        this.viewIds = [];
        this.activeCameraView = "";

        this.filenames = ['chameleon_1']
        this.filename = this.filenames[0];

        this.lightIds = [];

        this.gameorchestrator = new GameOrchestrator(this);
        this.setPickEnabled(true)
        
        this.interface.scene = this;
        this.interface.initGUI();        
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameras = [];
        console.log(this.graph.views);

        for (var i = 0; i < this.graph.views.length; i++) {
            var cam = this.graph.views[i];
            if (cam.type == "perspective")
                this.cameras[cam.id] = new CGFcamera(cam.angle, cam.near, cam.far, vec3.fromValues(cam.from[0], cam.from[1], cam.from[2]), vec3.fromValues(cam.to[0], cam.to[1], cam.to[2]));
            else this.cameras[cam.id] = new CGFcameraOrtho(cam.left, cam.right, cam.bottom, cam.top, cam.near, cam.far, vec3.fromValues(cam.from[0], cam.from[1], cam.from[2]), vec3.fromValues(cam.to[0], cam.to[1], cam.to[2]), vec3.fromValues(cam.up[0], cam.up[1], cam.up[2]));

            this.viewIds.push(cam.id);
            if (cam.enableView) {
                this.viewCamera = this.cameras[cam.id];
                this.videoCamera = this.cameras[cam.id];
                this.activeView = cam.id;
                this.activeCameraView = cam.id;
            }
        }
    }

    onModeChange(v) {
        this.mode = this.activeMode;
    }

    onVideoCameraChange(v) {
        this.videoCamera = this.cameras[this.activeCameraView];
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);

                if (light[0]) {
                    this.lights[i].enable();
                    this.lightIds.push(key);
                } else {
                    this.lights[i].disable();
                    this.lightIds.push(key);
                }
                this.lights[i].update();
                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initCameras();

        this.initLights();

        this.sceneInited = true;
    }

    play() {
        this.interface.initGameGUI();
        this.gameorchestrator.initSceneGraph()
        this.gameorchestrator.initGameBoard()
        this.gameorchestrator.setState("NextMove")
    }

    exit() {
        this.gameorchestrator.setState("Menu")
        this.interface.initMenuGUI();
    }

    update(t) {
        // Animations time management
        this.previousTime = this.previousTime || 0.0;
        this.deltaTime = (t - this.previousTime) / 1000 || 0.0;

        this.gameorchestrator.update(this.deltaTime)
        /*/this.animations = this.graph.animations;
        for (var i in this.animations) {
            this.animations[i].update(this.deltaTime);
        }*/
        this.previousTime = t;
    }

    /**
     * Displays the scene.
     */
    render(cam) {
        // ---- BEGIN Background, camera and axis setup
        if (this.sceneInited) {
            this.camera = cam;
            this.interface.setActiveCamera(this.camera);
            
            // Clear image and depth buffer everytime we update the scene
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            // Initialize Model-View matrix as identity (no transformation)
            this.updateProjectionMatrix();
            this.loadIdentity();

            // Apply transformations corresponding to the camera position relative to the origin
            this.applyViewMatrix();

            this.pushMatrix();
            this.axis.display();

            for (var i = 0; i < this.lights.length; i++) {
                this.lights[i].setVisible(true);
                this.lights[i].enable();
            }

            if (this.sceneInited) {
                this.gameorchestrator.orchestrate()
                this.gameorchestrator.managePick(this.pickMode, this.pickResults)
                this.clearPickRegistration()
                // Draw axis
                this.setDefaultAppearance();

                // Displays the scene (MySceneGraph function).
                this.gameorchestrator.display();

            }

            this.popMatrix();
            // ---- END Background, camera and axis setup
        }
    }

    display() {
        this.render(this.viewCamera);
    }

    pushMaterial(material) {
        this.materialStack.push(material);
    }

    popMaterial() {
        var material = this.materialStack.pop();
        return material;
    }

    pushTexture(texture) {
        this.textureStack.push(texture);
    }

    popTexture() {
        var texture = this.textureStack.pop();
        return texture;
    }
}