/**
 * Class for a projective three-dimensional point or vector
 */

/* Constructor */
function Point(x, y, z) {
    if (typeof x === 'undefined') {
        this.x = new IntAdjoinSqrt2(0, 0);
    } else {
        this.x = x;
    }
    if (typeof y === 'undefined') {
        this.y = new IntAdjoinSqrt2(0, 0);
    } else {
        this.y = y;
    }
    if (typeof z === 'undefined') {
        this.z = new IntAdjoinSqrt2(1, 0);
    } else {
        this.z = z;
    }
}

/* Getter methods */
Point.prototype.x = function () {
    return this.x
};
Point.prototype.y = function () {
    return this.y
};
Point.prototype.z = function () {
    return this.z
};

/* Duplication */
Point.prototype.dup = function () {
    return new Point(this.x.dup(), this.y.dup(), this.z.dup());
};

/* Combinations of Points */
Point.prototype.add = function (other) {
    this.x.add(other.x);
    this.y.add(other.y);
    this.z.add(other.z);
    return this;
};

Point.prototype.middle = function (other) {

};

Point.prototype.subtract = function (other) {
    this.x.subtract(other.x);
    this.y.subtract(other.y);
    this.z.subtract(other.z);
    return this;
};

/* Transform a point by a given 3x3-rotation matrix */
Point.prototype.transform = function (transMatrix) {
    if (transMatrix.length != 3) {
        console.log("Matrix seems to have the wrong dimension!");
        return;
    }
    var copy = this.dup();
    this.x = copy.x.dup().multiply(transMatrix[0][0]);
    this.x.add(copy.y.dup().multiply(transMatrix[0][1]));
    this.x.add(copy.z.dup().multiply(transMatrix[0][2]));
    this.y = copy.x.dup().multiply(transMatrix[1][0]);
    this.y.add(copy.y.dup().multiply(transMatrix[1][1]));
    this.y.add(copy.z.dup().multiply(transMatrix[1][2]));
    this.z = copy.x.dup().multiply(transMatrix[2][0]);
    this.z.add(copy.y.dup().multiply(transMatrix[2][1]));
    this.z.add(copy.z.dup().multiply(transMatrix[2][2]));
    return this;
};

Point.prototype.translate = function (transX, transY) {
    var translationMatrix =
        [[new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(0, 0), transX],
            [new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0), transY],
            [new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)]];
    this.transform(translationMatrix);
};

Point.prototype.rotate = function (angle) {
    // Transform angle to that it falls in the interval [0;360]
    // TODO
    // If angle is not a multiple of 45 degrees, we will not use it for rotation
    if (angle % 45 != 0) {
        console.log("Rotations around " + angle + "degrees are not supported!");
        return;
    }
    var cos;
    var sin;
    // Determine value of sin and cos
    if (angle % 90 != 0) {
        cos = new IntAdjoinSqrt2(0, 0.5);
        sin = new IntAdjoinSqrt2(0, 0.5);
    } else if (angle % 180 != 0) {
        cos = new IntAdjoinSqrt2(0, 0);
        sin = new IntAdjoinSqrt2(1, 0);
    } else {
        cos = new IntAdjoinSqrt2(1, 0);
        sin = new IntAdjoinSqrt2(0, 0);
    }
    // Determine the sign of sin and cos
    if (angle > 180 && angle < 360) {
        sin.neg();
    }
    if (angle > 90 && angle < 270) {
        cos.neg();
    }
    var rotationMatrix = [[cos, sin.dup().neg(), new IntAdjoinSqrt2(0, 0)],
        [sin, cos, new IntAdjoinSqrt2(0, 0)],
        [new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)]];
    this.transform(rotationMatrix);
};

Point.prototype.toFloatX = function () {
    return this.x.toFloat() / this.z.toFloat();
};

Point.prototype.toFloatY = function () {
    return this.y.toFloat() / this.z.toFloat();
};