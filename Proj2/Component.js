/**
 * Component
 * @constructor
 */
class Component {
    constructor(id, transformation, animation, materialIds, materials, textureId, texture, length_s, length_t, componentIds, primitiveIds) {
        this.id = id;

        this.transformation = transformation;

        this.animation = animation;
        
        this.activeMaterialIndex = 0;
        this.materialIds = materialIds;
        this.materials = materials;

        this.textureId = textureId;
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;

        this.componentIds = componentIds;
        this.componentChildren = [];

        this.primitiveIds = primitiveIds;
        this.primitiveChildren = [];
    }

    getActiveMaterialId() {
        return this.materialIds[this.activeMaterialIndex];
    }

    updateMaterial(){
        this.activeMaterialIndex++;

        if (this.activeMaterialIndex >= this.materialIds.length)
            this.activeMaterialIndex = 0;
    }


}