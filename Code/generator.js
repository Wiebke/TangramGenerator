var range = 9.5;

var compareTangrams = function (tangramA, tangramB){
    return tangramA.outline.length - tangramB.outline.length;
}

var checkNewTan = function (currentTans, currentOutline, newTan){
    /* For each point of the new piece, check if it lies within the outline of
     * the already placed pieces */
    var points = newTan.getPoints();
    for (var pointId = 0; pointId < points.length; pointId++){
        if (containsPoint(currentOutline, points[pointId]) === 1){
            return false;
        }
    }
    /* Check if the currentOutline is intersected by any of the line segments of
     * the new tan */
    var tanSegments = newTan.getSegments();
    for (var segmentId = 0; segmentId < tanSegments.length; segmentId++){
    for (pointId = 0; pointId < currentOutline.length; pointId++) {
            if (tanSegments[segmentId].intersects(
                    new LineSegment(currentOutline[pointId],currentOutline[(pointId+1)%currentOutline.length]))){
                return false;
            }
        }
    }
    var newTans = currentTans.slice(0);
    newTans[currentTans.length] = newTan;
    var newOutline = computeOutline(newTans);
    /* Check if the placement of newTan results in the creation of a hole or an
     * overlap not detected by the point containment or the segment intersection */
    var areaOutline = outlineArea(newOutline);
    var areaTans = tanSumArea(newTans);
    /* if areaOutline is larger than the sum of tan areas a hole has been created
     * if the areaOutline is smaller an overlap that could not be detected by
     * the other checks exists */
    if (numberNEq(areaOutline, areaTans)){
        return false;
    }
    /* Check if placement of newTan results in a tangram with a to large range
     * assuming that tangrams with a too large range are not interesting */
    var boundingBox = computeBoundingBox(newTans,newOutline);
    if (boundingBox[2] - boundingBox[0] > range
        || boundingBox[3] - boundingBox[1] > range){
        return false;
    }
    return true;
};

/* Function to randomly generate a tangram */
var generateTangram = function (){
    /* Generate an order in which the tan pieces are to be placed and an orientation
     * for each piece */
    var flipped = Math.floor(Math.random()*2);
    var tanOrder = [0,0,1,2,2,3,4+flipped];
    tanOrder = shuffleArray(tanOrder);
    var orientations = [];
    for (var tanId = 0; tanId < 7; tanId++){
        orientations[tanId] = Math.floor((Math.random()*8));
    }
    /* Place the first tan, as defined in tanOrder, at the center the drawing space */
    var tans = [];
    var anchor = new Point(new IntAdjoinSqrt2(5,0), new IntAdjoinSqrt2(5,0));
    tans[0] = new Tan(tanOrder[0], anchor, orientations[0]);
    /* For each remaining piece to be placed, determine one of the points of the
     * outline of the already placed pieces as the connecting point to the new
     * piece */
    for (tanId = 1 ; tanId < 7; tanId++){
        var currentOutline = computeOutline(tans);
        var tanPlaced = false;
        while (!tanPlaced){
            anchor = currentOutline[Math.floor(Math.random()*currentOutline.length)];
            var pointId = 0;
            var pointOrder = (tanOrder[tanId] < 3) ? [0,1,2] : [0,1,2,3];
            pointOrder = shuffleArray(pointOrder);
            do {
                var newTan;
                if (pointOrder[pointId] === 0){
                    newTan = new Tan(tanOrder[tanId], anchor, orientations[tanId]);
                } else {
                    var tanAnchor = anchor.dup().subtract(Directions[tanOrder[tanId]]
                        [orientations[tanId]][pointOrder[pointId]-1]);
                    newTan = new Tan(tanOrder[tanId], tanAnchor, orientations[tanId]);
                }
                if (checkNewTan(tans, currentOutline, newTan)){
                    tans[tanId] = newTan;
                    tanPlaced = true;
                }
                pointId++;
            } while (!tanPlaced && pointId < ((tanOrder[tanId] < 3) ? 3 : 4));
        }
    }
    return new Tangram(tans);
};