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

    update(deltaT) {
        this.time += deltaT;

        //console.log(deltaT);

        if (this.frameNumber < this.keyframes.length) {
          
            let segmentTime;
            let transx;
            let transy;
            let transz;
            let rotx;
            let roty;
            let rotz;
            let scalex;
            let scaley;
            let scalez;
            let progressRatio;
            let last;
            let current;

            current = this.keyframes[this.frameNumber];
            var endTime = current.instant;

            if (this.frameNumber == 0) {
                segmentTime = endTime;
                progressRatio = this.time / segmentTime;
                transx = current.translate[0];
                transy = current.translate[1];
                transz = current.translate[2];
                rotx = current.rotate[0];
                roty = current.rotate[1];
                rotz = current.rotate[2];
                scalex = current.scale[0];
                scaley = current.scale[1];
                scalez = current.scale[2];
                //console.log(progressRatio + "1 (" + transx + " " + transy + " " + transz + "), (" + rotx + " " + roty + " " + rotz + "),(" + scalex + " " + scaley + " " + scalez + ")" );

            } else {
                last = this.keyframes[this.frameNumber - 1];
                segmentTime = endTime - last.instant;
                progressRatio = (this.time - last.instant) / segmentTime; 
                transx = current.translate[0] - last.translate[0];
                transy = current.translate[1] - last.translate[1];
                transz = current.translate[2] - last.translate[2];
                rotx = current.rotate[0] - last.rotate[0];
                roty = current.rotate[1] - last.rotate[1];
                rotz = current.rotate[2] - last.rotate[2];
                scalex = current.scale[0] - last.scale[0];
                scaley = current.scale[1] - last.scale[1];
                scalez = current.scale[2] - last.scale[2];
                //console.log(progressRatio + "n (" + transx + " " + transy + " " + transz + "), (" + rotx + " " + roty + " " + rotz + "),(" + scalex + " " + scaley + " " + scalez + ")" );
            }
          
            
            if (this.time <= endTime) {
                this.translate[0] = last.translate[0] + transx * progressRatio;
                this.translate[1] = last.translate[1] + transy * progressRatio;
                this.translate[2] = last.translate[2] + transz * progressRatio;
                this.rotate[0] = last.rotate[0] + rotx * progressRatio;
                this.rotate[1] = last.rotate[1] + roty * progressRatio;
                this.rotate[2] = last.rotate[2] + rotz * progressRatio;
                this.scale[0] = last.scale[0] + scalex * progressRatio;
                this.scale[1] = last.scale[1] + scaley * progressRatio;
                this.scale[2] = last.scale[2] + scalez * progressRatio;
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