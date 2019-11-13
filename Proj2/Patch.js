class Patch extends CGFobject{
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints){
        super(scene);
        this.npointsU=npointsU;
        this.npointsV=npointsV;
        this.npartsU=npartsU;
        this.npartsV=npartsV;
        this.controlPoints=controlPoints;
        this.init();
    }

    init(){
        this.controlVertexes=[];

        for(var i=0; i<this.npointsU;i++){
            var aux = [];
            for(var j=0;j<this.npointsV;j++){
                aux.push([this.controlPoints[this.npointsV*1+j][0], [this.controlPoints[this.npointsV*1+j][1]], [this.controlPoints[this.npointsV*1+j][2], [this.controlPoints[this.npointsV*1+j][3]);
            }
            this.controlVertexes.push(aux);
        }
    }
}