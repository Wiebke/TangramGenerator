/* Settings/variables for generating */
var numTangrams = 1000;
var generated = [];
var chosen;
var choicesMade;
var worker;
/* C*/
var random;
var holes;
var compact;
var hangingPiece;
var shortEdge;
var interesting;
var firstEval = true;

/* Parse jsonString of an array of tans into a tangram */
var parseTanArray = function (jsonString) {
    var tangram = JSON.parse(jsonString);
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

var rateAgain = function(){
    document.getElementById("thanks").style.display = 'none';
    document.getElementById("loadParagraph").style.display = 'block';
    document.getElementById("chooseParagraph").style.display = 'none';
    document.getElementById("gameParagraph").style.display = 'none';
    document.getElementById("buttons").style.display = 'none';
    addLoading();
    for (var choiceId = 0 ; choiceId < 10; choiceId++){
        document.getElementById("chosen" + choiceId).setAttributeNS(null, "fill", "#BCBCBC");
        document.getElementById("check" + choiceId).setAttributeNS(null, "fill", "none");
    }
    chosen = 0;
    choicesMade = 0;
    startGenerator();
};

var thanks = function () {
    changeTangramVisibility(true);
    document.getElementById("bubbles").style.display = 'none';
    document.getElementById("thanks").style.display = 'block';
    document.getElementById("loadParagraph").style.display = 'none';
    document.getElementById("chooseParagraph").style.display = 'none';
    document.getElementById("gameParagraph").style.display = 'block';
    document.getElementById("buttons").style.display = 'block';
    document.getElementById("play").addEventListener('click', function (){
        window.location.href='index.html';
    });
    function rateAgainEvent(event) {
        event.target.removeEventListener(event.type, arguments.callee);
        rateAgain();
        firstEval = false;
    }
    document.getElementById("re").addEventListener('click', rateAgainEvent);
};

 /* Show 6 tangrams to choose from*/
var addTangrams = function () {
    if (choicesMade > 9){
        thanks();
    }
    var showing;
    switch (choicesMade){
        case 0:
            if (firstEval){
                showing = interesting;
            } else {
                showing = generated.slice(54,60);
            }
            break;
        case 1:
            showing = compact.slice(0, 6);
            break;
        case 2:
            showing = hangingPiece.slice(0, 6);
            break;
        case 3:
            showing = holes.slice(0, 6);
            break;
        case 4:
            showing = shortEdge.slice(0, 6);
            break;
        case 5,6,7,8,9:
            showing = random.slice((choicesMade-5)*6, (choicesMade-5)*6+6);
            break;
        default:
            showing = generated.slice(choicesMade*6, choicesMade*6+6);
            break;
    }

    for (var tanId = 0; tanId < 6; tanId++) {
        showing[tanId].positionCentered();
    }

    showing[0].toSVGOutline("first0");
    showing[1].toSVGOutline("second1");

    showing[2].toSVGOutline("third2");
    showing[3].toSVGOutline("fourth3");

    showing[4].toSVGOutline("fifth4");
    showing[5].toSVGOutline("sixth5");
};

/* Start generating process in a web worker */
var startGenerator = function () {
    interesting = [];
    interesting[0] = parseTanArray(interesting0);
    interesting[1] = parseTanArray(interesting1);
    interesting[2] = parseTanArray(interesting2);
    interesting[3] = parseTanArray(interesting3);
    interesting[4] = parseTanArray(interesting4);
    interesting[5] = parseTanArray(interesting5);
    worker = new Worker("generator.js");
    worker.onmessage = function (event) {
        var message = event.data;
        if (typeof message === 'string') {
            if (message === "Worker started!") {
                generating = true;
                console.log('Worker said: ', message);
            } else if (message === "Generating done!") {
                addTangrams();
                updateLoading(2);
                random = generated.slice(0,60);
                generated = generated.slice(60,numTangrams);
                holes = generated.slice(0,235).filter(function (item){
                    return item.evaluation.numHoles > 0 && item.evaluation.holeArea < 50 ;
                });
                var generatedIndex = 29;
                while (holes.length < 6){
                    holes.push(random[generatedIndex]);
                    generatedIndex++;
                }
                compact = generated.slice(235,470).filter(function (item){
                    return item.evaluation.convexPercentage > 0.60;
                });
                while (compact.length < 6){
                    compact.push(random[generatedIndex]);
                    generatedIndex++;
                }
                shortEdge = generated.slice(470,705).filter(function (item){
                    return item.evaluation.shortestEdge < 4;
                });
                while (shortEdge.length < 6){
                    shortEdge.push(random[generatedIndex]);
                    generatedIndex++;
                }
                hangingPiece = generated.slice(705,940).filter(function (item){
                    return item.evaluation.hangingPieces === 1;
                });
                while (hangingPiece.length < 6){
                    hangingPiece.push(random[generatedIndex]);
                    generatedIndex++;
                }
                worker.terminate();
            } else {
                generating = false;
                generated.push(parseTanArray(message));
            }
        } else {
            console.log('Worker said: ', "Generated!");
            updateLoading((message + 1) / numTangrams);
        }
    };
    worker.postMessage(numTangrams);
};

window.onload = function () {
    var user = new Date().getTime();
    eval = true;
    /* Provide fallBack if Workers or inline SVG are not supported */
    if (typeof SVGRect === "undefined" || !window.Worker) {
        /* Show Browser fallback PNG */
        var fallbackImage = document.createElement("img");
        fallbackImage.src = "fallback.jpg";
        fallbackImage.alt = "browser does not support all needed functionalities";
        document.getElementById('gameArea').appendChild(fallbackImage);
        return;
    }
    /* Add checkmarks */
    for (var checkId = 0 ; checkId < 10; checkId++) {
        var checkMark = document.createElementNS("http://www.w3.org/2000/svg", "text");
        checkMark.setAttributeNS(null, "x", "" + (10 + 10 * checkId - 1.1));
        checkMark.setAttributeNS(null, "y", "5.8");
        checkMark.setAttributeNS(null, "font-size", "2.4");
        checkMark.setAttributeNS(null, "fill", "none");
        checkMark.setAttributeNS(null, "id", "check"+checkId);
        checkMark.textContent = "\uf00c";
        document.getElementById("bubbles").appendChild(checkMark);
    }
    rateAgain();
    /* Go to next choice */
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].addEventListener('click', function (event) {
            var sourceId;
            var target = ((window.event) ? (event.srcElement) : (event.currentTarget.firstElementChild));
            if (target.id.length === 0) {
                sourceId = target.parentNode.parentNode.id;
            } else {
                sourceId = target.id;
            }
            /* Prevent error when click event fires on content (?) */
            if (sourceId === 'content') {
                return;
            }
            chosen = parseInt(sourceId[sourceId.length - 1]);
            sendChoice(user, chosen, generated.slice(0, 6));
            document.getElementById("chosen" + choicesMade).setAttributeNS(null, "fill", "#17a768");
            document.getElementById("check" + choicesMade).setAttributeNS(null, "fill", "#E9E9E9");
            choicesMade++;
            addTangrams();
        });
    }

};