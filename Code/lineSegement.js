/**
 * Class for a line segment connecting two points
 */

/* Constructor */
function LineSegment(point1, point2){
    if(point1 === 'undefined'){
        this.point1 = new Point();
    } else {
        this.point1 = point1;
    }
    if(point2 === 'undefined'){
        this.point2 = new Point();
    } else {
        this.point2 = point2;
    }
    /* Order the points so that the point with lower x and lower y values is
     * saved in point1 */
    if(!this.point1.isZero() && this.point2.isZero()){
        var compare = this.point1.compare(this.point2);
        if (compare === 1){
            var point1Copy = this.point1;
            this.point1 = this.point2;
            this.point2 = point1Copy;
        }
    }
}

/* Getters */
LineSegment.prototype.point1 = function(){
    return this.point1;
};

LineSegment.prototype.point2 = function(){
    return this.point2;
};

/* Duplication */
LineSegment.prototype.dup = function() {
    return new LineSegment(this.point1.dup(), this.point2.dup());
};

/* Comparison - equality of two line segments */
LineSegment.prototype.eq = function(other){
    return (this.point1.eq(other.point1) && this.point2.eq(other.point2)) ||
        (this.point2.eq(other.point1) && this.point1.eq(other.point2));
};

/* Comparison for sorting such that the segment with a point with the lowest x-
 * and y-coordinate comes before (return of -1 is this should be before other, 0
 * for equal segments and +1 if this
 */
LineSegment.prototype.compare = function (other) {
    var point1Compare = this.point1.compare(other.point1);
    var point2Compare = this.point2.compare(other.point2);
    if (point1Compare === 'undefined' || point2Compare === 'undefined'){
        console.log("Comparison between the segments is not possible!");
        return;
    }
    if (point1Compare != 0){
        return point1Compare;
    } else {
        return point2Compare;
    }
};

var compareLineSegments = function (segmentA, segmentB){
    return segmentA.compare(segmentB);
};

/* Returns an array of LineSegments, created from this lineSegment when it is split
 * at the given splitPoints (given as an array)
 */
LineSegment.prototype.split = function(splitPoints){
    /* Sort points along segment */
    splitPoints.sort(comparePoints);
    /* Create new segments - staring from this */
};

/* Returns true if the given point is on the segment, but is not equal to either
 * of the endpoints */
LineSegment.prototype.onSegment = function (point){
    /*
    * if (point_1 == point_2) {
     return (point == point_1);
     }
     // Calculate twice the area of the triangle of the two segment points and the given point,
     // if the area is 0, the three points are colinear
     if (Point2D<T>::RelativeOrientation(point_1, point_2, point) == 0) {
     double parameter = ProjectedParameter(point);
     if (parameter >= 0 && parameter <=1){
     return true;
     } else {
     return false;
     }
     }
     return false;
    * */
};

/* Returns the angle between two lineSegments */
LineSegment.prototype.angleTo = function(other){

};


