/**
 * Created by Wiebke on 06.03.15.
 */


/* Conversion between different angle systems */

var toRadians = function (degrees){
    return degrees * Math.PI / 180.0;
};

var toDegrees = function (radians){
    return radians * 180.0 / Math.PI;
};

/* Transform angle to that it falls in the interval [0;360] */
var clipAngle = function (angle){
    if (angle < 0){
        while (angle < 0){
            angle += 360;
        }
    } else if (angle > 360){
        while (angle > 360){
            angle -= 360;
        }
    }
};

/* Comparison of to Numbers taking into account precision */

/* Returns true, if the absolute error between two given doubles is smaller than a
 * set threshold */
var numberEq = function (a,b){
    return Math.abs(a-b) < 0.000000000001;
};

/* Returns true, if the two given numbers are not within a a set threshold of
 * each other */
var numberNEq = function (a,b){
    return !numberEq(a,b);
};

/* Cross product in 3D */
var crossProduct3D = function (a, b){
    if (a.length != 3 || b.length != 3) {
        return [0,0,0];
    }
    var result = [];
    result[0] = a[1]*b[2] - a[2]*b[1];
    result[1] = a[2]*b[0] - a[0]*b[2];
    result[2] = a[0]*b[1] - a[1]*b[0];
    return result;
};




