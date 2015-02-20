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
IntAdjoinSqrt2.prototype.add = function(other){
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
    // TODO
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
    return this.x.toFloat()/this.z.toFloat() * 40;
};

Point.prototype.toFloatY = function(){
    return this.y.toFloat()/this.z.toFloat() * 40;
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
    var tangramDiv = document.createElement('div');
    tangramDiv.className = "tangram";
    tangramDiv.style.width = "33%";
    tangramDiv.style.height = "500px";
    tangramDiv.style.float = "left";
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tangramSVG.setAttribute("width", "100%");
    tangramSVG.setAttribute("height", "100%");
    tangramSVG.setAttribute("viewbox", "0 0 100 100");
    tangramSVG.setAttribute("preserveAspectRatio", "none");//"xMinYMin meet");
    for(var i = 0; i < this.tans.length; i++){
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttribute("points", this.tans[i].toSVG());
        // Fill with random color for now
        shape.setAttribute("fill", '#'+Math.random().toString(16).substr(-6));
        tangramSVG.appendChild(shape);
    }
    tangramDiv.appendChild(tangramSVG);
    return tangramDiv;
};

/* Test tangram - Square */
var anchorBT1 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle1 = new Tan(0, anchorBT1, 1);
var anchorBT2 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle2 = new Tan(0, anchorBT2, 7);
var anchorM = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var mediumTriangle = new Tan(1, anchorM, 0);
var anchorST1 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0));
var smallTriangle1 = new Tan(2, anchorST1, 3);
var anchorST2 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var smallTriangle2 = new Tan(2, anchorST2, 5);
var anchorS = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var square = new Tan(3, anchorS, 7);
var anchorP = new Point(new IntAdjoinSqrt2(4,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var parallelogram = new Tan(5, anchorP, 4);

var squareTangram = new Tangram([bigTriangle1,bigTriangle2,mediumTriangle,smallTriangle1,smallTriangle2,square,parallelogram]);

/* Test tangram - Swan */
var anchorBT1_2 = new Point(new IntAdjoinSqrt2(-1,2),new IntAdjoinSqrt2(5,1),new IntAdjoinSqrt2(1,0));
var bigTriangle1_2 = new Tan(0, anchorBT1_2, 6);
var anchorBT2_2 = new Point(new IntAdjoinSqrt2(1,2),new IntAdjoinSqrt2(7,-1),new IntAdjoinSqrt2(1,0));
var bigTriangle2_2 = new Tan(0, anchorBT2_2, 5);
var anchorM_2 = new Point(new IntAdjoinSqrt2(-1,1),new IntAdjoinSqrt2(5,0),new IntAdjoinSqrt2(1,0));
var mediumTriangle_2 = new Tan(1, anchorM_2, 7);
var anchorST1_2 = new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(1,0));
var smallTriangle1_2 = new Tan(2, anchorST1_2, 4);
var anchorST2_2 = new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(4,0),new IntAdjoinSqrt2(1,0));
var smallTriangle2_2 = new Tan(2, anchorST2_2, 3);
var anchorS_2 = new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var square_2 = new Tan(3, anchorS_2, 1);
var anchorP_2 = new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var parallelogram_2 = new Tan(5, anchorP_2, 2);

var swanTangram = new Tangram([bigTriangle1_2,bigTriangle2_2,mediumTriangle_2,smallTriangle1_2,smallTriangle2_2,square_2,parallelogram_2]);

/* Test tangram - Cat */
var anchorBT1_3 = new Point(new IntAdjoinSqrt2(3,2),new IntAdjoinSqrt2(5,-1),new IntAdjoinSqrt2(1,0));
var bigTriangle1_3 = new Tan(0, anchorBT1_3, 3);
var anchorBT2_3 = new Point(new IntAdjoinSqrt2(3,2),new IntAdjoinSqrt2(5,1),new IntAdjoinSqrt2(1,0));
var bigTriangle2_3 = new Tan(0, anchorBT2_3, 4);
var anchorM_3 = new Point(new IntAdjoinSqrt2(1,1),new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0));
var mediumTriangle_3 = new Tan(1, anchorM_3, 7);
var anchorST1_3 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0));
var smallTriangle1_3 = new Tan(2, anchorST1_3, 3);
var anchorST2_3 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0));
var smallTriangle2_3 = new Tan(2, anchorST2_3, 7);
var anchorS_3 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0));
var square_3 = new Tan(3, anchorS_3, 1);
var anchorP_3 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0));
var parallelogram_3 = new Tan(4, anchorP_3, 7);

var catTangram = new Tangram([bigTriangle1_3,bigTriangle2_3,mediumTriangle_3,smallTriangle1_3,smallTriangle2_3,square_3,parallelogram_3]);


/* Test tangram - Bird */
var anchorBT1_4 = new Point(new IntAdjoinSqrt2(4,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var bigTriangle1_4 = new Tan(0, anchorBT1_4, 1);
var anchorBT2_4 = new Point(new IntAdjoinSqrt2(6,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle2_4 = new Tan(0, anchorBT2_4, 5);
var anchorM_4 = new Point(new IntAdjoinSqrt2(2,3),new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(1,0));
var mediumTriangle_4 = new Tan(1, anchorM_4, 3);
var anchorST1_4 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0));
var smallTriangle1_4 = new Tan(2, anchorST1_4, 1);
var anchorST2_4 = new Point(new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var smallTriangle2_4 = new Tan(2, anchorST2_4, 2);
var anchorS_4 = new Point(new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var square_4 = new Tan(3, anchorS_4, 0);
var anchorP_4 = new Point(new IntAdjoinSqrt2(2,2),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var parallelogram_4 = new Tan(4, anchorP_4, 0);

var birdTangram = new Tangram([bigTriangle1_4,bigTriangle2_4,mediumTriangle_4,smallTriangle1_4,smallTriangle2_4,square_4,parallelogram_4]);


/* Test tangram - Mountain */
var anchorBT1_5 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(1,0));
var bigTriangle1_5 = new Tan(0, anchorBT1_5, 4);
var anchorBT2_5 = new Point(new IntAdjoinSqrt2(0,4),new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(1,0));
var bigTriangle2_5 = new Tan(0, anchorBT2_5, 6);
var anchorM_5 = new Point(new IntAdjoinSqrt2(0,3),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var mediumTriangle_5 = new Tan(1, anchorM_5, 7);
var anchorST1_5 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(1,0));
var smallTriangle1_5 = new Tan(2, anchorST1_5, 6);
var anchorST2_5 = new Point(new IntAdjoinSqrt2(0,3),new IntAdjoinSqrt2(2,1),new IntAdjoinSqrt2(1,0));
var smallTriangle2_5 = new Tan(2, anchorST2_5, 6);
var anchorS_5 = new Point(new IntAdjoinSqrt2(0,3),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var square_5 = new Tan(3, anchorS_5, 1);
var anchorP_5 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(2,-1),new IntAdjoinSqrt2(1,0));
var parallelogram_5 = new Tan(4, anchorP_5, 1);

var mountainTangram = new Tangram([bigTriangle1_5,bigTriangle2_5,mediumTriangle_5,smallTriangle1_5,smallTriangle2_5,square_5,parallelogram_5]);


/* Test tangram - Mountain */
var anchorBT1_6 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var bigTriangle1_6 = new Tan(0, anchorBT1_6, 0);
var anchorBT2_6 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,4),new IntAdjoinSqrt2(1,0));
var bigTriangle2_6 = new Tan(0, anchorBT2_6, 6);
var anchorM_6 = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(1,0));
var mediumTriangle_6 = new Tan(1, anchorM_6, 7);
var anchorST1_6 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,3),new IntAdjoinSqrt2(1,0));
var smallTriangle1_6 = new Tan(2, anchorST1_6, 2);
var anchorST2_6 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(1,0));
var smallTriangle2_6 = new Tan(2, anchorST2_6, 4);
var anchorS_6 = new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(1,0));
var square_6 = new Tan(3, anchorS_6, 0);
var anchorP_6 = new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var parallelogram_6 = new Tan(5, anchorP_6, 3);

var arrowTangram = new Tangram([bigTriangle1_6,bigTriangle2_6,mediumTriangle_6,smallTriangle1_6,smallTriangle2_6,square_6,parallelogram_6]);


window.onload = function(){
    fillDirections();
    var svgElement1 = squareTangram.toSVG();
    var svgElement2 = swanTangram.toSVG();
    var svgElement3 = catTangram.toSVG();
    var svgElement4 = birdTangram.toSVG();
    var svgElement5 = arrowTangram.toSVG();
    var svgElement6 = mountainTangram.toSVG();
    document.getElementById("gameArea").appendChild(svgElement1);
    document.getElementById("gameArea").appendChild(svgElement2);
    document.getElementById("gameArea").appendChild(svgElement3);
    document.getElementById("gameArea").appendChild(svgElement4);
    document.getElementById("gameArea").appendChild(svgElement5);
    document.getElementById("gameArea").appendChild(svgElement6);

};

