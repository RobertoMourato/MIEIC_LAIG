class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super();

        this.activeKeyframeIndex = 0;
        this.keyframes = [];

        let initKeyframe = new Keyframe(0, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1});
        this.keyframes.push(initKeyframe);

        for (let i = 0; i < keyframes.length; i++){
            this.keyframes.push(keyframes[i]);
        }

        this.translate = initKeyframe.translate;
        this.rotate = initKeyframe.rotate;
        this.scale = initKeyframe.scale;

    }

    addKeyframe (Keyframe) {
        this.keyframes.push(Keyframe);
    }

    update(t) {
        
    }

    apply() {

    }
}

class Keyframe {
    constructor(instant, translateValues, rotateValues, scaleValues) {
        this.instant = instant;
        this.translate = translateValues;
        this.rotate = rotateValues;
        this.scale = scaleValues;
    }
}