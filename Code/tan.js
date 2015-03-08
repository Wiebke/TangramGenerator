/** Class for a Tan */

/* Constructor: tanType is a number from 0 to 5, depending on which tan the object
 * describes where 0: big triangle, 1: medium triangle, 2: small triangle,
 * 3: square, 4: parallelogram and 5: flipped parallelogram, anchor is one specific
 * point, orientation is a number between
 * 0 (0 degrees) and 7 (315 degrees) */
function Tan(tanType, anchor, orientation) {
    this.tanType = tanType;
    this.anchor = anchor;
    this.orientation = orientation;
}

Tan.prototype.getPoints = function () {
    var points = [];
    points[0] = this.anchor;
    var directions = Directions[this.tanType][this.orientation];
    for (var dirId = 0; dirId < directions.length; dirId++) {
        var current = this.anchor.dup();
        current.add(directions[dirId]);
        points[dirId+1] = current;
    }
    return points;
};

Tan.prototype.getSegments = function () {
    var segments = [];
    var points = this.getPoints();
    for (var pointId = 0; pointId < points.length; pointId++){
        segments[pointId] = new LineSegment(points[pointId],
            points[(pointId+1)%points.length]);
    }
    return segments;
}

Tan.prototype.toSVG = function () {
    var points = this.getPoints();
    var pointsString = "";
    for (var i = 0; i < points.length; i++){
        pointsString += points[i].toFloatX() + ", " + points[i].toFloatY() + " ";
    }
    return pointsString;
};