/**
 * Class for numbers in the ring of integers adjoined square root of 2
 */

/* Constructor */
function IntAdjoinSqrt2(coeffInt, coeffSqrt) {
    this.coeffInt = coeffInt;
    this.coeffSqrt = coeffSqrt;
}

/* Getter methods */
IntAdjoinSqrt2.prototype.coeffInt = function () {
    return this.coeffInt
};
IntAdjoinSqrt2.prototype.coeffSqrt = function () {
    return this.coeffSqrt
};

/* Duplication */
IntAdjoinSqrt2.prototype.dup = function () {
    return new IntAdjoinSqrt2(this.coeffInt, this.coeffSqrt);
};

/* Conversion */
IntAdjoinSqrt2.prototype.toFloat = function () {
    return this.coeffInt + this.coeffSqrt * Math.SQRT2;
};

/* Checking if this number is equal to another one, since only whole numbers are
 * used === can be used for comparison */
IntAdjoinSqrt2.prototype.eq = function (other) {
    return (numberEq(this.coeffInt, other.coeffInt) && numberEq(this.coeffSqrt, other.coeffSqrt));
};

/* Compare this number to another one, returns 0 is the numbers are equal, -1 is
 * this number is smaller than the other one and 1, if this one is bigger than the
 * other one */
IntAdjoinSqrt2.prototype.compare = function(other) {
    if (this.eq(other)){
        return 0;
    } else {
        var floatThis = this.toFloat();
        var floatOther = other.toFloat();
        if (floatThis < floatOther){
            return -1;
        } else {
            return 1;
        }
    }
};

var compareIntAdjoinSqrt2s = function (numberA, numberB){
    return numberA.compare(numberB);
};

IntAdjoinSqrt2.prototype.isZero = function () {
    return (numberEq(this.coeffInt,0) && numberEq(this.coeffSqrt,0));
};

/* Basic arithmetic - Adding another number to this one */
IntAdjoinSqrt2.prototype.add = function (other) {
    this.coeffInt += other.coeffInt;
    this.coeffSqrt += other.coeffSqrt;
    return this;
};

/* Basic arithmetic - Subtracting another number from this one */
IntAdjoinSqrt2.prototype.subtract = function (other) {
    this.coeffInt -= other.coeffInt;
    this.coeffSqrt -= other.coeffSqrt;
    return this;
};

/* Basic arithmetic - Multiplying this number by another one */
IntAdjoinSqrt2.prototype.multiply = function (other) {
    /* (a + bx)*(c + dx) = (ac + bdxx) + (ad + bc)*x where x = sqrt(2) */
    var coeffIntCopy = this.coeffInt;
    this.coeffInt = coeffIntCopy * other.coeffInt + 2 * this.coeffSqrt * other.coeffSqrt;
    this.coeffSqrt = coeffIntCopy * other.coeffSqrt + this.coeffSqrt * other.coeffInt;
    return this;
};

/* Basic arithmetic - Dividing this number another one --> will possibly result
 * in floating point coefficients */
IntAdjoinSqrt2.prototype.div = function (other) {
    var denominator = other.coeffInt*other.coeffInt - 2*other.coeffSqrt*other.coeffSqrt;
    if (numberEq(denominator,0)){
        console.log("Division by 0 is not possible!");
        return;
    }
    /* (a + bx)/(c + dx) = ((a + bx)*(c - dx))/((c + dx)*(c - dx)) with x = sqrt(2)
     * = (ac- 2bd)/(cc - ddxx) + (bc- ad)*x/(cc - ddxx) */
    var coeffIntCopy = this.coeffInt;
    this.coeffInt = coeffIntCopy * other.coeffInt - 2 * this.coeffSqrt * other.coeffSqrt;
    this.coeffSqrt = this.coeffSqrt * other.coeffInt - coeffIntCopy * other.coeffSqrt;
    return this;
};

/* Basic arithmetic - Negation */
IntAdjoinSqrt2.prototype.neg = function () {
    this.coeffInt = -this.coeffInt;
    this.coeffSqrt = -this.coeffSqrt;
    return this;
};

/* Basic arithmetic - Scaling of the coefficients */
IntAdjoinSqrt2.prototype.scale = function (factor){
    if (numberEq(factor,0)){
        console.log("Scaling by 0 is not possible!");
        console.log(JSON.stringify(this));
        return;
    }
    this.coeffInt *= factor;
    this.coeffSqrt *= factor;
    return this;
};

/* Min and max operations for this special number type */
var IntAdjoinSqrt2Min = function (a, b){
    var compare = a.compare(b);
    if (compare <= 0){
        return a;
    } else {
        return b;
    }
};

var IntAdjoinSqrt2Max = function (a, b){
    var compare = a.compare(b);
    if (compare >= 0){
        return a;
    } else {
        return b;
    }
};