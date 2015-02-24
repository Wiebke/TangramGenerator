/**
 * Class for a Tan
 */

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
    points[0] = [this.anchor.toFloatX(),this.anchor.toFloatY()];
    var directions = Directions[this.tanType][this.orientation];
    for (var i = 0; i < directions.length; i++) {
        var current = this.anchor.dup();
        current.add(directions[i]);
        points[i+1] = [current.toFloatX(),current.toFloatY()];
    }
    return points;
};

Tan.prototype.toSVG = function () {
    var points = this.getPoints();
    var pointsString = "";
    for (var i = 0; i < points.length; i++){
        pointsString += points[i][0] + ", " + points[i][1] + " ";
    }
    return pointsString;
};