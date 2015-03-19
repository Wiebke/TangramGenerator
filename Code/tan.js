/** Class for a Tan */

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

Tan.prototype.dup = function (){
    return new Tan(this.tanType, this.anchor.dup(), this.orientation);
};

Tan.prototype.area = function () {
    var areas = [4,2,1,2,2,2];
    return areas[this.tanType];
};

Tan.prototype.getPoints = function () {
    var points = [];
    points[0] = this.anchor;
    var directions = Directions[this.tanType][this.orientation];
    for (var dirId = 0; dirId < directions.length; dirId++) {
        var current = this.anchor.dup();
        current.add(directions[dirId]);
        points[dirId+1] = current;
    }
    return points;
};

Tan.prototype.getSegments = function () {
    var segments = [];
    var points = this.getPoints();
    for (var pointId = 0; pointId < points.length; pointId++){
        segments[pointId] = new LineSegment(points[pointId],
            points[(pointId+1)%points.length]);
    }
    return segments;
};

Tan.prototype.insidePoint = function () {
    return this.anchor.dup().add(InsideDirections[this.tanType][this.orientation]);
};

Tan.prototype.toSVG = function () {
    var points = this.getPoints();
    var pointsString = "";
    for (var i = 0; i < points.length; i++){
        pointsString += points[i].toFloatX() + ", " + points[i].toFloatY() + " ";
    }
    return pointsString;
};

/* Functions based on multiple tans */

var getAllPoints = function (tans) {
    var points = [];
    for (var i = 0; i < tans.length; i++) {
        var currentPoints = tans[i].getPoints();
        points = points.concat(currentPoints);
    }
    /* Eliminate duplicates */
    points = eliminateDuplicates(points, comparePoints);
    return points;
};

var outlineArea = function (outline){
    var area = 0;
    for (var pointId = 0; pointId < outline.length; pointId++){
        /* Calculate the cross product of consecutive points. This corresponds
         * to twice the area of the triangle (0,0) - vertices[p] -
         * vertices[(p+1)%num_vertices]. This area is positive if the vertices
         * of that triangle are arranged in a counterclockwise order and negative
         * if the vertices are arranged in a clockwise order
         */
        area += outline[pointId].crossProduct(outline[(pointId+1)%outline.length])
            .toFloat();
    }
    return Math.abs(area)/2.0;
};

var tanSumArea = function (tans){
    var area = 0;
    for (var tanId = 0; tanId < tans.length; tanId++){
        area += tans[tanId].area();
    }
    return area;
};

var outlineContainsAll = function (outline, allPoints){
    for (var pointId = 0; pointId < allPoints.length; pointId++){
        var contains = containsPoint(outline,allPoints[pointId]);
        if (contains === -1){
            return false;
        }
    }
    return true;
};

var computeOutline = function (tans) {
    /* First calculate all line segments involved in the tangram. These line
     * segments are the segments of each individual tan however split up at points
     * from other tans */
    var allPoints = getAllPoints(tans);
    var allSegments = [];
    var currentSegments;
    for (var tanId = 0; tanId < tans.length; tanId++) {
        /* For the line segment of each tan, check if there exists points from
         * other tans on the segment, if that is the case, split the segment at
         * these points */
        currentSegments = tans[tanId].getSegments();
        for (var segmentId = 0; segmentId < currentSegments.length; segmentId++) {
            var splitPoints = [];
            for (var pointID = 0; pointID < allPoints.length; pointID++) {
                if (currentSegments[segmentId].onSegment(allPoints[pointID])) {
                    splitPoints.push(allPoints[pointID]);
                }
            }
            allSegments = allSegments.concat(currentSegments[segmentId].split(splitPoints));
        }
    }
    /* Eliminate duplicates */
    allSegments = eliminateDuplicates(allSegments, compareLineSegments);
    /* Since the points are sorted, the upper left corner is saved at index 0 */
    var lastPoint = allPoints[0];
    var helperPoint = lastPoint.dup();
    helperPoint.subtract(new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)));
    var outline = [];
    outline.push(lastPoint);
    var lastSegment = new LineSegment(helperPoint, lastPoint);
    var firstSegment = true;
    do {
        currentSegments = allSegments.filter(function (element) {
            return !lastSegment.eq(element) && (element.point1.eq(lastPoint) || element.point2.eq(lastPoint));
        });
        var maxAngle = 0;
        var maxIndex = -1;
        for (segmentId = 0; segmentId < currentSegments.length; segmentId++) {
            var currentAngle = currentSegments[segmentId].angleTo(lastSegment);
            if (currentAngle > maxAngle){
                maxIndex = segmentId;
                maxAngle = currentAngle;
            }
        }
        if (maxIndex === -1){
            return;
        }
        if (maxAngle === 180 && !firstSegment) {
            outline.pop();
        }
        if (currentSegments[maxIndex].point1.eq(lastPoint)){
            outline.push(currentSegments[maxIndex].point2);
            lastPoint = currentSegments[maxIndex].point2;
        } else {
            outline.push(currentSegments[maxIndex].point1);
            lastPoint = currentSegments[maxIndex].point1;
        }
        lastSegment = currentSegments[maxIndex];
        allSegments = allSegments.filter(function(element){
            return !lastSegment.eq(element);
        });
        if (firstSegment){
            firstSegment = false;
        }
    } while (!lastPoint.eq(allPoints[0]) || !outlineContainsAll(outline, allPoints));
    /* When the last point is equal to the first it can be deleted */
    //outline.pop();
    return outline;
};


/* TODO change to exact computation */
var computeBoundingBox = function (tans, outline) {
    if (typeof outline === "undefined"){
        outline = getAllPoints(tans);
    }
    /*var minX = 100;
    var minY = 100;
    var maxX = -100;
    var maxY = -100;
    for (var pointId = 0; pointId < outline.length; pointId++){
        var currentX = outline[pointId].toFloatX();
        var currentY = outline[pointId].toFloatY();
        if (currentX < minX) minX = currentX;
        if (currentY < minY) minY = currentY;
        if (currentX > maxX) maxX = currentX;
        if (currentY > maxY) maxY = currentY;
    }*/
    var minX = new IntAdjoinSqrt2(100,0);
    var minY = new IntAdjoinSqrt2(100,0);
    var maxX = new IntAdjoinSqrt2(-100,0);
    var maxY = new IntAdjoinSqrt2(-100,0);
    for (var pointId = 0; pointId < outline.length; pointId++){
        var currentX = outline[pointId].x;
        var currentY = outline[pointId].y;
        if (currentX.compare(minX) < 0) minX = currentX;
        if (currentY.compare(minY) < 0) minY = currentY;
        if (currentX.compare(maxX) > 0) maxX = currentX;
        if (currentY.compare(maxY) > 0) maxY = currentY;
    }
    return [minX,minY,maxX,maxY];
};

/* Returns 1 if the given point is inside the polygon given by outline,
 * return -1 if the point lies on the outline and 0 is the point lies on the outline */
/* TODO get rid of % */
 var containsPoint = function (outline, point){
    /* Compute the winding number for the given point and the polygon, which
     * counts how often the polygon "winds" around the point. The point lies
     * outside, only when the winding number is 0 */
    var winding = 0;
    for (var pointId = 0 ; pointId < outline.length; pointId++) {
        /* Check each segment for containment */
        if (point.eq(outline[pointId]) || point.eq(outline[(pointId+1)%outline.length])
            || new LineSegment(outline[pointId],outline[(pointId+1)%outline.length]).onSegment(point)) {
            return 0;
        }
        /* Line segments are only considered if they are either pointing upward or
         * downward (therefore excluding horizontal lines) and if the intersection
         * point is strictly to the right of the point, for upwards segments,
         * this means that the point must lie to the left of the segment for downwards
         * segments, this means that the point must lie to the right of the segment
         * (when looking into the segment direction) */
        if (outline[pointId].y.compare(point.y) <= 0) {
            /* Upwards edge */
            if (outline[(pointId+1)%outline.length].y.compare(point.y) === 1
                && relativeOrientation(outline[(pointId+1)%outline.length], point, outline[pointId]) > 0) {
                winding++;
            }
        } else {
            /* Downwards edge */
            if (outline[(pointId+1)%outline.length].y.compare(point.y) <= 0
                && relativeOrientation(outline[(pointId+1)%outline.length], point, outline[pointId]) < 0) {
                winding--;
            }
        }
    }
    return (winding === 0) ? -1 : 1;
};