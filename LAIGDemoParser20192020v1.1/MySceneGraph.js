var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        //this.onXMLMinorError("To do: Parse views and create cameras.");

        var defaultView = this.reader.getString(viewsNode, 'default');

        var children = viewsNode.children;

        this.views = [];
        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {

            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["from", "to"]);
                attributeTypes.push(...["position", "position"]);
            }


            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each light (conflict: ID = " + viewId + ")";

            // Default view
            var enableView = false;
            if (defaultView == this.reader.getString(children[i], 'id'))
                enableView = true;

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var from, to;
            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[attributeIndex], "view position for ID" + viewId);
                    if (!Array.isArray(aux))
                        return aux;

                    if (attributeNames[j] == "from") from = aux;
                    else if (attributeNames[j] == "to") to = aux;
                }
                else
                    return "view " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse near of the view for ID = " + viewId;

            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse far of the view for ID = " + viewId;

            if (children[i].nodeName == "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the view for ID = " + viewId;

                this.views.push({ id: viewId, enableView: enableView, type: children[i].nodeName, near: near, far: far, angle: angle, from: from, to: to });
            }
            // If nodeName == "ortho"
            else {
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left of the view for ID = " + viewId;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right of the view for ID = " + viewId;

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the view for ID = " + viewId;

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom of the view for ID = " + viewId;

                var upIndex = nodeNames.indexOf("up");

                // Retrieves the light target.
                var upPosition = [];
                if (upIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[upIndex], "target light for ID " + viewId);
                    if (!Array.isArray(aux))
                        return aux;

                    upPosition = aux;
                }
                else {
                    upPosition = [0, 1, 0];
                }

                this.views.push({ id: viewId, enableView: enableView, type: children[i].nodeName, near: near, far: far, left: left, right: right, top: top, bottom: bottom, from: from, to: to, up: upPosition });
            }

            numViews++;
        }

        if (numViews < 1)
            return "at least one view must be defined";

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        //this.onXMLMinorError("To do: Parse textures.");

        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            var URL = this.reader.getString(children[i], "file");
            if (URL == null)
                return "no URL defined for texture";

            this.textures[textureId] = new CGFtexture(this.scene, URL);

            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            //this.onXMLMinorError("To do: Parse materials.");

            var materialShininess = this.reader.getString(children[i], 'shininess');

            if (materialShininess == null)
                return "no Shininess defined for material " + materialID + ". ";

            grandChildren = children[i].children;

            var emission, ambient, diffuse, specular;
            var aux;
            for (var j = 0; j < grandChildren.length; j++) {
                var attributeName = grandChildren[j].nodeName;

                if (attributeName == "emission" || attributeName == "ambient" || attributeName == "diffuse" || attributeName == "specular") {
                    //var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    aux = this.parseColor(grandChildren[j], attributeName + " material for ID" + materialID);

                    if (!Array.isArray(aux))
                        return aux;

                    switch (attributeName) {
                        case "emission":
                            emission = aux;
                            break;
                        case "ambient":
                            ambient = aux;
                            break
                        case "diffuse":
                            diffuse = aux;
                            break;
                        case "specular":
                            specular = aux;
                            break;
                        default:
                            break;
                    }

                }
                else return "material " + attributeName + " undefined for ID = " + materialID;
            }

            //this.materials.push({ matId: materialID, shininess: materialShininess, emission: emission, ambient: ambient, diffuse: diffuse, specular: specular });
            this.materials[materialID] = new CGFappearance(this.scene);

            this.materials[materialID].setEmission(emission[0], emission[1], emission[2], emission[3]);
            this.materials[materialID].setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            this.materials[materialID].setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            this.materials[materialID].setSpecular(specular[0], specular[1], specular[2], specular[3]);
            this.materials[materialID].setShininess(materialShininess);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        //this.onXMLMinorError("To do: Parse scale transformations.");

                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        //this.onXMLMinorError("To do: Parse rotate transformations.");

                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');

                        if (axis == null)
                            return "no axis defined for transformation " + transformationID;
                        if (angle == null)
                            return "no angle defined for transformation " + transformationID;

                        switch (axis) {
                            case 'x':
                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, vec3.fromValues(1, 0, 0));
                                break;
                            case 'y':
                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, vec3.fromValues(0, 1, 0));
                            case 'z':
                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, vec3.fromValues(0, 0, 1));
                            default:
                                break;
                        }
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                this.primitives[primitiveId] = triangle;
            }
            else if (primitiveType == 'cylinder') {
                var base, top, height, slices_c, stacks_c;

                // slices
                var slices_c = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices_c != null && !isNaN(slices_c)))
                    return "unable to parse slices of the primitive coordinates with ID = " + primitiveId;

                // stacks
                var stacks_c = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks_c != null && !isNaN(stacks_c)))
                    return "unable to parse stacks of the primitive coordinates with ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates with ID = " + primitiveId;

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base radius of the primitive coordinates with ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top radius of the primitive coordinates with ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, slices_c, stacks_c, height, base, top);
                this.primitives[primitiveId] = cylinder;

            }
            else if (primitiveType == 'sphere') {
                var radius, slices_s, stacks_s;

                radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates with ID = " + primitiveId;

                slices_s = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices_s != null && !isNaN(slices_s)))
                    return "unable to parse slices of the primitive coordinates with ID = " + primitiveId;

                stacks_s = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks_s != null && !isNaN(stacks_s)))
                    return "unable to parse stacks of the primitive coordinates with ID = " + primitiveId;

                console.warn("To Do: 'unable to parse' conditions");

                var sphere = new MySphere(this.scene, radius, slices_s, stacks_s);
                this.primitives[primitiveId] = sphere;

            }
            else if (primitiveType == 'torus') {
                var inner, outer, slices_t, loops_t;

                inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner radius of the primitive coordinates with ID = " + primitiveId;

                outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outter radius of the primitive coordinates with ID = " + primitiveId;

                slices_t = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices_t != null && !isNaN(slices_t)))
                    return "unable to parse slices of the primitive coordinates with ID = " + primitiveId;

                loops_t = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops_t != null && !isNaN(loops_t)))
                    return "unable to parse loops of the primitive coordinates with ID = " + primitiveId;

                var torus = new MyTorus(this.scene, inner, outer, slices_t, loops_t);
                this.primitives[primitiveId] = torus;

            }
            else {
                this.onXMLMinorError("Unexistant primitive.");

            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            if (transformationIndex == null)
                this.onXMLMinorError("No transformation defined for " + componentID + ". ");

            var materialsIndex = nodeNames.indexOf("materials");
            if (materialsIndex == null)
                this.onXMLMinorError("No materials defined for " + componentID + ". ");

            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == null)
                this.onXMLMinorError("No texture defined for " + componentID + ". ");

            var childrenIndex = nodeNames.indexOf("children");
            if (childrenIndex == null)
                this.onXMLMinorError("No children defined for " + componentID + ". ");

            var transformation;
            var materialIds = [];
            var materials = [];
            var texture = [];
            var componentIds = [];
            var primitiveIds = [];

            // Transformations
            transformation = mat4.create();

            var tranformationType;
            grandgrandChildren = grandChildren[transformationIndex].children;
            if (grandgrandChildren.length != 0 && grandgrandChildren != null){
                if (grandgrandChildren[0].nodeName == "transformationref")
                    tranformationType = "reference";
                else tranformationType = "newTransformation";
            }

            if (tranformationType == "reference" && grandgrandChildren.length > 1)
                this.onXMLMinorError("Only one tranformation must be defined for " + componentID + ". ");

            for (var j = 0; j < grandgrandChildren.length; j++) {
                if (tranformationType == "reference") {
                    if (grandgrandChildren[j].nodeName != "transformationref") {
                        break;
                    }
                    var transformationId = this.reader.getString(grandgrandChildren[j], 'id');
                    transformation = this.transformations[transformationId];
                }
                if (tranformationType == "newTransformation") {
                    if (grandgrandChildren[j].nodeName != "translate" && grandgrandChildren[j].nodeName != "rotate" && grandgrandChildren[j].nodeName != "scale") {
                        break;
                    }

                    switch (grandgrandChildren[j].nodeName) {
                        case 'translate':
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for ID " + transformationId);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            transformation = mat4.translate(transformation, transformation, coordinates);
                            break;

                        case 'scale':
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for ID " + transformationId);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            transformation = mat4.scale(transformation, transformation, coordinates);
                            break;

                        case 'rotate':
                            var axis = this.reader.getString(grandgrandChildren[j], 'axis');
                            var angle = this.reader.getFloat(grandgrandChildren[j], 'angle');

                            if (axis == null)
                                return "no axis defined for transformation " + transformationId;
                            if (angle == null)
                                return "no angle defined for transformation " + transformationId;

                            switch (axis) {
                                case 'x':
                                    transformation = mat4.rotate(transformation, transformation, angle * DEGREE_TO_RAD, vec3.fromValues(1, 0, 0));
                                    break;
                                case 'y':
                                    transformation = mat4.rotate(transformation, transformation, angle * DEGREE_TO_RAD, vec3.fromValues(0, 1, 0));
                                    break;
                                case 'z':
                                    transformation = mat4.rotate(transformation, transformation, angle * DEGREE_TO_RAD, vec3.fromValues(0, 0, 1));
                                default:
                                    break;
                            }
                            break;
                    }

                }
            }

            // Materials    
            grandgrandChildren = grandChildren[materialsIndex].children;
            if (grandgrandChildren.length == 0 || grandgrandChildren == null)
                this.onXMLMinorError("At least one material must be defined for " + componentID + ". ");

            for (var k = 0; k < grandgrandChildren.length; k++) {
                var materialId = this.reader.getString(grandgrandChildren[k], 'id');
                materialIds.push(materialId);

                if (materialId != "inherit") {
                    var material = this.materials[materialId];
                    materials[materialId] = material;
                }
            }

            // Texture 
            var textureId = this.reader.getString(grandChildren[textureIndex], 'id');

            if (textureId == null){
                this.onXMLMinorError("No texture ID defined for component " + componentID);
            }

            var length_s;
            var length_t;

            if (textureId != "inherit" && textureId != "none") {
                length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
            } else {
                if (this.reader.getFloat(grandChildren[textureIndex], 'length_s') != null || this.reader.getFloat(grandChildren[textureIndex], 'length_t') != null)
                    this.onXMLMinorError("Scale factors must be null for component " + componentID);
            }

            texture = this.textures[textureId];

            // Children
            grandgrandChildren = grandChildren[childrenIndex].children;
            if (grandgrandChildren.length == 0 || grandgrandChildren == null)
                this.onXMLMinorError("At least one component or primitive must be defined for component " + componentID + ". ");

            for (var l = 0; l < grandgrandChildren.length; l++) {
                if (grandgrandChildren[l].nodeName != 'componentref' && grandgrandChildren[l].nodeName != 'primitiveref') {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[l].nodeName + ">");
                    continue;
                }

                if (grandgrandChildren[l].nodeName == 'componentref')
                    componentIds.push(this.reader.getString(grandgrandChildren[l], 'id'));
                else if (grandgrandChildren[l].nodeName == 'primitiveref')
                    primitiveIds.push(this.reader.getString(grandgrandChildren[l], 'id'));

            }
            var component = new Component(componentID, transformation, materialIds, materials, textureId, texture, length_s, length_t, componentIds, primitiveIds);
            this.components[componentID] = component;
        }

        for (var key in this.components) {
            var component = this.components[key];
            for (var i = 0; i < component.componentIds.length; i++) {
                var id = component.componentIds[i];
                component.componentChildren.push(this.components[id]);
            }

            for (var i = 0; i < component.primitiveIds.length; i++) {
                var id = component.primitiveIds[i];
                component.primitiveChildren.push(this.primitives[id]);
            }
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    updateMaterials() {
        for (var key in this.components) {
            var component = this.components[key];
            component.updateMaterial();
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph
        var identity = mat4.create();
        this.processNode(this.components[this.idRoot], identity, this.materials["defaultMaterial"]);
        //To test the parsing/creation of the primitives, call the display function directly
        /*this.primitives['demoRectangle'].display();
        this.primitives['demoTriangle'].display();*/
        //this.primitives['demoCylinder'].display();
        //this.primitives['demoSphere'].display();
        //this.primitives['demoTorus'].display();
    }

    processNode(component, parentTransformationMatrix, parentMaterial, parentTexture, parentLength_s, parentLength_t) {
        //console.warn("To do: Tratamento de erros");
        if (component == null) {
            console.warn("Null component");
            return;
        }

        var transformation = mat4.create();
        var material;
        var texture;
        var ls;
        var lt;

        // Updates transformation matrix
        mat4.multiply(transformation, parentTransformationMatrix, component.transformation);


        // Updates material
        var activeMaterial = component.getActiveMaterialId();

        if (activeMaterial != "inherit")
            material = component.materials[activeMaterial];
        else material = parentMaterial;

        // Updates texture and texture coordinates
        if (component.textureId == "inherit") {
            texture = parentTexture;
            ls = parentLength_s;
            lt = parentLength_t;
        }
        else if (texture == "none")
            texture = null;
        else {
            texture = component.texture;
            ls = component.length_s;
            lt = component.length_t
        }


            var children = component.primitiveChildren;
            for (var i = 0; i < children.length; i++) {
                // save
                this.scene.pushTexture({ texture: texture, ls: ls, lt: lt });
                this.scene.pushMaterial(material);
                this.scene.pushMatrix();
                
                this.processPrimitiveNode(children[i], transformation, material, texture, ls, lt);
                
                this.scene.popMatrix();
                material = this.scene.popMaterial(material);                
                var tex = this.scene.popTexture();
                texture = tex.texture;
                ls = tex.ls;
                lt = tex.lt;
            }

            children = component.componentChildren;
            for (var i = 0; i < children.length; i++) {
                // save 
                this.scene.pushTexture({ texture: texture, ls: ls, lt: lt });
                this.scene.pushMaterial(material);
                this.scene.pushMatrix();

                this.processNode(children[i], transformation, material, texture, ls, lt);
                
                this.scene.popMatrix();
                material = this.scene.popMaterial(material);                
                var tex = this.scene.popTexture();
                texture = tex.texture;
                ls = tex.ls;
                lt = tex.lt;
            }
    }

    processPrimitiveNode(primitive, parentTransformationMatrix, parentMaterial, parentTexture, parentLength_s, parentLength_t) {
        if (primitive != null) {
            
            
            if (parentTexture != null){
                // update primitive tex_coords
                if (parentLength_s != null && parentLength_t != null)
                    primitive.scaleFactors(parentLength_s, parentLength_t);

                parentMaterial.setTexture(parentTexture);
                parentMaterial.setTextureWrap('REPEAT', 'REPEAT');
            }
            parentMaterial.apply();
            this.scene.multMatrix(parentTransformationMatrix);
            primitive.display();

            parentMaterial.setTexture(null);
        }
    }
}