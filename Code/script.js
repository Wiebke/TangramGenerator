/**
 * Class for numbers in the ring of integers adjoined square root of 2
 */

/* Constructor */
function IntAdjoinSqrt2(coeffInt, coeffSqrt){
    this.coeffInt = coeffInt;
    this.coeffSqrt = coeffSqrt;
}

/* Getter methods */
IntAdjoinSqrt2.prototype.coeffInt = function(){return this.coeffInt};
IntAdjoinSqrt2.prototype.coeffSqrt = function(){return this.coeffSqrt};

/* Duplication */
IntAdjoinSqrt2.prototype.dup = function(){
    return new IntAdjoinSqrt2(this.coeffInt, this.coeffSqrt);
};

/* Conversion */
IntAdjoinSqrt2.prototype.toFloat = function(){
    return this.coeffInt + this.coeffSqrt*Math.SQRT2;
};

 /* Basic arithmetic - Adding another number to this one */
IntAdjoinSqrt2.prototype.add =function(other){
    this.coeffInt += other.coeffInt;
    this.coeffSqrt += other.coeffSqrt;
    return this;
};

 /* Basic arithmetic - Subtracting another number from this one */
IntAdjoinSqrt2.prototype.subtract = function(other){
    this.coeffInt -= other.coeffInt;
    this.coeffSqrt -= other.coeffSqrt;
    return this;
};

 /* Basic arithmetic - Multiplying this number by another one */
IntAdjoinSqrt2.prototype.multiply = function(other){
    /* (a + bx)*(c+dx) = (a*c + b*d*x*x) + (a*d + b*c)  */
    var coeffIntCopy = this.coeffInt;
    this.coeffInt = coeffIntCopy*other.coeffInt + 2*this.coeffSqrt*other.coeffSqrt;
    this.coeffSqrt = coeffIntCopy*other.coeffSqrt + this.coeffSqrt*other.coeffInt;
    return this;
};

/* Basic arithmetic - Negation */
IntAdjoinSqrt2.prototype.neg = function(){
    this.coeffInt = -this.coeffInt;
    this.coeffSqrt = -this.coeffSqrt;
    return this;
};

/*

/**
 * Class for a projective three-dimensional point or vector
 */

/* Constructor */
function Point(x, y, z){
    if (typeof x === 'undefined'){
        this.x = new IntAdjoinSqrt2(0,0);
    } else {
        this.x = x;
    }
    if (typeof y === 'undefined'){
        this.y = new IntAdjoinSqrt2(0,0);
    } else {
        this.y = y;
    }
    if (typeof z === 'undefined'){
        this.z = new IntAdjoinSqrt2(1,0);
    } else {
        this.z = z;
    }
}

/* Getter methods */
Point.prototype.x = function(){return this.x};
Point.prototype.y = function(){return this.y};
Point.prototype.z = function(){return this.z};

/* Duplication */
Point.prototype.dup = function(){
    return new Point(this.x.dup(), this.y.dup(), this.z.dup());
};

/* Combinations of Points */
Point.prototype.add = function(other){
    this.x.add(other.x);
    this.y.add(other.y);
    this.z.add(other.z);
    return this;
};

Point.prototype.middle = function(other){

};

Point.prototype.subtract = function(other){
    this.x.subtract(other.x);
    this.y.subtract(other.y);
    this.z.subtract(other.z);
    return this;
};

/* Transform a point by a given 3x3-rotation matrix */
Point.prototype.transform = function(transMatrix){
    if(transMatrix.length != 3){
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

Point.prototype.translate = function(transX, transY){
    var translationMatrix =
        [[new IntAdjoinSqrt2(1,0), new IntAdjoinSqrt2(0,0), transX],
            [new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(1,0), transY],
            [new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0)]];
    this.transform(translationMatrix);
};

Point.prototype.rotate = function(angle){
    // Transform angle to that it falls in the interval [0;360]

    // If angle is not a multiple of 45 degrees, we will not use it for rotation
    if (angle % 45 != 0){
        console.log("Rotations around " + angle + "degrees are not supported!");
        return;
    }
    var cos;
    var sin;
    // Determine value of sin and cos
    if (angle % 90 != 0){
        cos = new IntAdjoinSqrt2(0,0.5);
        sin = new IntAdjoinSqrt2(0,0.5);
    } else if (angle % 180 != 0) {
        cos = new IntAdjoinSqrt2(0,0);
        sin = new IntAdjoinSqrt2(1,0);
    } else {
        cos = new IntAdjoinSqrt2(1,0);
        sin = new IntAdjoinSqrt2(0,0);
    }
    // Determine the sign of sin and cos
    if (angle > 180 && angle <360){
        sin.neg();
    }
    if (angle >90 && angle < 270){
        cos.neg();
    }
    var rotationMatrix = [[cos, sin.dup().neg(), new IntAdjoinSqrt2(0,0)],
        [sin, cos,new IntAdjoinSqrt2(0,0)],
        [new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0)]];
    this.transform(rotationMatrix);
};

Point.prototype.toFloatX = function(){
    return this.x.toFloat()/this.z.toFloat() * 50;
};

Point.prototype.toFloatY = function(){
    return this.y.toFloat()/this.z.toFloat() * 50;
};

/**
 * Class for a Tan
 */

/* Constructor: tanType is a number from 0 to 5, depending on which tan the object
* describes where 0: big triangle, 1: medium triangle, 2: small triangle,
* 3: square, 4: parallelogram and 5: flipped parallelogram, anchor is one specific
* point, orientation is a number between
* 0 (0 degrees) and 7 (315 degrees) */
function Tan(tanType,anchor,orientation) {
    this.tanType = tanType;
    this.anchor = anchor;
    this.orientation = orientation;
}

/**
 * Definition of directions for each of the tans, the anchor point for each piece
 * is at position x, the directions are defined in clockwise order (except for
 * the flipped parallelogram) and are the vectors to the points a,b,(c), where c
 * is only for four-sided tans, the pieces are all constructed from 16 basic
 * triangles, so that the square built from all 7 pieces has a side length of 4
 * x---a  x----a  x-----a        c-----b
 * |  /   |    |   \     \      /     /
 * | /    |    |    \     \    /     /
 * b      c----b     c-----b  x-----a
 */
var Directions = [];

var fillDirections = function(){
    // Create Array for each tan piece
    for (var i = 0; i <= 5; i++){
        Directions[i] = [];
    }
    // Fill the first entry of each array with the direction vectors for when
    // a piece is not rotated
    Directions[0][0] =
        [new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,0))];
    Directions[1][0] =
        [new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0))];
    Directions[2][0] =
        [new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0))];
    Directions[3][0] =
        [new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0))];
    Directions[4][0] =
        [new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(0,0))];
    Directions[5][0] =
        [new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(-1,0),new IntAdjoinSqrt2(0,0)),
            new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(-1,0),new IntAdjoinSqrt2(0,0))];
    // Matrix for rotating by 45 degrees
    var rotationMatrix =
        [[new IntAdjoinSqrt2(0,0.5), new IntAdjoinSqrt2(0,-0.5), new IntAdjoinSqrt2(0,0)],
            [new IntAdjoinSqrt2(0,0.5), new IntAdjoinSqrt2(0,0.5), new IntAdjoinSqrt2(0,0)],
            [new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(1,0)]];
    // For each type, rotate the direction vectors of orientation orientID by 45
    // degrees to get the direction vectors for orientation orientID+1
    for(var tanTypeID = 0; tanTypeID <= 5; tanTypeID++){
        for(var orientID = 0; orientID < 7; orientID++){
            Directions[tanTypeID][orientID+1] = [];
            for(var dir = 0; dir < Directions[tanTypeID][0].length; dir++){
                console.log(tanTypeID + " " + orientID + " " + dir);
                Directions[tanTypeID][orientID+1][dir] =
                    Directions[tanTypeID][orientID][dir].dup().transform(rotationMatrix);
            }
        }
    }
    console.log(JSON.stringify(Directions));
};

Tan.prototype.toSVG = function(){
    var points = "" + this.anchor.toFloatX() + "," + this.anchor.toFloatY() + " ";
    var directions = Directions[this.tanType][this.orientation];
    for (var i = 0; i < directions.length; i++){
        var current = this.anchor.dup();
        current.add(directions[i]);
        points += current.toFloatX() + "," + current.toFloatY() + " ";
    }
    return points;
};

/* Constructor: array of the 7 tan pieces, in order: BigTriangle, 2. Big Triangle
* MediumTriangle, SmallTriangle, 2. SmallTriangle, */
function Tangram(tans){
    this.tans = tans;
}

Tangram.prototype.toSVG = function(){
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tangramSVG.setAttribute("width", "500px");
    tangramSVG.setAttribute("height", "500px");
    for(var i = 0; i < this.tans.length; i++){
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttribute("points", this.tans[i].toSVG());
        // Fill with random color for now
        shape.setAttribute("fill", '#'+Math.random().toString(16).substr(-6));
        tangramSVG.appendChild(shape);
    }
    return tangramSVG;
};

/* Test tangram */
var anchor1 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle1 = new Tan(0, anchor1, 1);
var anchor2 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle2 = new Tan(0, anchor2, 7);
var anchor3 = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var mediumTriangle = new Tan(1, anchor3, 0);
var anchor4 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0));
var smallTriangle1 = new Tan(2, anchor4, 3);
var anchor5 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var smallTriangle2 = new Tan(2, anchor5, 5);
var anchor6 = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var square = new Tan(3, anchor6, 7);
var anchor7 = new Point(new IntAdjoinSqrt2(4,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var parallelogram = new Tan(5, anchor7, 4);

var test = new Tangram([bigTriangle1,bigTriangle2,mediumTriangle,smallTriangle1,smallTriangle2,square,parallelogram]);

window.onload = function(){
    fillDirections();
    var svgElement = test.toSVG();
    document.getElementById("content").appendChild(svgElement);
};

