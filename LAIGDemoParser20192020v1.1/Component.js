/**
 * Component
 * @constructor
 */
class Component {
    constructor(id, transformation, materials, texture, length_s, length_t, children) {
        this.id = id;
        this.transformation = transformation;
        this.materials = materials;
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;
        this.children = children;
    }
}