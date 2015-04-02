/**
 * Class for computation of evaluation measures, contains different measures
 * and final value of the evaluation function
 */

var evaluationWeights = [];

function Evaluation(tans, outline){
    this.numHoles = 0;
    this.holeArea = 0;
    this.outlineVertices = 0;
    this.outerOutlineVertices = 0;
    this.perimeter = 0;
    this.longestEdge = 0;
    this.shortestEdge = 0;
    /* Percentage of how much area the tangram covers of the convex hull */
    this.convexDistance = 0;
    this.convexHullArea = 0;
    this.angleSum = 0;
    this.symmetry = 0;
    /* Pieces with only a matched point */
    this.hangingPieces = 0;
    this.matchedEdges = 0;
    this.matchedPoints = 0;
    this.finalEvalutation = 0;
    this.computeEvaluation(tans,outline);
}

Evaluation.prototype.getEvaluation = function(){

};

var convexHull = function (outerOutline){

};

Evaluation.prototype.computeEvaluation = function(tans, outline){
    this.numHoles = outline.length;
    for (var outlineId = 0; outlineId < outline.length; outlineId++){
        if (outlineId != 0) {
            this.holeArea += outlineArea(outline[outlineId]);
        }
        this.outlineVertices += outline[outlineId].length;
    }
    this.outerOutlineVertices = outline[0].length;
};

