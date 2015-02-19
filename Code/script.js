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
};

 /* Basic arithmetic - Subtracting another number from this one */
IntAdjoinSqrt2.prototype.subtract = function(other){
    this.coeffInt -= other.coeffInt;
    this.coeffSqrt -= other.coeffSqrt;
};

 /* Basic arithmetic - Multiplying this number by another one */
IntAdjoinSqrt2.prototype.multiply = function(other){
    /* (a + bx)*(c+dx) = (a*c + b*d*x*x) + (a*d + b*c)  */
    var coeffIntCopy = this.coeffInt;
    this.coeffInt = coeffIntCopy*other.coeffInt + 2*this.coeffSqrt*other.coeffSqrt;
    this.coeffSqrt = coeffIntCopy*other.coeffSqrt + this.coeffSqrt*other.coeffInt;
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
}

/* Combinations of Points */
Point.prototype.add = function(other){
    this.x.add(other.x);
    this.y.add(other.y);
    this.z.add(other.z);
};

Point.prototype.middle = function(other){

};

Point.prototype.subtract = function(other){
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
};

Point.prototype.transform = function(transMatrix){

};

Point.prototype.translate = function(transX, transY){

};

Point.prototype.rotate = function(){

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

/* Constructor: type is a number from 0 to 4, depending on which tan the object
* describes, anchor is one specific point, orientation is a number between
* 0 (0 degrees) and 7 (315 degrees) and flipped is a boolean, which is only
* relevant for the parallelogram */
function Tan(tanType,anchor,orientation,flipped) {
    this.tanType = tanType;
    this.anchor = anchor;
    this.orientation = orientation;
    if (flipped === 'undefined') {
        this.flipped = false;
    } else {
        this.flipped = flipped;
    }
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
var Directions = {};
Directions.BigTriangle =
    [new Point(new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,2),new IntAdjoinSqrt2(0,0))];
Directions.MediumTriangle =
    [new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0))];
Directions.SmallTriangle =
    [new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0))];
Directions.Square =
    [new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,1),new IntAdjoinSqrt2(0,0))];
Directions.Parallelogram =
    [new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(0,0))];
Directions.ParallelogramFlipped =
    [new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(-1,0),new IntAdjoinSqrt2(0,0)),
        new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(-1,0),new IntAdjoinSqrt2(0,0))];

Tan.prototype.toSVG = function(){
    var points = "" + this.anchor.toFloatX() + "," + this.anchor.toFloatY() + " ";
    var directions;
    switch (this.tanType){
        case 0:
            directions = Directions.BigTriangle;
            break;
        case 1:
            directions = Directions.MediumTriangle;
            break;
        case 2:
            directions = Directions.SmallTriangle;
            break;
        case 3:
            directions = Directions.Square;
            break;
        case 4:
            if (this.flipped){
                directions = Directions.ParallelogramFlipped;
            } else {
                directions = Directions.Parallelogram
            }
            break;
        default:
            directions = [];
    }
    for (var i = 0; i < directions.length; i++){
        console.log(i);
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
        tangramSVG.appendChild(shape);
    }
    return tangramSVG;
};

/* Test tangram */
var anchor1 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle1 = new Tan(0, anchor1, 7);
var anchor2 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var bigTriangle2 = new Tan(0, anchor2, 1);
var anchor3 = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var mediumTriangle = new Tan(1, anchor3, 0);
var anchor4 = new Point(new IntAdjoinSqrt2(1,0),new IntAdjoinSqrt2(3,0),new IntAdjoinSqrt2(1,0));
var smallTriangle1 = new Tan(2, anchor4, 6);
var anchor5 = new Point(new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var smallTriangle2 = new Tan(2, anchor5, 3);
var anchor6 = new Point(new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(2,0),new IntAdjoinSqrt2(1,0));
var square = new Tan(3, anchor6, 1);
var anchor7 = new Point(new IntAdjoinSqrt2(4,0),new IntAdjoinSqrt2(0,0),new IntAdjoinSqrt2(1,0));
var parallelogram = new Tan(4, anchor7, 4);

var test = new Tangram([bigTriangle1,bigTriangle2,mediumTriangle,smallTriangle1,smallTriangle2,square,parallelogram]);

window.onload = function(){
    var svgElement = test.toSVG();
    document.getElementById("content").appendChild(svgElement);
};

