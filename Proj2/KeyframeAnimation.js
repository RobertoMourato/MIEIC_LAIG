var DEGREE_TO_RAD = Math.PI / 180;

class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super();

        this.activeKeyframeIndex = 0;
        this.keyframes = [];

        let initKeyframe = new Keyframe(0, [0,0,0], [0,0,0], [1,1,1]);/*{ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }, { x: 1.0, y: 1.0, z: 1.0 });*/
        this.keyframes.push(initKeyframe);

        for (let i = 0; i < keyframes.length; i++) {
            this.keyframes.push(keyframes[i]);
        }

        this.translate = initKeyframe.translate;
        this.rotate = initKeyframe.rotate;
        this.scale = initKeyframe.scale;

        this.time = 0;
        this.frameNumber = 0;
    }

    update(t) {
        this.time += t;

        if (this.frameNumber < this.keyframes.length) {
            var endTime = this.keyframes[this.frameNumber].instant;
            let deltaTime;
            let transx;
            let transy;
            let transz;
            let rotx;
            let roty;
            let rotz;
            let scalex;
            let scaley;
            let scalez;

            if (this.frameNumber == 0) {
                let translate = this.keyframes[this.frameNumber].getTranslate();
                let x = translate.x;
                deltaTime = endTime;
                transx = this.keyframes[this.frameNumber].translate[0];
                transy = this.keyframes[this.frameNumber].translate[1];
                transz = this.keyframes[this.frameNumber].translate[2];
                rotx = this.keyframes[this.frameNumber].rotate[0];
                roty = this.keyframes[this.frameNumber].rotate[1];
                rotz = this.keyframes[this.frameNumber].rotate[2];
                scalex = this.keyframes[this.frameNumber].scale[0];
                scaley = this.keyframes[this.frameNumber].scale[1];
                scalez = this.keyframes[this.frameNumber].scale[2];
            } else {
                deltaTime = endTime - this.keyframes[this.frameNumber - 1].instant;
                transx = this.keyframes[this.frameNumber].translate[0] - this.keyframes[this.frameNumber - 1].translate[0];
                transy = this.keyframes[this.frameNumber].translate[1] - this.keyframes[this.frameNumber - 1].translate[1];
                transz = this.keyframes[this.frameNumber].translate[2] - this.keyframes[this.frameNumber - 1].translate[2];
                rotx = this.keyframes[this.frameNumber].rotate[0] - this.keyframes[this.frameNumber - 1].rotate[0];
                roty = this.keyframes[this.frameNumber].rotate[1] - this.keyframes[this.frameNumber - 1].rotate[1];
                rotz = this.keyframes[this.frameNumber].rotate[2] - this.keyframes[this.frameNumber - 1].rotate[2];
                scalex = this.keyframes[this.frameNumber].scale[0] - this.keyframes[this.frameNumber - 1].scale[0];
                scaley = this.keyframes[this.frameNumber].scale[1] - this.keyframes[this.frameNumber - 1].scale[1];
                scalez = this.keyframes[this.frameNumber].scale[2] - this.keyframes[this.frameNumber - 1].scale[2];
            }

            if (this.time <= endTime) {
                this.translate[0] += (transx / deltaTime) * t;
                this.translate[1] += (transy / deltaTime) * t;
                this.translate[2] += (transz / deltaTime) * t;
                this.rotate[0] += (rotx / deltaTime) * t;
                this.rotate[1] += (roty / deltaTime) * t;
                this.rotate[2] += (rotz / deltaTime) * t;
                this.scale[0] += (scalex / deltaTime) * t;
                this.scale[1] += (scaley / deltaTime) * t;
                this.scale[2] += (scalez / deltaTime) * t;
            }

            if (this.time >= endTime) {
                this.frameNumber++;
            }
        }
    }

    apply() {
        var auxMatrix = mat4.create();
        auxMatrix = mat4.translate(auxMatrix, auxMatrix, this.translate);
        auxMatrix = mat4.rotate(auxMatrix, auxMatrix, this.rotate[0] * DEGREE_TO_RAD, vec3.fromValues(1, 0, 0));
        auxMatrix = mat4.rotate(auxMatrix, auxMatrix, this.rotate[1] * DEGREE_TO_RAD, vec3.fromValues(0, 1, 0));
        auxMatrix = mat4.rotate(auxMatrix, auxMatrix, this.rotate[2] * DEGREE_TO_RAD, vec3.fromValues(0, 0, 1));
        auxMatrix = mat4.scale(auxMatrix, auxMatrix, this.scale);
        return auxMatrix;
    }
}

class Keyframe {
    constructor(instant, translateValues, rotateValues, scaleValues) {
        this.instant = instant;
        this.translate = translateValues;
        this.rotate = rotateValues;
        this.scale = scaleValues;
    }

    getTranslate() {
        return this.translate;
    }

    getRotate() {
        return this.rotate;
    }

    getScale() {
        return this.scale;
    }
}