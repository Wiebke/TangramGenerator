/**
 * Class for computation of evaluation measures, contains different measures
 * and final value of the evaluation function
 */

var evaluationMode = 0;

function Evaluation(tans, outline){
    /* TODO Vertices of the whole outline: between 3 and 17 (23-6)) */
    this.outlineVertices = 0;
    /* TODO Vertices of the outer outline (not including holes): between 3 and 17 */
    this.outerOutlineVertices = 0;
    /* TODO Number of Holes: between 0 and 3*/
    this.numHoles = 0;
    /* TODO Area of all holes: between 0 and ? */
    this.holeArea = 0;
    /* TODO Number of vertices of the holes: between */
    this.holeVertices = 0;
    /* TODO Perimeter of the outer outline */
    this.perimeter = 0;
    /* TODO Longest edge of the outer outline */
    this.longestEdge = 0;
    /* TODO Shortest edge of the outer outline */
    this.shortestEdge = 0;
    /* TODO Percentage of how much area the tangram covers of the convex hull */
    this.convexPercentage = 0;
    /* TODO Size of the convex hull */
    this.convexHullArea = 0;
    /* TODO Sum of the angle of the outer ouline */
    this.angleSum = 0;
    /* TODO Number of symmetry axes (x/y-axes): between 0 and 2
    this.symmetry = 0;
    /* TODO Pieces with only a matched point */
    this.hangingPieces = 0;
    /* TODO Number of Edges that occur twice */
    this.matchedEdges = 0;
    /* TODO Number of pairs of vertices in the same place */
    this.matchedVertices = 0;
    this.finalEvalutation = 0;
    this.computeEvaluation(tans,outline);
}

Evaluation.prototype.getValue = function(){
    return this.finalEvalutation;
};

Evaluation.prototype.updateEvaluation = function(){
    switch (evaluationMode){
        case 0:
            this.finalEvalutation = this.numHoles;
            break;
        case 1:
            var evaluationWeights = [];
            break;
        default:
            this.finalEvalutation = 0;
    }
};

var convexHull = function (outerOutline){

};

Evaluation.prototype.computeEvaluation = function(tans, outline){
    this.outerOutlineVertices = outline[0].length;
    this.numHoles = outline.length - 1;
    for (var outlineId = 0; outlineId < outline.length; outlineId++){
        if (outlineId != 0) {
            this.holeArea += outlineArea(outline[outlineId]);
        }
        this.outlineVertices += outline[outlineId].length;
    }
    this.holeVertices = this.outlineVertices - this.outerOutlineVertices;
    this.longestEdge = -1;
    this.shortestEdge = 10;
    var currentEdge;
    for (var pointId = 0; pointId < outline[0].length-1; pointId++){
        currentEdge = outline[0][pointId].distance(outline[0][pointId+1]);
        if (currentEdge > this.longestEdge){
            this.longestEdge = currentEdge;
        }
        if (currentEdge < this.shortestEdge){
            this.shortestEdge = currentEdge;
        }
        this.perimeter += currentEdge;
    }
    currentEdge = outline[0][pointId].distance(outline[0][0]);
    if (currentEdge > this.longestEdge){
        this.longestEdge = currentEdge;
    }
    if (currentEdge < this.shortestEdge){
        this.shortestEdge = currentEdge;
    }
    this.perimeter += currentEdge;
    /* TODO: update during computation and pass here */
    var allPoints = getAllPoints(tans);
    var allSegments = computeSegments(allPoints, tans);

    /* Compute final evaluation value */
    this.updateEvaluation();
};

