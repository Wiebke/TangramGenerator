importScripts("helpers.js","intadjoinsqrt2.js","point.js", "lineSegement.js",
    "directions.js","tan.js","evaluation.js","tangram.js");

var range = new IntAdjoinSqrt2(50, 0);
var increaseProbability = 50;

var checkNewTan = function (currentTans, newTan) {
    /* For each point of the new piece, check if it lies within the outline of
     * the already placed pieces */
    /* TODO: Maybe summarize this to avoid redundant calls */
    var points = newTan.getPoints();
    /* Use midpoint to exact alignment of one piece in another on */
    var allPoints = points.concat(newTan.getInsidePoints());
    for (var tansId = 0; tansId < currentTans.length; tansId++) {
        var currentPoints = currentTans[tansId].getPoints();
        var onSegmentCounter = 0;
        for (var pointId = 0; pointId < allPoints.length; pointId++) {
            var contains = containsPoint(currentPoints, allPoints[pointId]);
            if (contains === 1) {
                return false;
            } else if (contains === 0) {
                onSegmentCounter++;
            }
        }
        /* If more than 3 points of the new tan lie on one of the already placed
         * tans, there must be an overlap */
        if (onSegmentCounter >= 3) {
            return false;
        }
        onSegmentCounter = 0;
        currentPoints = currentPoints.concat(currentTans[tansId].getInsidePoints());
        for (pointId = 0; pointId < currentPoints.length; pointId++) {
            contains = containsPoint(points, currentPoints[pointId]);
            if (contains === 1) {
                return false;
            } else if (contains === 0) {
                onSegmentCounter++;
            }
        }
        /* If more than 3 points of the new tan lie on one of the already placed
         * tans, there must be an overlap */
        if (onSegmentCounter >= 3) {
            return false;
        }
    }
    /* Check if the currentOutline is intersected by any of the line segments of
     * the new tan */
    var tanSegments = newTan.getSegments();
    for (var segmentId = 0; segmentId < tanSegments.length; segmentId++) {
        for (tansId = 0; tansId < currentTans.length; tansId++) {
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
    /* Check if placement of newTan results in a tangram with a to large range
     * assuming that tangrams with a too large range are not interesting */
    var boundingBox = computeBoundingBox(newTans);
    if (boundingBox[2].dup().subtract(boundingBox[0]).compare(range) > 0
        || boundingBox[3].dup().subtract(boundingBox[1]).compare(range) > 0) {
        return false;
    }
    return true;
};

/* Function to randomly generate a tangram */
var generateTangram = function () {
    /* Generate an order in which the tan pieces are to be placed and an orientation
     * for each piece */
    var flipped = Math.floor(Math.random() * 2);
    var tanOrder = [0, 0, 1, 2, 2, 3, 4 + flipped];
    tanOrder = shuffleArray(tanOrder);
    var orientations = [];
    for (var tanId = 0; tanId < 7; tanId++) {
        orientations[tanId] = Math.floor((Math.random() * numOrientations));
    }
    /* Place the first tan, as defined in tanOrder, at the center the drawing space */
    var tans = [];
    var anchor = new Point(new IntAdjoinSqrt2(30, 0), new IntAdjoinSqrt2(30, 0));
    tans[0] = new Tan(tanOrder[0], anchor, orientations[0]);
    /* For each remaining piece to be placed, determine one of the points of the
     * outline of the already placed pieces as the connecting point to the new
     * piece */
    for (tanId = 1; tanId < 7; tanId++) {
        var currentOutline = getAllPoints(tans);//computeOutline(tans);
        var tanPlaced = false;
        var counter = 0;
        while (!tanPlaced) {
            anchor = currentOutline[Math.floor(Math.random() * currentOutline.length)].dup();
            var pointId = 0;
            var pointOrder = (tanOrder[tanId] < 3) ? [0, 1, 2] : [0, 1, 2, 3];
            pointOrder = shuffleArray(pointOrder);
            do {
                var newTan;
                if (pointOrder[pointId] === 0) {
                    newTan = new Tan(tanOrder[tanId], anchor, orientations[tanId]);
                } else {
                    var tanAnchor = anchor.dup().subtract(Directions[tanOrder[tanId]]
                        [orientations[tanId]][pointOrder[pointId] - 1]);
                    newTan = new Tan(tanOrder[tanId], tanAnchor, orientations[tanId]);
                }
                if (checkNewTan(tans, newTan)) {
                    tans[tanId] = newTan;
                    tanPlaced = true;
                }
                pointId++;
            } while (!tanPlaced && pointId < ((tanOrder[tanId] < 3) ? 3 : 4));
            counter++;
            if (counter > 10000) {
                console.log("Infinity loop!");
                /* Try again */
                return generateTangram();
            }
        }
    }
    return new Tangram(tans);
};

var normalizeProbability = function (distribution){
    var sum = 0;
    for (var index = 0; index < distribution.length; index++){
        sum += distribution[index];
    }
    if (numberEq(sum,0)) return;
    for (index = 0; index < distribution.length; index++){
        distribution[index] /= sum;
    }
    return distribution;
};

var computeOrientationProbability = function (tans, point, tanType, pointId, allSegments) {
    var distribution = [];
    var segmentDirections = [];
    for (var segmentId = 0; segmentId < allSegments.length; segmentId++){
        if (allSegments[segmentId].point1.eq(point)){
            segmentDirections.push(allSegments[segmentId].direction());
        } else if (allSegments[segmentId].point2.eq(point)){
            segmentDirections.push(allSegments[segmentId].direction().neg());
        }
    }
    for (var orientId = 0; orientId < numOrientations; orientId++){
        distribution.push(1);
        //console.log("First:" + JSON.stringify(SegmentDirections[tanType][orientId][pointId][0]));
        //console.log("Second:" + JSON.stringify(SegmentDirections[tanType][orientId][pointId][1]));
        for (segmentId = 0; segmentId < segmentDirections.length; segmentId++){
            //console.log("Compare to:" + JSON.stringify(segmentDirections[segmentId]) + "(" + orientId + ")");
            if (segmentDirections[segmentId].multipleOf(SegmentDirections[tanType][orientId][pointId][0])){
                distribution[orientId]+=increaseProbability;
            }
            if (segmentDirections[segmentId].multipleOf(SegmentDirections[tanType][orientId][pointId][1])){
                distribution[orientId]+=increaseProbability;
            }
        }
    }
    return normalizeProbability(distribution);
};

/* Assumes that the sum of all values in distribution is 1 */
var sampleOrientation = function (distribution) {
    var sample = Math.random();
    var accumulatedProbability = 0;
    distribution = distribution.slice(0);
    if (sample < distribution[0]) return 0;
    for (var index = 1; index < numOrientations; index++){
        distribution[index] += distribution[index-1];
        if (sample <= distribution[index]){
            return index;
        }
    }
    return numOrientations-1;
};

var updatePoints = function (currentPoints, newTan){
    var newPoints = newTan.getPoints();
    currentPoints = currentPoints.concat(newPoints);
    return eliminateDuplicates(currentPoints,comparePoints,true);
};

var updateSegments = function (currentSegments, newTan){
    /* Only the points of the new Tan can split any of the already present segments */
    var newPoints = newTan.getPoints();
    var allSegments = [];
    for (var segmentId = 0; segmentId < currentSegments.length; segmentId++) {
        var splitPoints = [];
        for (var pointId = 0; pointId < newPoints.length; pointId++) {
            if (currentSegments[segmentId].onSegment(newPoints[pointId])) {
                splitPoints.push(newPoints[pointId]);
            }
        }
        allSegments = allSegments.concat(currentSegments[segmentId].split(splitPoints));
    }
    /* Add the segments of the new tan and than */
    allSegments = allSegments.concat(newTan.getSegments());
    allSegments = eliminateDuplicates(allSegments, compareLineSegments, true);
    return allSegments;
};

/* Function to randomly generate a tangram with more overlapping edges */
var generateTangramEdges = function (){
    /* Generate an order in which the tan pieces are to be placed and decide on
     * whether the parallelogram is flipped or not */
    var flipped = Math.floor(Math.random() * 2);
    var tanOrder = [0, 0, 1, 2, 2, 3, 4 + flipped];
    tanOrder = shuffleArray(tanOrder);
    var orientation = Math.floor((Math.random() * numOrientations));
    /* Place the first tan, as defined in tanOrder, at the center the drawing space */
    var tans = [];
    var anchor = new Point(new IntAdjoinSqrt2(30, 0), new IntAdjoinSqrt2(30, 0));
    tans[0] = new Tan(tanOrder[0], anchor, orientation);
    var allPoints = tans[0].getPoints();
    var allSegments = tans[0].getSegments();
    for (var tanId = 1; tanId < 7; tanId++) {
        var tanPlaced = false;
        var counter = 0;
        while (!tanPlaced) {
            /* Choose point at which new tan is to be attached */
            anchor = allPoints[Math.floor(Math.random() * allPoints.length)].dup();
            /* Choose point of the new tan that will be attached to that point */
            var pointId = 0;
            var pointOrder = (tanOrder[tanId] < 3) ? [0, 1, 2] : [0, 1, 2, 3];
            pointOrder = shuffleArray(pointOrder);
            do {
                var newTan;
                /* Compute probability distribution for orientations */
                var orientationDistribution = computeOrientationProbability(tans, anchor,
                    tanOrder[tanId], pointOrder[pointId], allSegments);
                /* Sample a new orientation */
                while (typeof orientationDistribution != 'undefined' && !tanPlaced){
                    orientation = sampleOrientation(orientationDistribution);
                    if (pointOrder[pointId] === 0) {
                        newTan = new Tan(tanOrder[tanId], anchor, orientation);
                    } else {
                        var tanAnchor = anchor.dup().subtract(Directions[tanOrder[tanId]]
                        [orientation][pointOrder[pointId] - 1]);
                        newTan = new Tan(tanOrder[tanId], tanAnchor, orientation);
                    }
                    if (checkNewTan(tans, newTan)) {
                        tans[tanId] = newTan;
                        tanPlaced = true;
                        allPoints = updatePoints(allPoints,newTan);
                        allSegments = updateSegments(allSegments, newTan);
                    }
                    orientationDistribution[orientation] = 0;
                    orientationDistribution = normalizeProbability(orientationDistribution);
                }
                pointId++;
            } while (!tanPlaced && pointId < ((tanOrder[tanId] < 3) ? 3 : 4));
            counter++;
            if (counter > 10000) {
                console.log("Infinity loop!");
                /* Try again */
                return generateTangramEdges();
            }
        }
    }
    return new Tangram(tans);
};

var generateTangrams = function (number) {
    generating = true;
    var generated = [];
    for (var index = 0; index < number; index++) {
        generated[index] = generateTangramEdges();
        self.postMessage(index);
        /* Clean up objects */
        for (var tanId = 0; tanId < 7; tanId++){
            delete generated[index].tans[tanId].points;
            delete generated[index].tans[tanId].segments;
            delete generated[index].tans[tanId].insidePoints;
        }
    }
    generated = generated.sort(compareTangrams);
    generating = false;
    for (var index = 0; index < 6; index++) {
        self.postMessage(JSON.stringify(generated[index].tans));
    }
    self.postMessage("Generating done!");
    return generated;
};

self.addEventListener('message', function(e) {
    var numTangrams = e.data;
    self.postMessage("Worker started!");
    generateTangrams(numTangrams);
}, false);