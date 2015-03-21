var numTangrams = 100;
var currentTan = -1;
var mouseOffset = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var lastMouse = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var generated;
var chosen;
var hints = [0, 1, 2, 3, 4, 5, 6];
var numHints = 0;
var snapRange = 0.2;

var changeTangramVisibility = function (hide) {
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].style.display = hide ? 'none' : 'block';
    }
    document.getElementById("generate").style.display = hide ? 'none' : 'inline-block';
    document.getElementById("select").style.display = hide ? 'inline-block' : 'none';
    document.getElementById("set").style.display = hide ? 'inline-block' : 'none';
    document.getElementById("hint").style.display = hide ? 'inline-block' : 'none';
    document.getElementById("sol").style.display = hide ? 'inline-block' : 'none';
};

var getMouseCoordinates = function (event) {
    var svg = document.getElementById("game");
    var pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    var globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return new Point(new IntAdjoinSqrt2(globalPoint.x, 0), new IntAdjoinSqrt2(globalPoint.y, 0));
};

var checkSolved = function () {
    var tangramFromPieces = new Tangram(gameOutline);
    /* Outline of the pieces and the chosen tangram have different length or the
     * outline is undefined -> not solved
     */
    if (typeof tangramFromPieces.outline === 'undefined'
            || generated[chosen].outline.length != tangramFromPieces.outline.length) {
        return false;
    }
    for (var outlineId = 0; outlineId < generated[chosen].outline.length; outlineId++){
        solved = solved && arrayEq(generated[chosen].outline[outlineId], tangramFromPieces.outline[outlineId], comparePoints);
    }
    var solved = arrayEq(generated[chosen].outline[0], tangramFromPieces.outline[0], comparePoints);
    if (!solved){
        return;
    }
    var tangramPieces = document.getElementsByClassName("tan");
    for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
        tangramPieces[tanIndex].setAttributeNS(null, "fill", "#3299BB");
        tangramPieces[tanIndex].setAttributeNS(null, "opacity", "1.0");
    }
};

/* Sets every piece to the solution */
var setToSol = function () {
    for (var tanIndex = 0; tanIndex < 7; tanIndex++) {
        gameOutline[tanIndex] = generated[chosen].tans[tanIndex].dup();
        updateTanPiece(tanIndex);
    }
};

var hint = function () {
    /* Give hints in random order */
    if (numHints === 0) {
        hints = shuffleArray(hints);
    }
    if (numHints > 6) {
        return;
    }
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    shape.setAttributeNS(null, "points", generated[chosen].tans[hints[numHints]].toSVG());
    shape.setAttributeNS(null, "fill", 'none');
    shape.setAttributeNS(null, "stroke", "#E9E9E9");
    shape.setAttributeNS(null, "stroke-width", "0.02");
    document.getElementById("game").appendChild(shape);
    numHints++;
};

var snapToClosePoints = function () {
    if (currentTan === -1) {
        return;
    }
    var tanPoints = gameOutline[currentTan].getPoints();
    var currentTanPoints;
    var snap = false;
    for (var tanId = 0; tanId < 7; tanId++) {
        if (tanId === currentTan) continue;
        currentTanPoints = gameOutline[tanId].getPoints();
        for (var pointsId = 0; pointsId < tanPoints.length; pointsId++) {
            for (var currentPointsId = 0; currentPointsId < currentTanPoints.length; currentPointsId++) {
                if (closePoint(tanPoints[pointsId], currentTanPoints[currentPointsId], snapRange)) {
                    var direction = currentTanPoints[currentPointsId].dup().subtract(tanPoints[pointsId]);
                    gameOutline[currentTan].anchor.add(direction);
                    snap = true;
                    break;
                }
            }
            if (snap){
                break;
            }
        }
        if (snap){
            break;
        }
    }
    if (!snap){
        for (var pointsId = 0; pointsId < tanPoints.length; pointsId++) {
            for (var currentPointsId = 0; currentPointsId < generated[chosen].outline[0].length; currentPointsId++) {
                if (closePoint(tanPoints[pointsId], generated[chosen].outline[0][currentPointsId], snapRange)) {
                    var direction = generated[chosen].outline[0][currentPointsId].dup().subtract(tanPoints[pointsId]);
                    gameOutline[currentTan].anchor.add(direction);
                    snap = true;
                    break;
                }
            }
            if (snap){
                break;
            }
        }
    }
    updateTanPiece(currentTan);
};

var updateTanPiece = function (tanIndex) {
    if (tanIndex < 0) {
        return;
    }
    var tanId = "piece" + tanIndex;
    var tan = document.getElementById(tanId);
    tan.setAttributeNS(null, "points", gameOutline[tanIndex].toSVG());
};

var rotateTan = function (event) {
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    /* console.log("clicked: " + tanIndex); */
    var mouse = getMouseCoordinates(event);
    var mouseMove = lastMouse.dup().subtract(mouse);
    if (Math.abs(mouseMove.toFloatX()) < 0.05 && Math.abs(mouseMove.toFloatY()) < 0.05) {
        /* console.log("rotated: " + tanIndex); */
        gameOutline[tanIndex].orientation = (gameOutline[tanIndex].orientation + 1) % 8;
        gameOutline[tanIndex].anchor.subtract(mouse).rotate(45).add(mouse);
        updateTanPiece(tanIndex);
    }
};

var selectTan = function (event) {
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    /* console.log("selected: " + tanIndex); */
    currentTan = tanIndex;
    var mouse = getMouseCoordinates(event);
    lastMouse = mouse.dup();
    mouseOffset = mouse.subtract(gameOutline[tanIndex].anchor);
    /* Bring this piece to the front */
    var piece = document.getElementById("piece" + tanIndex);
    document.getElementById("game").appendChild(piece);
};

var deselectTan = function (event) {
    snapToClosePoints();
    currentTan = -1;
    mouseOffset = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
    checkSolved();
};

var moveTan = function (event) {
    var mouse = getMouseCoordinates(event);
    if (currentTan != -1) {
        gameOutline[currentTan].anchor = mouse.subtract(mouseOffset);
        updateTanPiece(currentTan);
    }
};

var flipParallelogram = function () {
    gameOutline[6].anchor = gameOutline[6].anchor.add(FlipDirections[5 - gameOutline[6].tanType][gameOutline[6].orientation]);
    gameOutline[6].tanType = gameOutline[6].tanType === 4 ? 5 : 4;
    gameOutline[6].orientation = gameOutline[6].orientation === 0 ? 0 : 8 - gameOutline[6].orientation;
    updateTanPiece(6);
    checkSolved();
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
        //tangramPieces[tanIndex].addEventListener('mousemove', moveTan);
    }
    document.getElementById("game").addEventListener('mousemove', moveTan);
    // document.getElementById("game").addEventListener('mouseout', deselectTan);
};

var addFlipButton = function () {
    var button = document.createElementNS("http://www.w3.org/2000/svg", "g");
    button.setAttributeNS(null, "class", "flip");
    button.setAttributeNS(null, "transform", "translate (" + 11.75 + ", " + 8.75 + ")" + "scale(" + 0.3 + "," + 0.3 + ")");

    var background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttributeNS(null, "x", "1.75");
    background.setAttributeNS(null, "y", "1.75");
    background.setAttributeNS(null, "width", "7.5");
    background.setAttributeNS(null, "height", "1.5");
    background.setAttributeNS(null, "rx", "0.5");
    background.setAttributeNS(null, "ry", "0.5");
    background.setAttributeNS(null, "fill", '#E9E9E9');
    button.appendChild(background);

    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrow.setAttributeNS(null, "points", "5,2.5 5.25,2.25, 5.25,2.4, 5.75,2.4, " +
    "5.75,2.25, 6,2.5, 5.75,2.75, 5.75,2.6 5.25,2.6 5.25,2.75");
    arrow.setAttributeNS(null, "fill", '#BCBCBC');
    button.appendChild(arrow);

    var anchorL = new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(3, 0));
    var parallelogramL = new Tan(5, anchorL, 0);
    var parallelogramElementL = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    parallelogramElementL.setAttributeNS(null, "points", parallelogramL.toSVG());
    parallelogramElementL.setAttributeNS(null, "fill", '#BCBCBC');
    parallelogramElementL.setAttributeNS(null, "stroke", "#BCBCBC");
    parallelogramElementL.setAttributeNS(null, "stroke-width", "0.05");
    button.appendChild((parallelogramElementL));

    var anchorR = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(2, 0));
    var parallelogramR = new Tan(4, anchorR, 0);
    var parallelogramElementR = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    parallelogramElementR.setAttributeNS(null, "points", parallelogramR.toSVG());
    parallelogramElementR.setAttributeNS(null, "fill", '#BCBCBC');
    parallelogramElementR.setAttributeNS(null, "stroke", "#BCBCBC");
    parallelogramElementR.setAttributeNS(null, "stroke-width", "0.05");
    button.appendChild((parallelogramElementR));

    document.getElementById("game").appendChild(button);
    var flipElements = document.getElementsByClassName("flip")[0].childNodes;
    for (var flipIndex = 0; flipIndex < flipElements.length; flipIndex++) {
        flipElements[flipIndex].addEventListener("click", flipParallelogram);
        flipElements[flipIndex].addEventListener("mouseover", function () {
            // console.log("mousein");
            document.getElementsByClassName("flip")[0].firstChild.setAttributeNS(null, "fill", '#3299BB');
        });
        flipElements[flipIndex].addEventListener("mouseout", function () {
            // console.log("mouseOut");
            document.getElementsByClassName("flip")[0].firstChild.setAttributeNS(null, "fill", '#E9E9E9');
        });
    }
};

var addTangrams = function () {
    /*var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":8,"coeffSqrt":0},"y":{"coeffInt":0,"coeffSqrt":0}},"orientation":1},{"tanType":0,"anchor":{"x":{"coeffInt":9,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":5},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":0},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":1,"coeffSqrt":0}},"orientation":7},{"tanType":2,"anchor":{"x":{"coeffInt":7,"coeffSqrt":0},"y":{"coeffInt":-1,"coeffSqrt":0}},"orientation":1},{"tanType":3,"anchor":{"x":{"coeffInt":8,"coeffSqrt":0},"y":{"coeffInt":4,"coeffSqrt":0}},"orientation":3},{"tanType":4,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":6}]';
    failTangram = JSON.parse(failTangram);
     var failTans = [];
     for (var i = 0; i < 7; i++){
     var currentTan = failTangram.tans[i];
     var anchor = new Point(new IntAdjoinSqrt2(currentTan.anchor.x.coeffInt,
     currentTan.anchor.x.coeffSqrt), new IntAdjoinSqrt2(currentTan.anchor.y.coeffInt,
     currentTan.anchor.x.coeffSqrt));
     failTans[i] = new Tan(currentTan.tanType, anchor, currentTan.orientation);
     }
     failTangram = new Tangram(failTans);
     generated[0] = failTangram;*/

    for (var i = 0; i < 6; i++) {
        generated[i].positionCentered();
    }

    generated[0].toSVGOutline("first0");
    generated[1].toSVGOutline("second1");

    generated[2].toSVGOutline("third2");
    generated[3].toSVGOutline("fourth3");

    generated[4].toSVGOutline("fifth4");
    generated[5].toSVGOutline("sixth5");

    /*generated[0].toSVGTans("first0",false);
     generated[1].toSVGTans("second1",false);

     generated[2].toSVGTans("third2",false);
     generated[3].toSVGTans("fourth3",false);

     generated[4].toSVGTans("fifth4",false);
     generated[5].toSVGTans("sixth5",false);*/

};


window.onload = function () {
    generated = generateTangrams(numTangrams);
    chosen = 0;
    resetPieces();
    addTangrams(generated);
    changeTangramVisibility(false);
    /* Show larger version of the chosen tangram */

    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].addEventListener('click', function (event) {
            changeTangramVisibility(true);
            // TODO: add timer
            var sourceId;
            var target = ((window.event) ? (event.srcElement) : (event.currentTarget.firstElementChild));
            if (target.id.length === 0) {
                sourceId = target.parentNode.parentNode.id;
            } else {
                sourceId = target.id;
            }
            chosen = parseInt(sourceId[sourceId.length - 1]);
            generated[chosen].toSVGOutline("game");
            //generated[chosen].toSVGTans("game");
            document.getElementById("game").style.display = "block";
            addTangramPieces();
            addFlipButton();
        });
    }

    document.getElementById("generate").addEventListener('click', function () {
        changeTangramVisibility(true);
        generated = generateTangrams(numTangrams * 100);
        resetPieces();
        addTangrams(generated);
        changeTangramVisibility(false);
    });

    document.getElementById("select").addEventListener('click', function () {
        document.getElementById("game").style.display = 'none';
        var gameNode = document.getElementById('game');
        while (gameNode.firstChild) {
            gameNode.removeChild(gameNode.firstChild);
        }
        changeTangramVisibility(false);
        resetPieces();
        hints = [0, 1, 2, 3, 4, 5, 6];
        numHints = 0;
    });

    document.getElementById("set").addEventListener('click', function () {
        resetPieces();
        for (var tanIndex = 0; tanIndex < gameOutline.length; tanIndex++) {
            updateTanPiece(tanIndex);
        }
        var tangramPieces = document.getElementsByClassName("tan");
        for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
            tangramPieces[tanIndex].setAttributeNS(null, "fill", "#FF9900");
            tangramPieces[tanIndex].setAttributeNS(null, "opacity", "0.8");
        }
    });

    document.getElementById("hint").addEventListener('click', function () {
        hint();
    });

    document.getElementById("sol").addEventListener('click', function () {
        setToSol();
        deselectTan();
    });


};

