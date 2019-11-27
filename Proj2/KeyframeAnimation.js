var DEGREE_TO_RAD = Math.PI / 180;

class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super();

        this.activeKeyframeIndex = 0;
        this.keyframes = [];

        //let initKeyframe = new Keyframe(0, [0,0,0], [0,0,0], [1,1,1]);/*{ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }, { x: 1.0, y: 1.0, z: 1.0 });*/
        //this.keyframes.push(initKeyframe);

        for (let i = 0; i < keyframes.length; i++) {
            this.keyframes.push(keyframes[i]);
        }

        this.translate = [0,0,0];  //initKeyframe.translate;
        this.rotate = [0,0,0];  //initKeyframe.rotate;
        this.scale = [1,1,1];   //initKeyframe.scale;

        this.time = 0;
        this.frameNumber = 0;
    }

    get_currentFrameIndex(time) {
        for (let i = 0; i < this.keyframes.length; i++){
            if (i == 0) { 
                if (this.time < this.keyframes[i].instant) {
                    return i;
                }
            }
            else if (this.time < this.keyframes[i].instant && this.time > this.keyframes[i - 1].instant)
                return i;
        }
        return -1;
    }

    update(deltaT) {
        this.time += deltaT;
    }

    apply() {
        
        var currentFrameIndex = this.get_currentFrameIndex(this.time);
        if (currentFrameIndex == -1){
            let stationary = this.keyframes[this.keyframes.length - 1];
            this.translate[0] = stationary.translate[0];
            this.translate[1] = stationary.translate[1];
            this.translate[2] = stationary.translate[2];
            this.rotate[0] = stationary.rotate[0];
            this.rotate[1] = stationary.rotate[1];
            this.rotate[2] = stationary.rotate[2];
            this.scale[0] = stationary.scale[0];
            this.scale[1] = stationary.scale[1];
            this.scale[2] = stationary.scale[2];
            //return;
        }
        else {
          
            let segmentTime;
            let transx;
            let transy;
            let transz;
            let rotx;
            let roty;
            let rotz;
            let scaleRatioX;
            let scaleRatioY;
            let scaleRatioZ;
            let progressRatio;
            let last;
            let current;

            current = this.keyframes[currentFrameIndex];
            var endTime = current.instant;

            if (currentFrameIndex == 0) {
                segmentTime = endTime;
                progressRatio = this.time / segmentTime;
                transx = current.translate[0];
                transy = current.translate[1];
                transz = current.translate[2];
                rotx = current.rotate[0];
                roty = current.rotate[1];
                rotz = current.rotate[2];
                scaleRatioX = current.scale[0];
                scaleRatioY = current.scale[1];
                scaleRatioZ = current.scale[2];
                this.translate[0] = transx * progressRatio;
                this.translate[1] = transy * progressRatio;
                this.translate[2] = transz * progressRatio;
                this.rotate[0] = rotx * progressRatio;
                this.rotate[1] = roty * progressRatio;
                this.rotate[2] = rotz * progressRatio;
                this.scale[0] = Math.pow(scaleRatioX, progressRatio);
                this.scale[1] = Math.pow(scaleRatioY, progressRatio);
                this.scale[2] = Math.pow(scaleRatioZ, progressRatio);
                //console.log(progressRatio + "1 (" + transx + " " + transy + " " + transz + "), (" + rotx + " " + roty + " " + rotz + "),(" + scalex + " " + scaley + " " + scalez + ")" );

            } else {
                last = this.keyframes[currentFrameIndex - 1];
                segmentTime = endTime - last.instant;
                progressRatio = (this.time - last.instant) / segmentTime;
                transx = current.translate[0] - last.translate[0];
                transy = current.translate[1] - last.translate[1];
                transz = current.translate[2] - last.translate[2];
                rotx = current.rotate[0] - last.rotate[0];
                roty = current.rotate[1] - last.rotate[1];
                rotz = current.rotate[2] - last.rotate[2];
                scaleRatioX = current.scale[0] / last.scale[0];
                scaleRatioY = current.scale[1] / last.scale[1];
                scaleRatioZ = current.scale[2] / last.scale[2];
                //console.log(progressRatio + "n (" + transx + " " + transy + " " + transz + "), (" + rotx + " " + roty + " " + rotz + "),(" + scalex + " " + scaley + " " + scalez + ")" );          

                this.translate[0] = last.translate[0] + transx * progressRatio;
                this.translate[1] = last.translate[1] + transy * progressRatio;
                this.translate[2] = last.translate[2] + transz * progressRatio;
                this.rotate[0] = last.rotate[0] + rotx * progressRatio;
                this.rotate[1] = last.rotate[1] + roty * progressRatio;
                this.rotate[2] = last.rotate[2] + rotz * progressRatio;
                this.scale[0] = last.scale[0] * Math.pow(scaleRatioX, progressRatio);
                this.scale[1] = last.scale[1] * Math.pow(scaleRatioY, progressRatio);
                this.scale[2] = last.scale[2] * Math.pow(scaleRatioZ, progressRatio);
            }
        }

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