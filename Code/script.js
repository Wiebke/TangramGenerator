/**
 * Class for numbers in the ring of integers adjoined square root of 2
 */
var SQRT2 = Math.sqrt(2);

/* Constructor */
function IntAdjoinSqrt2(coeffInt, coeffSqrt){
    this.coeffInt = coeffInt;
    this.coeffSqrt = coeffSqrt;
};

/* Getter methods */
IntAdjoinSqrt2.prototype.coeffInt = function(){return this.coeffInt};
IntAdjoinSqrt2.prototype.coeffSqrt = function(){return this.coeffSqrt};

/* Conversion */
IntAdjoinSqrt2.prototype.toFloat = function(){
    return this.coeffInt + this.coeffSqrt*SQRT2;
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
