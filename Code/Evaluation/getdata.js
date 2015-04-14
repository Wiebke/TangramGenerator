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

var computeRanks = function (tangrams, chosen){
    var ranks = [];

    for (var key in tangrams[0].evaluation) {
        if (tangrams[0].evaluation.hasOwnProperty(key)) {
            var values = [];
            for (var tangramId = 0; tangramId < tangrams.length; tangramId++){
                values.push(tangrams[tangramId].evaluation[key]);
            }
            values = values.sort(function (a,b) {return a-b});
            ranks.push(values.indexOf(tangrams[chosen].evaluation[key]) + 1);
        }
    }
    return ranks;
};

var ranksToString = function (ranks){
    var line = "";
    for (var rankId = 0; rankId < ranks.length; rankId++){
        line += " " + ranks[rankId] + ";";
    }
    return line;
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
        var choices0 = [0,0,0,0,0,0];
        var tangrams0;
        var ranks0 = [];
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
        file0.write("choices; " + line +  '\n');
        file1.write(line +  '\n');
        file2.write(line +  '\n');
        file3.write(line +  '\n');
        file4.write(line +  '\n');
        file5to9.write(line +  '\n');
        allRandom.write("evalId; chosen;" + line +  '\n');
        items.forEach(function (item){
            var user = item.user - 1.4284E12;
            if (item.tangrams[0] === null){
                return;
            }
            var tangram0 = parseTanArray(item.tangrams[0]);
            var tangram1 = parseTanArray(item.tangrams[1]);
            var tangram2 = parseTanArray(item.tangrams[2]);
            var tangram3 = parseTanArray(item.tangrams[3]);
            var tangram4 = parseTanArray(item.tangrams[4]);
            var tangram5 = parseTanArray(item.tangrams[5]);
            var tangrams = [tangram0, tangram1, tangram2,tangram3, tangram4, tangram5];
            var chosen = item.choice;
            var currentFile;
            var first = false;
            switch (item.evalId){
                case 0:
                    if (numberEq(tangram0.evaluation.convexPercentage, 0.6470418323180936) &&
                        numberEq(tangram1.evaluation.convexPercentage, 0.8) &&
                        numberEq(tangram2.evaluation.convexPercentage, 0.7387961250362585) &&
                    numberEq(tangram3.evaluation.convexPercentage, 0.8655535004351027) &&
                    numberEq(tangram4.evaluation.convexPercentage, 0.6363818984771545) &&
                    numberEq(tangram5.evaluation.convexPercentage, 0.7008805255205637)){
                        first = true;
                        if (ranks0.length == 0){
                            ranks0 = [computeRanks(tangrams,0),computeRanks(tangrams,1),
                                computeRanks(tangrams,2), computeRanks(tangrams,3),
                                computeRanks(tangrams,4),computeRanks(tangrams,5)];
                        }
                        tangrams0 = tangrams;
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
                default:
                    currentFile = file5to9;
                    break;
            }
            if (item.evalId === 0 && first){
                choices0[chosen]++;
            } else {
                var currentLine = ranksToString(computeRanks(tangrams, chosen));
                currentFile.write(currentLine + "\n");
                for (var tangramId = 0; tangramId < tangrams.length; tangramId++){
                    currentLine = item.evalId + "; ";
                    if (tangramId === chosen){
                        currentLine += 1 + "; ";
                    } else {
                        currentLine += 0 + "; ";
                    }
                    currentLine += getEval(tangrams[tangramId]);
                    allRandom.write(currentLine + "\n");
                }
            }
        });
        /* Fill file 0 with choices */
        for (var tangramId = 0; tangramId < ranks0.length; tangramId++){
            var currentLine = choices0[tangramId] + "; " + ranksToString(ranks0[tangramId]);
            file0.write(currentLine + "\n");
        }
        for (var tangramId = 0; tangramId < ranks0.length; tangramId++){
            var currentLine = choices0[tangramId] + "; " + getEval(tangrams0[tangramId]);
            file0.write(currentLine + "\n");
        }
        /* End all files */
        file0.end();
        file1.end();
        file2.end();
        file3.end();
        file4.end();
        file5to9.end();
        allRandom.end();
    });
    console.log("Written to all files :)");
    //db.close();
});
