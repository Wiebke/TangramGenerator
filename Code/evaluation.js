/**
 * Class for computation of evaluation measures, contains different measures
 * and final value of the evaluation function
 */

var evaluationWeights = [];

function Evaluation(tans, outline){
    this.numHoles = 0;
    this.outlinePoints = 0;
    this.outerOutlinePoints = 0;
    this.perimeter = 0;
    this.longestEdge = 0;
    this.shortestEdge = 0;
    this.convexDistance = 0;
    this.convexHullArea = 0;
    this.angleSum = 0;
    this.matchedEdges = 0;
    this.matchedPoints = 0;
    this.symmetry = 0;
    this.finalEvalutation = 0;
    this.computeEvaluation(tans,outline);
}

Evaluation.prototype.getEvaluation = function(){

};

Evaluation.prototype.computeEvaluation = function(tans, outline){

};

