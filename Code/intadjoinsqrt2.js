/**
 * Class for numbers in the ring of integers adjoined square root of 2
 */

/* Constructor */
function IntAdjoinSqrt2(coeffInt, coeffSqrt) {
    this.coeffInt = coeffInt;
    this.coeffSqrt = coeffSqrt;
}

/* Duplication */
IntAdjoinSqrt2.prototype.dup = function () {
    return new IntAdjoinSqrt2(this.coeffInt, this.coeffSqrt);
};

/* Conversion */
IntAdjoinSqrt2.prototype.toFloat = function () {
    return this.coeffInt + this.coeffSqrt * Math.SQRT2;
};

/* Checking if this number is equal to another one, in generating only whole
 * numbers are used === can be used for comparison */
IntAdjoinSqrt2.prototype.eq = function (other) {
    if (generating){
        return this.coeffInt === other.coeffInt && this.coeffSqrt === other.coeffSqrt;
    } else {
        return numberEq(this.coeffInt, other.coeffInt) && numberEq(this.coeffSqrt, other.coeffSqrt);
    }
};

/* Check if two numbers have the same sign */
IntAdjoinSqrt2.prototype.sameSign = function (other) {
    if (this.isZero() && other.isZero()) return true;
    var floatThis = this.toFloat();
    var floatOther = other.toFloat();
    return (floatThis < 0 && floatOther < 0) || (floatThis > 0 && floatOther > 0);
};

/* Compare this number to another one, returns 0 is the numbers are equal, -1 is
 * this number is smaller than the other one and 1, if this one is bigger than the
 * other one */
IntAdjoinSqrt2.prototype.compare = function (other) {
    if (this.eq(other)) {
        return 0;
    } else {
        var floatThis = this.toFloat();
        var floatOther = other.toFloat();
        if (floatThis < floatOther) {
            return -1;
        } else {
            return 1;
        }
    }
};

/* Compare function to be passed to sorting functions */
var compareIntAdjoinSqrt2s = function (numberA, numberB) {
    return numberA.compare(numberB);
};

/* Check if two numbers lie withing a given range of oneanother */
IntAdjoinSqrt2.prototype.closeNumbers = function (other, range) {
    return numberRange(this.toFloat(), other.toFloat(), range);
};

/* Check if this number is equal to zero, use === during generating */
IntAdjoinSqrt2.prototype.isZero = function () {
    if (generating){
        return this.coeffInt === 0 && this.coeffSqrt === 0;
    } else {
        return (numberEq(this.coeffInt, 0) && numberEq(this.coeffSqrt, 0));
    }
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
    var denominator = other.coeffInt * other.coeffInt - 2 * other.coeffSqrt * other.coeffSqrt;
    if (numberEq(denominator, 0)) {
        //console.log("Division by 0 is not possible!");
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

/* Basic arithmetic - Absolute Value */
IntAdjoinSqrt2.prototype.abs = function () {
    this.coeffInt = Math.abs(this.coeffInt);
    this.coeffSqrt = Math.abs(this.coeffSqrt);
    return this;
};

/* Basic arithmetic - Scaling of the coefficients */
IntAdjoinSqrt2.prototype.scale = function (factor) {
    if (numberEq(factor, 0)) {
        console.log("Scaling by 0 is not possible!");
        /* Somehow this fixes strange Safari error ?? */
        console.log(JSON.stringify(this));
        return;
    }
    this.coeffInt *= factor;
    this.coeffSqrt *= factor;
    return this;
};

/* Min and max operations for this special number type */
var IntAdjoinSqrt2Min = function (a, b) {
    var compare = a.compare(b);
    if (compare <= 0) {
        return a;
    } else {
        return b;
    }
};

var IntAdjoinSqrt2Max = function (a, b) {
    var compare = a.compare(b);
    if (compare >= 0) {
        return a;
    } else {
        return b;
    }
};