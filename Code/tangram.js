
/* Constructor: array of the 7 tan pieces, in order: BigTriangle, 2. Big Triangle
 * MediumTriangle, SmallTriangle, 2. SmallTriangle, */
function Tangram(tans) {
    this.tans = tans;
    /* outline is an array of points describing the outline of the tangram */
    this.outline = computeOutline(this.tans);
}

/* Calculates the center of the bounding box of a tangram */
Tangram.prototype.center = function () {
    var center = [0, 0];
    var boundingBox = computeBoundingBox(this.tans, this.outline);
    center[0] = 5 - (boundingBox[0] + boundingBox[2]) / 2;
    center[1] = 5 - (boundingBox[1] + boundingBox[3]) / 2;
    return center;
};

Tangram.prototype.toSVGOutline = function (elementName) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var center = this.center();
    var translate = "translate(" + center[0] + "," + center[1] + ")";
    tangramSVG.setAttributeNS(null, "transform", translate);
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    var pointsString = "";
    for (var i = 0; i < this.outline.length; i++) {
        pointsString += this.outline[i].toFloatX() + ", " + this.outline[i].toFloatY() + " ";
    }
    shape.setAttributeNS(null, "points", pointsString);
    // Fill with random color for now
    // shape.setAttributeNS(null, "fill", '#' + Math.random().toString(16).substr(-6));
    shape.setAttributeNS(null, "fill", '#3299BB');
    tangramSVG.appendChild(shape);
    document.getElementById(elementName).appendChild(tangramSVG);
};

Tangram.prototype.toSVGTans = function (elementName, shifted) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var center = this.center();
    center[0] += shifted ? 7.5 : 0;
    var translate = "translate(" + center[0] + "," + center[1] + ")";
    tangramSVG.setAttributeNS(null, "transform", translate);
    for (var i = 0; i < this.tans.length; i++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttributeNS(null, "points", this.tans[i].toSVG());
        // Fill with random color for now
        // shape.setAttributeNS(null, "fill", '#' + Math.random().toString(16).substr(-6));
        shape.setAttributeNS(null, "fill", '#FF9900');
        tangramSVG.appendChild(shape);
    }
    document.getElementById(elementName).appendChild(tangramSVG);
};

var getTansByID = function (tanArray, tanID){
    var tansWithID = tanArray.filter(function (element) {
        return element.tanType === tanID
            || (tanID === 4 && element.tanType === 5)
            || (tanID === 5 && element.tanType === 4);
    });
    return tansWithID;
};