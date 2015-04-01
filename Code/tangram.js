/* Constructor: array of the 7 tan pieces, in order: BigTriangle, 2. Big Triangle
 * MediumTriangle, SmallTriangle, 2. SmallTriangle, */
function Tangram(tans) {
    this.tans = tans.sort(function (a, b) {
        return a.tanType - b.tanType;
    });
    /* outline is an array of points describing the outline of the tangram */
    this.outline = computeOutline(this.tans);
    this.evaluation = new Evaluation(this.tans, this.outline);
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
    var center = new Point(new IntAdjoinSqrt2(5, 0), new IntAdjoinSqrt2(5, 0));
    center.subtract(this.center());
    for (var tansId = 0; tansId < this.tans.length; tansId++) {
        this.tans[tansId].anchor.translate(center.x, center.y);
    }
    this.outline = computeOutline(this.tans);
};

Tangram.prototype.toSVGOutline = function (elementName) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var pathdata = "M " + this.outline[0][0].toFloatX() + ", " + this.outline[0][0].toFloatY() + " ";
    for (var i = 1; i < this.outline[0].length; i++) {
        pathdata += "L " + this.outline[0][i].toFloatX() + ", " + this.outline[0][i].toFloatY() + " ";
    }
    pathdata += "Z ";
    shape.setAttributeNS(null, "fill", '#3299BB');
    for (var outlineId = 1; outlineId < this.outline.length; outlineId++) {
        pathdata += "M " + this.outline[outlineId][0].toFloatX() + ", " + this.outline[outlineId][0].toFloatY() + " ";
        for (var i = 1; i < this.outline[outlineId].length; i++) {
            pathdata += "L " + this.outline[outlineId][i].toFloatX() + ", " + this.outline[outlineId][i].toFloatY() + " ";
        }
        pathdata += "Z";
    }
    shape.setAttributeNS(null, "d", pathdata);
    shape.setAttributeNS(null, "fill-rule", "evenodd");
    tangramSVG.appendChild(shape);
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

var compareTangrams = function (tangramA, tangramB) {
    var holediff = tangramA.outline.length - tangramA.outline.length;
    if (holediff === 0){
        return tangramA.outline[0].length - tangramB.outline[0].length;
    } else {
        return holediff;
    }
    //return numUniqueElements(tangramA.outline[0], comparePoints) - numUniqueElements(tangramB.outline[0], comparePoints);
};