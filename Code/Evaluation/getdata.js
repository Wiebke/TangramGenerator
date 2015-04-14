/* Load the http module to create an http server */
var http = require('http');
/* Load the mongodb module to connect to database */
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
var pathname = "/Users/Wiebke/Documents/IDP Tangram/Code/";
includeInThisContext(pathname + "helpers.js");
includeInThisContext(pathname + "intadjoinsqrt2.js");
includeInThisContext(pathname + "point.js");
includeInThisContext(pathname + "lineSegement.js");
includeInThisContext(pathname + "directions.js");
includeInThisContext(pathname + "tan.js");
includeInThisContext(pathname + "evaluation.js");
includeInThisContext(pathname + "tangram.js");

/* Default to a 'localhost' configuration */
var server_port = 8080;
var server_ip_address = '127.0.0.1';
var connection_string = '127.0.0.1:27017/tangen';

var line = "outlineVertices; outerOutlineVertices; numHoles; holeArea;" +
    "holeVertices; holeType;perimeter; longestEdge; shortestEdge;" +
    "rangeX; rangeY; convexPercentage; convexHullArea; symmetry; hangingPieces;" +
    "matchedEdges ;matchedVertices;";

var getEval = function (tangram) {
    var line = "";
    for (var key in tangram.evaluation) {
        if (tangram.evaluation.hasOwnProperty(key)) {
            if (tangram.evaluation[key] % 1 === 0){
                line += ""+ tangram.evaluation[key] + ";";
            } else{
                line += ""+ tangram.evaluation[key].toFixed(5) + ";";
            }

        }
    }
    return line;
};

var parseTanArray = function (tangram) {
    var tans = [];
    var newTan;
    for (var index = 0; index < 7; index++) {
        var currentTan = tangram[index];
        var anchor = new Point(new IntAdjoinSqrt2(currentTan.anchor.x.coeffInt,
            currentTan.anchor.x.coeffSqrt), new IntAdjoinSqrt2(currentTan.anchor.y.coeffInt,
            currentTan.anchor.y.coeffSqrt));
        tans.push(new Tan(currentTan.tanType, anchor, currentTan.orientation));
    }
    return new Tangram(tans);
};

/* Connect to the database */
MongoClient.connect('mongodb://' + connection_string, function (error, db) {
    if (error) throw error;
    console.log("Connected correctly to MongoDB");

    /*db.collection("tangram-statistics").find().toArray(function(err, items) {
        var file = fs.createWriteStream('Code/Evaluation/games.csv');
        file.on('error', function(err) { });
        file.write('user; seconds; hints; translations; rotations; '  + line +  '\n');
        items.forEach(function (item){
            var seconds = item.minutes*60 + item.seconds;
            var user = item.user - 1.4284E12;
            var line = user + ";" +  seconds + "; " + item.hints + "; " + item.translations + "; " + item.rotations + "; ";
            var tangram = parseTanArray(item.tangram);
            line += getEval(tangram);
            file.write(line + "\n");
        });
        file.end();
    });*/

    db.collection("tangram-eval").find().toArray(function(err, items) {
        var file0 = fs.createWriteStream('Code/Evaluation/eval0.csv');
        file0.on('error', function(err) { });
        var file1 = fs.createWriteStream('Code/Evaluation/eval1.csv');
        file1.on('error', function(err) { });
        var file2 = fs.createWriteStream('Code/Evaluation/eval2.csv');
        file2.on('error', function(err) { });
        var file3 = fs.createWriteStream('Code/Evaluation/eval3.csv');
        file3.on('error', function(err) { });
        var file4 = fs.createWriteStream('Code/Evaluation/eval4.csv');
        file4.on('error', function(err) { });
        var file5to9 = fs.createWriteStream('Code/Evaluation/eval5to9.csv');
        file5to9.on('error', function(err) { });
        var allRandom = fs.createWriteStream('Code/Evaluation/allRandom.csv');
        file1.write(line +  '\n');
        file1.write(line +  '\n');
        file2.write(line +  '\n');
        file3.write(line +  '\n');
        file4.write(line +  '\n');
        file5to9.write(line +  '\n');
        allRandom.write(line +  '\n');
        items.forEach(function (item){
            var user = item.user - 1.4284E12;
            var tangram0 = parseTanArray(item.tangrams[0]);
            var tangram1 = parseTanArray(item.tangrams[1]);
            var tangram2 = parseTanArray(item.tangrams[2]);
            var tangram3 = parseTanArray(item.tangrams[3]);
            var tangram4 = parseTanArray(item.tangrams[4]);
            var tangram5 = parseTanArray(item.tangrams[5]);
            var tangrams = [tangram0, tangram1, tangram2,tangram3, tangram4, tangram5];
            var chosen = item.choice;
            var currentFile;
            switch (item.evalId){
                case 0:
                    if (true){
                        currentFile = file0;
                    } else {
                        currentFile = file5to9
                    }
                    //check if equal to first Tangram
                    break;
                case 1:
                    currentFile = file1;
                    break;
                case 2:
                    currentFile = file2;
                    break;
                case 3:
                    currentFile = file3;
                    break;
                case 4:
                    currentFile = file4;
                    break;
                case 5,6,7,8,9:
                    currentFile = file5to9;
                    break;
                default:
                    break;
            }
            currentFile.write(line + "\n");
        });
        /* End all files */
        file0.end();
        file1.end();
        file2.end();
        file3.end();
        file4.end();
        file5to9.end();
        allRandom.end();
    });

    //db.close();
});
