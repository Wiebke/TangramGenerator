
/* Constructor: array of the 7 tan pieces, in order: BigTriangle, 2. Big Triangle
 * MediumTriangle, SmallTriangle, 2. SmallTriangle, */
function Tangram(tans) {
    this.tans = tans.sort(function (a,b){
        return a.tanType - b.tanType;
    });
    /* outline is an array of points describing the outline of the tangram */
    this.outline = computeOutline(this.tans);
}

/* Calculates the center of the bounding box of a tangram */
Tangram.prototype.center = function () {
    var center = new Point();
    var boundingBox = computeBoundingBox(this.tans, this.outline);
    center.x = boundingBox[0].dup().add(boundingBox[2]).scale(0.5);
    center.y = boundingBox[1].dup().add(boundingBox[3]).scale(0.5);
    return center;
};

Tangram.prototype.positionCentered = function () {
    var center = new Point(new IntAdjoinSqrt2(5,0), new IntAdjoinSqrt2(5,0));
    center.subtract(this.center());
    for (var tansId = 0; tansId < this.tans.length; tansId++){
        this.tans[tansId].anchor.translate(center.x, center.y);
    }
    this.outline = computeOutline(this.tans);
};

Tangram.prototype.toSVGOutline = function (elementName) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    var pointsString = "";
    for (var i = 0; i < this.outline[0].length; i++) {
        pointsString += this.outline[0][i].toFloatX() + ", " + this.outline[0][i].toFloatY() + " ";
    }
    shape.setAttributeNS(null, "points", pointsString);
    // Fill with random color for now
    // shape.setAttributeNS(null, "fill", '#' + Math.random().toString(16).substr(-6));
    shape.setAttributeNS(null, "fill", '#3299BB');
    // shape.setAttributeNS(null, "fill", 'none');
    // shape.setAttributeNS(null, "fill-opacity", "0.5");
    //shape.setAttributeNS(null, "stroke", "#E9E9E9");
    //shape.setAttributeNS(null, "stroke-width", "0.05");
    tangramSVG.appendChild(shape);
    for (var outlineId = 1; outlineId < this.outline.length;  outlineId++){
        var hole = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        pointsString = "";
        for (var i = 0; i < this.outline[outlineId].length; i++) {
            pointsString += this.outline[outlineId][i].toFloatX() + ", " + this.outline[outlineId][i].toFloatY() + " ";
        }
        hole.setAttributeNS(null, "points", pointsString);
        hole.setAttributeNS(null, "fill", '#BCBCBC');
        tangramSVG.appendChild(hole);
    }
    /* Clear old content */
    var element = document.getElementById(elementName);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    /* Add new tangram */
    element.appendChild(tangramSVG);
};

Tangram.prototype.toSVGTans = function (elementName, shifted) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (var i = 0; i < this.tans.length; i++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttributeNS(null, "points", this.tans[i].toSVG());
        // Fill with random color for now
        // shape.setAttributeNS(null, "fill", '#' + Math.random().toString(16).substr(-6));
        shape.setAttributeNS(null, "fill", '#FF9900');
        //shape.setAttributeNS(null, "fill", 'none');
        shape.setAttributeNS(null, "stroke", "#3299BB");
        shape.setAttributeNS(null, "stroke-width", "0.05");
        tangramSVG.appendChild(shape);
    }
    document.getElementById(elementName).appendChild(tangramSVG);
};

var getTansByID = function (tanArray, tanID){
    /* TODO: Not really needed then Tangrams have sorted tan arrays are sorted */
    var tansWithID = tanArray.filter(function (element) {
        return element.tanType === tanID
            || (tanID === 4 && element.tanType === 5)
            || (tanID === 5 && element.tanType === 4);
    });
    return tansWithID;
};