class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super();

        this.activeKeyframe;
        
        this.keyframes = keyframes;
        if (keyframes == null)
            this.keyframes = [];

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
    constructor(instant, transformation) {
        this.instant = instant;
        this.transformation = transformation;
    }
}