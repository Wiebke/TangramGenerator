var range = 9.5;

var compareTangrams = function (tangramA, tangramB){
    return numUniqueElements(tangramA.outline, comparePoints) - numUniqueElements(tangramB.outline, comparePoints);
};

var checkNewTan = function (currentTans, currentOutline, newTan){
    /* For each point of the new piece, check if it lies within the outline of
     * the already placed pieces */
    /* TODO: Maybe summarize this to avoid redundant calls */
    var points = newTan.getPoints();
    /* Use midpoint to exact alignment of one piece in another on */
    points[points.length] = newTan.insidePoint();
    for (var pointId = 0; pointId < points.length; pointId++){
        for (var tansId = 0; tansId < currentTans.length; tansId++){
            if (containsPoint(currentTans[tansId].getPoints(), points[pointId]) === 1){
                return false;
            }
        }
    }
    /* Check if the currentOutline is intersected by any of the line segments of
     * the new tan */
    var tanSegments = newTan.getSegments();
    for (var segmentId = 0; segmentId < tanSegments.length; segmentId++) {
        for (var tansId = 0; tansId < currentTans.length; tansId++) {
            var otherSegments = currentTans[tansId].getSegments();
            for (var otherSegmentsId = 0; otherSegmentsId < otherSegments.length; otherSegmentsId++) {
                if (tanSegments[segmentId].intersects(otherSegments[otherSegmentsId])) {
                    return false;
                }
            }
        }
    }
    var newTans = currentTans.slice(0);
    newTans[currentTans.length] = newTan;
    //var newOutline = computeOutline(newTans);
    /* Check if the placement of newTan results in the creation of a hole or an
     * overlap not detected by the point containment or the segment intersection */
    /* Check if placement of newTan results in a tangram with a to large range
     * assuming that tangrams with a too large range are not interesting */
    var boundingBox = computeBoundingBox(newTans);
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
        var currentOutline = getAllPoints(tans)//computeOutline(tans);
        var tanPlaced = false;
        var counter = 0;
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
            counter++;
            if (counter > 10000){
                console.log("Infinity loop!");
                /* Try again */
                return generateTangram();
            }
        }
    }
    if (tans.length != 7){
        console.log("?");
    }
    return new Tangram(tans);
};

var generateTangrams = function(number){
    var generated = [];
    for (var i = 0; i < number; i++){
        generated[i] = generateTangram();
        console.log("Generated!");
    }
    generated = generated.sort(compareTangrams);
    return generated;
};