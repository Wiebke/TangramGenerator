var changeTangramVisibility = function (hide){
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].style.display = hide ? 'none' : 'block';
    }
    document.getElementById("generate").style.display = hide ? 'none': 'inline-block';
    document.getElementById("select").style.display = hide ? 'inline-block' :'none';
    document.getElementById("set").style.display = hide ? 'inline-block' :'none';
    document.getElementById("hint").style.display = hide ? 'inline-block' :'none';
    document.getElementById("sol").style.display = hide ? 'inline-block' :'none';
};

var currentTan = -1;
var mouseOffset = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
var lastMouse = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
var generated;
var chosen;
var solvedBy = [-1,-1,-1,-1,-1,-1,-1];

var getMouseCoordinates = function (event){
    var svg = document.getElementById("game");
    var pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    var globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return new Point(new IntAdjoinSqrt2(globalPoint.x,0), new IntAdjoinSqrt2(globalPoint.y,0));
};

var checkSolved = function (tanIndex){
    var solved;
    if (typeof tanIndex === 'undefined'){
        /* If no tanId is given check if all  */
        solved = true;
        for (var tanIndices = 0; tanIndices < 7; tanIndices++){
            checkSolved(tanIndices);
            solved = solved && (solvedBy[tanIndices]!= -1);
        }
        if (!solved){
            return false;
        }
        return true;
    } else {
        solved = false;
        var tan = generated[chosen].tans[tanIndex];
        var tangramPoints = tan.getPoints();
        var center = generated[chosen].center();
        for (var pTangramsId = 0; pTangramsId < tangramPoints.length; pTangramsId++){
            tangramPoints[pTangramsId] = tangramPoints[pTangramsId].dup().add(
                new Point(new IntAdjoinSqrt2(center[0], 0), new IntAdjoinSqrt2(center[1], 0)));
        }
        var possibleTans = getTansByID(gameOutline, tan.tanType);
        var tanPoints;
        for (var pTansId = 0; pTansId < possibleTans.length; pTansId++){
            tanPoints = possibleTans[pTansId].getPoints();
            solved = solved || arrayEq(tanPoints, tangramPoints, comparePointsFloat, closePoint);
            if (solved){
                switch (tan.tanType){
                    case 0:
                        solvedBy[tanIndex] = pTansId;
                        break;
                    case 1:
                        solvedBy[tanIndex] = 2;
                        break;
                    case 2:
                        solvedBy[tanIndex] = 3 + pTansId;
                        break;
                    case 3:
                        solvedBy[tanIndex] = 5;
                        break;
                    case 4:
                    case 5:
                        solvedBy[tanIndex] = 6;
                        break;
                    default:
                        return -1;
                };
                return true;
            }
        }
        solvedBy[tanIndex] = -1;
        return false;
    }
};

/* Returns index in gameOutline of the tan which has been set to the solution,
 * if no tan can be placed -1 is returned */
var setToSol = function (){
    /* Get the index of the first tan of the tangrams that has no solution yet */
    var tanIndex = solvedBy.indexOf(-1);
    console.log(solvedBy);
    if (tanIndex === -1) {
        return tanIndex;
    }
    var tanType = generated[chosen].tans[tanIndex].tanType;
    var center = generated[chosen].center();
    var generatedTans = generated[chosen].tans[tanIndex];
    var gameTans = [];
    switch (tanType) {
        case 0:
            gameTans = [0,1];
            break;
        case 1:
            gameTans = [2];
            break;
        case 2:
            gameTans = [3,4];
            break;
        case 3:
            gameTans = [5];
            break;
        case 4:
            gameTans = [6];
            break;
        case 5:
            gameTans = [6];
            break;
        default:
            return -1;
    }
    for (var tanIndices = 0; tanIndices < 7; tanIndices++){
        if (gameOutline[tanIndices].tanType === tanType){
            gameTans.push(tanIndices);
        }
    }
    if (tanType === 0 || tanType === 2){
        if (solvedBy.indexOf(gameTans[0]) != -1) {
            console.log ("Already used");
            gameTans[0] = gameTans[1];
        }
    }
    console.log(gameTans[0]);
    /* Get the game tans with the correct id */
    gameOutline[gameTans[0]] = generatedTans.dup();
    gameOutline[gameTans[0]].anchor = gameOutline[gameTans[0]].anchor.dup().add(
        new Point(new IntAdjoinSqrt2(center[0], 0), new IntAdjoinSqrt2(center[1], 0)));
    checkSolved(tanIndex);
    return gameTans[0];
};

var updateTanPiece = function (tanIndex){
    var tanId = "piece" + tanIndex;
    var tan = document.getElementById(tanId);
    tan.setAttributeNS(null, "points", gameOutline[tanIndex].toSVG());
};

var rotateTan = function (event){
    var tanIndex = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    console.log("clicked: " + tanIndex);
    var mouse = getMouseCoordinates(event);
    var mouseMove = lastMouse.dup().subtract(mouse);
    if (Math.abs(mouseMove.toFloatX()) < 0.05 && Math.abs(mouseMove.toFloatY()) < 0.05) {
        console.log("rotated: " + tanIndex);
        gameOutline[tanIndex].orientation = (gameOutline[tanIndex].orientation + 1) % 8;
        gameOutline[tanIndex].anchor.subtract(mouse).rotate(45).add(mouse) ;
        updateTanPiece(tanIndex);
    }
};

var selectTan = function (event) {
    var tanIndex = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    console.log("selected: " + tanIndex);
    currentTan = tanIndex;
    var mouse = getMouseCoordinates(event);
    lastMouse = mouse.dup();
    mouseOffset = mouse.subtract(gameOutline[tanIndex].anchor);
    /* Bring this piece to the front */
    var piece = document.getElementById("piece"+ tanIndex);
    document.getElementById("game").appendChild(piece);
};

var deselectTan = function (event){
    var tanIndex = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    console.log("deselected: " + tanIndex);
    currentTan = -1;
    mouseOffset = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
    checkSolved();
    console.log("Solved: " + checkSolved(0) + " " + checkSolved(1) + " "  + checkSolved(2) + " " +
    checkSolved(3) + " " + checkSolved(4) + " " + checkSolved(5) + " " + checkSolved(6) + " "  );
};

var moveTan = function (event){
    var tanIndex = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    console.log("moved: " + tanIndex + ", " + currentTan);
    var mouse = getMouseCoordinates(event);
    if (currentTan === tanIndex){
        gameOutline[tanIndex].anchor = mouse.subtract(mouseOffset);
        updateTanPiece(tanIndex);
    }
};

var addTangramPieces = function () {
    for (var tanIndex = 0; tanIndex < gameOutline.length; tanIndex++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var id = "piece" + tanIndex;
        shape.setAttributeNS(null, "id", id);
        shape.setAttributeNS(null, "class", "tan");
        shape.setAttributeNS(null, "points", gameOutline[tanIndex].toSVG());
        shape.setAttributeNS(null, "fill", '#FF9900');
        shape.setAttributeNS(null, "opacity", "0.8");
        shape.setAttributeNS(null, "stroke", "#E9E9E9");
        shape.setAttributeNS(null, "stroke-width", "0.05");
        document.getElementById("game").appendChild(shape);
    }

    var tangramPieces = document.getElementsByClassName("tan");
    for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
        tangramPieces[tanIndex].addEventListener('click', rotateTan);
        tangramPieces[tanIndex].addEventListener('mousedown', selectTan);
        tangramPieces[tanIndex].addEventListener('mouseup', deselectTan);
        tangramPieces[tanIndex].addEventListener('mousemove', moveTan);
    }
    // TODO: add possibility to flip paralellogram
};

var addTangrams = function () {
    generated[0].toSVGOutline("first0");
    generated[1].toSVGOutline("second1");

    generated[2].toSVGOutline("third2");
    generated[3].toSVGOutline("fourth3");

    generated[4].toSVGOutline("fifth4");
    generated[5].toSVGOutline("sixth5");
};


window.onload = function () {
    generated = generateTangrams(10);
    chosen = 0;
    resetPieces();
    addTangrams(generated);
    changeTangramVisibility(false);
    /* Show larger version of the chosen tangram */
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].addEventListener('click', function (event) {
            changeTangramVisibility(true);
            var sourceId;
            if (event.srcElement.id.length === 0) {
                sourceId = event.srcElement.parentNode.parentNode.id;
            } else {
                sourceId = event.srcElement.id;
            }
            chosen = parseInt(sourceId[sourceId.length - 1]);
            if (typeof generated[chosen] === 'undefined'){
                console.log(event.srcElement);
                console.log(event.srcElement.parentNode.parentNode)
            }
            generated[chosen].toSVGOutline("game");
            document.getElementById("game").style.display = "block";
            addTangramPieces();
        });
    }

    document.getElementById("select").addEventListener('click', function (){
        document.getElementById("game").style.display = 'none';
        var gameNode = document.getElementById('game');
        while (gameNode.firstChild) {
            gameNode.removeChild(gameNode.firstChild);
        }
        changeTangramVisibility(false);
        resetPieces();
        solvedBy = [-1,-1,-1,-1,-1,-1,-1];
    });

    document.getElementById("set").addEventListener('click', function (){
        resetPieces();
        solvedBy = [-1,-1,-1,-1,-1,-1,-1];
        for (var tanIndex = 0; tanIndex < gameOutline.length; tanIndex++) {
            updateTanPiece(tanIndex);
        }
    });

    document.getElementById("hint").addEventListener('click', function (){
        updateTanPiece(setToSol());
        console.log("Solved: " +  solvedBy);
    });

    document.getElementById("sol").addEventListener('click', function (){
        for (var tanIndex = 0; tanIndex < 7; tanIndex++){
            updateTanPiece(setToSol());
        }
    });
};

