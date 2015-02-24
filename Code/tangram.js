/* Constructor: array of the 7 tan pieces, in order: BigTriangle, 2. Big Triangle
 * MediumTriangle, SmallTriangle, 2. SmallTriangle, */
function Tangram(tans) {
    this.tans = tans;
    var outline;
}

/* Calculates the center of a tangram, for now based all shapes,
 * TODO: base on only the outline of the shape
 */
Tangram.prototype.center = function (){
    var center = [0, 0];
    for (var i = 0; i < this.tans.length; i++){
        var currentPoints = this.tans[i].getPoints();
        for (var j = 0; j < currentPoints.length; j++){
            center[0] += currentPoints[j][0];
            center[1] += currentPoints[j][1];
        }
    }
    center[0] /= 23;
    center[0] = 5 - center[0];
    center[1] /= 23;
    center[1] = 5 - center[1];
    return center;
};

Tangram.prototype.toSVG = function (elementName) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var center = this.center();
    var translate = "translate(" + center[0] + "," + center[1] + ")";
    tangramSVG.setAttributeNS(null, "transform", translate);
    for (var i = 0; i < this.tans.length; i++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttributeNS(null, "points", this.tans[i].toSVG());
        // Fill with random color for now
        shape.setAttributeNS(null, "fill", '#' + Math.random().toString(16).substr(-6));
        tangramSVG.appendChild(shape);
    }
    document.getElementById(elementName).appendChild(tangramSVG);
};