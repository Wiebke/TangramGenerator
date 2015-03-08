/* Constructor: array of the 7 tan pieces, in order: BigTriangle, 2. Big Triangle
 * MediumTriangle, SmallTriangle, 2. SmallTriangle, */
function Tangram(tans) {
    this.tans = tans;
    /* outline is an array of points describing the outline of the tangram */
    var outline = this.computeOutline();
}

Tangram.prototype.getAllPoints = function () {
    var points = [];
    for (var i = 0; i < this.tans.length; i++) {
        var currentPoints = this.tans[i].getPoints();
        points = points.concat(currentPoints);
    }
    /* Eliminate duplicates */
    points = points.sort(comparePoints);
    points = points.filter(function (element, index) {
        return !index || !element.eq(points[index - 1]);
    });
    return points;
};

Tangram.prototype.computeOutline = function () {
    /* First calculate all line segments involved in the tangram. These line
     * segments are the segments of each individual tan however split up at points
     * from other tans */
    var allPoints = this.getAllPoints();
    var allSegments = [];
    for (var tanId = 0; tanId < this.tans.length; tanId++) {
        /* For the line segment of each tan, check if there exists points from
         * other tans on the segment, if that is the case, split the segment at
         * these points */
        var currentSegments = this.tans[tanId].getSegments();
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
    allSegments = allSegments.sort(compareLineSegments);
    allSegments = allSegments.filter(function (element, index) {
        return !index || !element.eq(allSegments[index - 1]);
    });
    /* Since the points are sorted, the upper left corner is saved at index 0 */
    var lastPoint = allPoints[0];
    var helperPoint = lastPoint.dup();
    helperPoint.subtract(new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)));
    this.outline = [];
    this.outline.push(lastPoint);
    var lastSegment = new LineSegment(helperPoint, lastPoint);
    var firstSegment = true;
    do {
        var currentSegments = allSegments.filter(function (element) {
            return !lastSegment.eq(element) && (element.point1.eq(lastPoint) || element.point2.eq(lastPoint));
        });
        var maxAngle = 0;
        var maxIndex = -1;
        for (var segmentId = 0; segmentId < currentSegments.length; segmentId++) {
            var currentAngle = currentSegments[segmentId].angleTo(lastSegment);
            if (currentAngle > maxAngle){
                maxIndex = segmentId;
                maxAngle = currentAngle;
            }
        }
        if (maxAngle === 180 && !firstSegment) {
            this.outline.pop();
        }
        if (currentSegments[maxIndex].point1.eq(lastPoint)){
            this.outline.push(currentSegments[maxIndex].point2);
            lastPoint = currentSegments[maxIndex].point2;
        } else {
            this.outline.push(currentSegments[maxIndex].point1);
            lastPoint = currentSegments[maxIndex].point1;
        }
        lastSegment = currentSegments[maxIndex];
        allSegments = allSegments.filter(function(element){
            return !lastSegment.eq(element);
        });
        if (firstSegment){
            firstSegment = false;
        }
    } while (!lastPoint.eq(allPoints[0]))
    /* When the last point is equal to the first if can be deleted */
    this.outline.pop();
};

/* Calculates the center of the bounding box of a tangram */
Tangram.prototype.center = function () {
    var center = [0, 0];
    var minX = 100;
    var minY = 100;
    var maxX = -100;
    var maxY = -100
    for (var pointId = 0; pointId < this.outline.length; pointId++){
        var currentX = this.outline[pointId].toFloatX();
        var currentY = this.outline[pointId].toFloatY();
        if (currentX < minX) minX = currentX;
        if (currentY < minY) minY = currentY;
        if (currentX > maxX) maxX = currentX;
        if (currentY > maxY) maxY = currentY;
    }
    center[0] = 5 - (minX + maxX) / 2;
    center[1] = 5 - (minY + maxY) / 2;
    return center;
};

Tangram.prototype.toSVGOutline = function (elementName) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var center = this.center();
    var translate = "translate(" + center[0] + "," + center[1] + ")";
    tangramSVG.setAttributeNS(null, "transform", translate);
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    var pointsString = "";
    for (var i = 0; i < this.outline.length; i++) {
        pointsString += this.outline[i].toFloatX() + ", " + this.outline[i].toFloatY() + " ";
    }
    shape.setAttributeNS(null, "points", pointsString);
    // Fill with random color for now
    shape.setAttributeNS(null, "fill", '#' + Math.random().toString(16).substr(-6));
    tangramSVG.appendChild(shape);
    document.getElementById(elementName).appendChild(tangramSVG);
};

Tangram.prototype.toSVGTans = function (elementName) {
    var tangramSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var center = this.center();
    var translate = "translate(" + center[0] + "," + center[1] + ")";
    tangramSVG.setAttributeNS(null, "transform", translate);
    for (var i = 0; i < this.tans.length; i++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttributeNS(null, "points", this.tans[i].toSVG());
        // Fill with random color for now
        shape.setAttributeNS(null, "fill", '#7ab2ff');
        tangramSVG.appendChild(shape);
    }
    document.getElementById(elementName).appendChild(tangramSVG);
};