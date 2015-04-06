var numTangrams = 500;
var generated = [];
var chosen;
/* Variables used during solving */
var currentTan = -1;
var move = false;
var mouseOffset = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var lastMouse = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var lastAngle = 0;
var hints = [0, 1, 2, 3, 4, 5, 6];
var numHints = 0;
var snapRange = 1.2;
var snapped = [false, false, false, false, false, false, false];
/* Variables for statistics */
var timer;
var minutes;
var seconds;
var rotations;
var translations;

var changeIconVisibility = function (showMove, showRotate) {
    var element = document.getElementById("game");
    if (showMove) {
        document.getElementById("move").setAttributeNS(null, "display", "block");
        move = true;
        element.style.cursor = "url('move.ico') 8 8, auto";
    } else {
        document.getElementById("move").setAttributeNS(null, "display", "none");
        move = false;
    }
    if (showRotate) {
        document.getElementById("rotate").setAttributeNS(null, "display", "block");
        element.style.cursor = "url('rotate.ico') 8 8, auto";
    } else {
        document.getElementById("rotate").setAttributeNS(null, "display", "none");
    }
    if (!showMove && !showRotate){
        element.style.cursor = "auto";
    }
};

var getMouseCoordinates = function (event) {
    var svg = document.getElementById("game");
    var pt = svg.createSVGPoint();
    if ('touches' in event){
        var touch = event.changedTouches[0];
        pt.x = touch.clientX;
        pt.y = touch.clientY;
    } else {
        pt.x = event.clientX;
        pt.y = event.clientY;
    }
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
    var solved = true;
    for (var outlineId = 0; outlineId < generated[chosen].outline.length; outlineId++) {
        solved = solved && arrayEq(generated[chosen].outline[outlineId], tangramFromPieces.outline[outlineId], comparePoints);
    }
    if (!solved) {
        return;
    }
    stopWatch();
    var tangramPieces = document.getElementsByClassName("tan");
    for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
        tangramPieces[tanIndex].setAttributeNS(null, "fill", "#3299BB");
        tangramPieces[tanIndex].setAttributeNS(null, "opacity", "1.0");
    }
    var watch = document.getElementById("watch");
    watch.textContent = "";
    var line0 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    line0.setAttributeNS(null, 'x', '66');
    line0.setAttributeNS(null, 'y', '24');
    line0.textContent = "You solved it";
    watch.appendChild(line0);
    var line1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    line1.setAttributeNS(null, 'x', '66');
    line1.setAttributeNS(null, 'y', '27');
    line1.textContent = "in \uf017  " + (minutes ? (minutes > 9 ? minutes : "0" +
    minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) + " with";
    watch.appendChild(line1);
    var line2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    line2.setAttributeNS(null, 'x', '66');
    line2.setAttributeNS(null, 'y', '30');
    line2.textContent = "\uf047  " + translations + " and \uf01e  " + rotations;
    watch.appendChild(line2);
    sendGame(minutes,seconds,numHints,translations,rotations,generated[chosen]);
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
    shape.setAttributeNS(null, "stroke-width", "0.12");
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
                    if (!snapped[tanId]) {
                        var direction = currentTanPoints[currentPointsId].dup().subtract(tanPoints[pointsId]);
                        gameOutline[currentTan].anchor.add(direction);
                    } else {
                        gameOutline[currentTan].anchor = currentPointsId === 0 ?
                            gameOutline[tanId].anchor.dup() : gameOutline[tanId].anchor.dup().add(
                            Directions[gameOutline[tanId].tanType][gameOutline[tanId]
                                .orientation][currentPointsId - 1]);
                        if (pointsId != 0) {
                            gameOutline[currentTan].anchor.subtract(
                                Directions[gameOutline[currentTan].tanType]
                                    [gameOutline[currentTan].orientation][pointsId - 1]);
                        }
                        snapped[currentTan] = true;
                    }
                    snap = true;
                    break;
                }
            }
            if (snap) {
                break;
            }
        }
        if (snap) {
            break;
        }
    }
    if (!snap) {
        for (var pointsId = 0; pointsId < tanPoints.length; pointsId++) {
            for (var outlineId = 0; outlineId < generated[chosen].outline.length; outlineId++) {
                for (var currentPointsId = 0; currentPointsId < generated[chosen].outline[outlineId].length; currentPointsId++) {
                    if (closePoint(tanPoints[pointsId], generated[chosen].outline[outlineId][currentPointsId], snapRange)) {
                        /*var direction = generated[chosen].outline[outlineId][currentPointsId].dup().subtract(tanPoints[pointsId]);
                         gameOutline[currentTan].anchor.add(direction);*/
                        gameOutline[currentTan].anchor = generated[chosen].
                            outline[outlineId][currentPointsId].dup();
                        if (pointsId != 0) {
                            gameOutline[currentTan].anchor.subtract(
                                Directions[gameOutline[currentTan].tanType]
                                    [gameOutline[currentTan].orientation][pointsId - 1]);
                        }
                        snap = true;
                        snapped[currentTan] = true;
                        break;
                    }
                }
            }
            if (snap) {
                break;
            }
        }
    }
    updateTanPiece(currentTan);
};

var snapToClosestRotation = function (mouse) {
    if (currentTan === -1) {
        return;
    }
    var tanCenter = gameOutline[currentTan].center();
    var currentAngle = clipAngle(lastAngle - new LineSegment(tanCenter,
        gameOutline[currentTan].anchor).angleTo(new LineSegment(tanCenter, mouse)));
    currentAngle = Math.round(currentAngle / 45);
    gameOutline[currentTan].orientation = (gameOutline[currentTan].orientation + currentAngle) % numOrientations;
    gameOutline[currentTan].anchor.subtract(tanCenter).rotate(45 * currentAngle).add(tanCenter);
    rotations++;
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

var updateTanPieceRotation = function (tanIndex, angle) {
    if (tanIndex < 0) {
        return;
    }
    var tanId = "piece" + tanIndex;
    var tanCenter = gameOutline[tanIndex].center();
    var tan = document.getElementById(tanId);
    var points = gameOutline[tanIndex].getPoints();
    var pointsString = "";
    for (var pointId = 0; pointId < points.length; pointId++) {
        points[pointId].subtract(tanCenter).rotate(angle).add(tanCenter);
        pointsString += points[pointId].toFloatX() + ", " + points[pointId].toFloatY() + " ";
    }
    tan.setAttributeNS(null, "points", pointsString);
};

var rotateTan = function (event) {
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    // console.log("clicked: " + tanIndex);
    var mouse = getMouseCoordinates(event);
    var mouseMove = lastMouse.dup().subtract(mouse);
    if (Math.abs(mouseMove.toFloatX()) < 0.25 && Math.abs(mouseMove.toFloatY()) < 0.25) {
        /* console.log("rotated: " + tanIndex); */
        gameOutline[tanIndex].orientation = (gameOutline[tanIndex].orientation + 1) % numOrientations;
        gameOutline[tanIndex].anchor.subtract(mouse).rotate(45).add(mouse);
        updateTanPiece(tanIndex);
        rotations++;
    }
};

var selectTan = function (event) {
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    document.getElementById("piece" + tanIndex).setAttributeNS(null, "stroke", "#FF9900");
    //console.log("selected: " + tanIndex);
    currentTan = tanIndex;
    var mouse = getMouseCoordinates(event);
    lastMouse = mouse.dup();
    var tanCenter = gameOutline[currentTan].center();
    lastAngle = new LineSegment(tanCenter, gameOutline[currentTan].anchor).angleTo(
        new LineSegment(tanCenter, lastMouse));
    mouseOffset = mouse.subtract(gameOutline[tanIndex].anchor);
};

var deselectTan = function (event) {
    if (!move) {
        snapToClosestRotation(getMouseCoordinates(event));
    } else {
        translations += 1;
    }
    if (currentTan != -1) {
        snapped[currentTan] = false;
        document.getElementById("piece" + currentTan).setAttributeNS(null, "stroke", "#E9E9E9");
    }
    snapToClosePoints();
    currentTan = -1;
    mouseOffset = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
    checkSolved();
    /* Do not fire deselect on parent element as well */
    event.stopPropagation();
};

var moveTan = function (event) {
    var mouse = getMouseCoordinates(event);
    if (currentTan != -1) {
        if (move) {
            gameOutline[currentTan].anchor = mouse.subtract(mouseOffset);
            updateTanPiece(currentTan);
        } else {
            var tanCenter = gameOutline[currentTan].center();
            var currentAngle = clipAngle(lastAngle - new LineSegment(tanCenter, gameOutline[currentTan].anchor).angleTo(
                new LineSegment(tanCenter, mouse)));
            updateTanPieceRotation(currentTan, currentAngle);
        }
    }
};

var showAction = function (event) {
    /* If tan is already selected and we are not currently handling a touch event
     * nothing has to be done */
    if (currentTan != -1 && !('touches' in event)) return;
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    var mouse = getMouseCoordinates(event);
    var points = gameOutline[tanIndex].getPoints();
    var rotate = false;
    /* Smaller rotate range for "small" tans */
    var rotateRange = (tanIndex > 2) ? 1.8 : 2.7;
    for (var pointId = 0; pointId < points.length; pointId++) {
        if (Math.abs(points[pointId].toFloatX() - mouse.toFloatX()) < rotateRange
            && Math.abs(points[pointId].toFloatY() - mouse.toFloatY()) < rotateRange) {
            rotate = true;
            break;
        }
    }
    if (rotate) {
        changeIconVisibility(false, true);
    } else {
        changeIconVisibility(true, false);
    }
};

var flipParallelogram = function () {
    gameOutline[6].anchor = gameOutline[6].anchor.add(FlipDirections[5 - gameOutline[6].tanType][gameOutline[6].orientation]);
    gameOutline[6].tanType = gameOutline[6].tanType === 4 ? 5 : 4;
    gameOutline[6].orientation = gameOutline[6].orientation === 0 ? 0 : 8 - gameOutline[6].orientation;
    updateTanPiece(6);
    checkSolved();
};

/* Watch functions */

var stopWatch = function () {
    clearTimeout(timer);
};

var updateWatch = function () {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    var watch = document.getElementById("watch");
    watch.textContent = "\uf017  " + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer = setTimeout(updateWatch, 1000);
};

var startWatch = function () {
    var watch = document.getElementById("watch");
    watch.textContent = "\uf017  " + "00:00";
    minutes = 0;
    seconds = 0;
    timer = setTimeout(updateWatch, 1000);
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
        shape.setAttributeNS(null, "stroke-width", "0.3");
        document.getElementById("game").appendChild(shape);
    }
    var tangramPieces = document.getElementsByClassName("tan");
    for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
        tangramPieces[tanIndex].addEventListener('click', rotateTan);
        tangramPieces[tanIndex].addEventListener('mousedown', selectTan);
        tangramPieces[tanIndex].addEventListener('mouseup', deselectTan);
        tangramPieces[tanIndex].addEventListener('mouseover', showAction);
        tangramPieces[tanIndex].addEventListener('mousemove', showAction);
        tangramPieces[tanIndex].addEventListener('mouseout', function () {
            if (currentTan === -1) changeIconVisibility(false, false);
        });
        tangramPieces[tanIndex].addEventListener('touchstart', function(event){
            selectTan(event);
            showAction(event);
        });
        tangramPieces[tanIndex].addEventListener('touchend', function(event){
            //event.preventDefault();
            deselectTan(event);
        });
        tangramPieces[tanIndex].addEventListener('touchmove', function(event){
            event.preventDefault();
            moveTan(event);
        });


    }
    document.getElementById("game").addEventListener('mousemove', moveTan);
    document.getElementById("game").addEventListener('mouseup', deselectTan);
    document.getElementById("game").addEventListener('touchstart', function(event){
        event.preventDefault();
    });
    document.getElementById("game").addEventListener('touchend', function(event){
        event.preventDefault();
    });
    document.getElementById("game").addEventListener('touchmove', function(event){
        event.preventDefault();
    });
};

var addIcons = function () {
    var moveIcon = document.createElementNS("http://www.w3.org/2000/svg", "text");
    moveIcon.setAttributeNS(null, "x", "69");
    moveIcon.setAttributeNS(null, "y", "57.9");
    moveIcon.setAttributeNS(null, "font-size", "2.7");
    moveIcon.setAttributeNS(null, "fill", "#E9E9E9");
    moveIcon.setAttributeNS(null, "id", "move");
    moveIcon.setAttributeNS(null, "display", "none");
    moveIcon.textContent = "\uf047";
    document.getElementById("game").appendChild(moveIcon);
    var rotateIcon = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rotateIcon.setAttributeNS(null, "x", "69");
    rotateIcon.setAttributeNS(null, "y", "57.9");
    rotateIcon.setAttributeNS(null, "font-size", "2.7");
    rotateIcon.setAttributeNS(null, "fill", "#E9E9E9");
    rotateIcon.setAttributeNS(null, "id", "rotate");
    rotateIcon.setAttributeNS(null, "display", "none");
    rotateIcon.textContent = "\uf01e";
    document.getElementById("game").appendChild(rotateIcon);
    var watch = document.createElementNS("http://www.w3.org/2000/svg", "text");
    watch.setAttributeNS(null, "x", "3");
    watch.setAttributeNS(null, "y", "57.9");
    watch.setAttributeNS(null, "fill", "#E9E9E9");
    watch.setAttributeNS(null, "id", "watch");
    watch.setAttributeNS(null, "font-size", "2.7");
    watch.textContent = "\uf017  " + "00:00";
    document.getElementById("game").appendChild(watch);
};

var addFlipButton = function () {
    var button = document.createElementNS("http://www.w3.org/2000/svg", "g");
    button.setAttributeNS(null, "class", "flip");
    button.setAttributeNS(null, "transform", "translate (" + 70.5 + ", " + 52.5 + ")" + "scale(" + 0.3 + "," + 0.3 + ")");

    var background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttributeNS(null, "x", "10.5");
    background.setAttributeNS(null, "y", "10.5");
    background.setAttributeNS(null, "width", "45");
    background.setAttributeNS(null, "height", "9");
    background.setAttributeNS(null, "rx", "3.0");
    background.setAttributeNS(null, "ry", "3.0");
    background.setAttributeNS(null, "fill", '#E9E9E9');
    button.appendChild(background);

    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrow.setAttributeNS(null, "points", "30,15 31.5,13.5, 31.5,14.4, 34.5,14.4, " +
    "34.5,13.5, 36,15, 34.5,16.5, 34.5,15.6 31.5,15.6 31.5,16.5");
    arrow.setAttributeNS(null, "fill", '#BCBCBC');
    button.appendChild(arrow);

    var anchorL = new Point(new IntAdjoinSqrt2(12, 0), new IntAdjoinSqrt2(18, 0));
    var parallelogramL = new Tan(5, anchorL, 0);
    var parallelogramElementL = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    parallelogramElementL.setAttributeNS(null, "points", parallelogramL.toSVG());
    parallelogramElementL.setAttributeNS(null, "fill", '#BCBCBC');
    parallelogramElementL.setAttributeNS(null, "stroke", "#BCBCBC");
    parallelogramElementL.setAttributeNS(null, "stroke-width", "0.3");
    button.appendChild((parallelogramElementL));

    var anchorR = new Point(new IntAdjoinSqrt2(36, 0), new IntAdjoinSqrt2(12, 0));
    var parallelogramR = new Tan(4, anchorR, 0);
    var parallelogramElementR = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    parallelogramElementR.setAttributeNS(null, "points", parallelogramR.toSVG());
    parallelogramElementR.setAttributeNS(null, "fill", '#BCBCBC');
    parallelogramElementR.setAttributeNS(null, "stroke", "#BCBCBC");
    parallelogramElementR.setAttributeNS(null, "stroke-width", "0.3");
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

var parseTanArray = function(jsonString){
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

var addTangrams = function () {
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":2,"coeffSqrt":0},"y":{"coeffInt":4,"coeffSqrt":0}},"orientation":7},{"tanType":0,"anchor":{"x":{"coeffInt":7,"coeffSqrt":2},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":2},{"tanType":1,"anchor":{"x":{"coeffInt":7,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":2},{"tanType":2,"anchor":{"x":{"coeffInt":6,"coeffSqrt":0},"y":{"coeffInt":6,"coeffSqrt":0}},"orientation":3},{"tanType":2,"anchor":{"x":{"coeffInt":6,"coeffSqrt":0},"y":{"coeffInt":4,"coeffSqrt":0}},"orientation":1},{"tanType":3,"anchor":{"x":{"coeffInt":7,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":1},{"tanType":4,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":2}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":4},{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":1},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":2},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-3},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":4},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":1},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":2},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-4},"y":{"coeffInt":7,"coeffSqrt":2}},"orientation":5},{"tanType":5,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":3}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":11,"coeffSqrt":0}},"orientation":7},{"tanType":0,"anchor":{"x":{"coeffInt":1,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":7},{"tanType":1,"anchor":{"x":{"coeffInt":4,"coeffSqrt":0},"y":{"coeffInt":8,"coeffSqrt":0}},"orientation":6},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":7},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":3},{"tanType":5,"anchor":{"x":{"coeffInt":6,"coeffSqrt":0},"y":{"coeffInt":6,"coeffSqrt":0}},"orientation":2}]';
    //var failTangram ='[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":1},"y":{"coeffInt":7.5,"coeffSqrt":-1}},"orientation":2},{"tanType":0,"anchor":{"x":{"coeffInt":7,"coeffSqrt":1},"y":{"coeffInt":5.5,"coeffSqrt":-1}},"orientation":3},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":3.5,"coeffSqrt":0}},"orientation":5},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":3.5,"coeffSqrt":-1}},"orientation":5},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":3.5,"coeffSqrt":0}},"orientation":2},{"tanType":3,"anchor":{"x":{"coeffInt":4,"coeffSqrt":-1},"y":{"coeffInt":4.5,"coeffSqrt":-1}},"orientation":5},{"tanType":5,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":7.5,"coeffSqrt":-1}},"orientation":6}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":4},{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":4},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-3},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":2},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":-2}},"orientation":4},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":4},{"tanType":5,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":-2}},"orientation":7}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":5},{"tanType":0,"anchor":{"x":{"coeffInt":8,"coeffSqrt":0},"y":{"coeffInt":8,"coeffSqrt":0}},"orientation":3},{"tanType":1,"anchor":{"x":{"coeffInt":7,"coeffSqrt":1},"y":{"coeffInt":3,"coeffSqrt":-1}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":4,"coeffSqrt":0},"y":{"coeffInt":6,"coeffSqrt":0}},"orientation":5},{"tanType":3,"anchor":{"x":{"coeffInt":3,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":5},{"tanType":5,"anchor":{"x":{"coeffInt":3,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":6}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-4},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":4},{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":-1}},"orientation":4},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-3},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":5},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":4},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":6},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":4},{"tanType":4,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":5}]';
    /*var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":30,"coeffSqrt":3},"y":{"coeffInt":36,"coeffSqrt":-12}},"orientation":3},{"tanType":0,"anchor":{"x":{"coeffInt":30,"coeffSqrt":3},"y":{"coeffInt":36,"coeffSqrt":12}},"orientation":4},{"tanType":1,"anchor":{"x":{"coeffInt":30,"coeffSqrt":3},"y":{"coeffInt":36,"coeffSqrt":-12}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":18,"coeffSqrt":3},"y":{"coeffInt":48,"coeffSqrt":-6}},"orientation":6},{"tanType":2,"anchor":{"x":{"coeffInt":30,"coeffSqrt":3},"y":{"coeffInt":36,"coeffSqrt":0}},"orientation":0},{"tanType":3,"anchor":{"x":{"coeffInt":30,"coeffSqrt":9},"y":{"coeffInt":36,"coeffSqrt":0}},"orientation":4},{"tanType":5,"anchor":{"x":{"coeffInt":30,"coeffSqrt":3},"y":{"coeffInt":36,"coeffSqrt":12}},"orientation":7}]';
    failTangram = JSON.parse(failTangram);
    var failTans = [];
    var newTan;
    for (var index = 0; index < 7; index++) {
        var currentTan = failTangram[index];
        var anchor = new Point(new IntAdjoinSqrt2(currentTan.anchor.x.coeffInt,
            currentTan.anchor.x.coeffSqrt), new IntAdjoinSqrt2(currentTan.anchor.y.coeffInt,
            currentTan.anchor.y.coeffSqrt));
            failTans.push(new Tan(currentTan.tanType, anchor, currentTan.orientation));


    }
    failTangram = new Tangram(failTans);
    generated[0] = failTangram;*/
    for (var tanId = 0; tanId < 6; tanId++) {
        generated[tanId].positionCentered();
    }

    //generated[0].toSVGTans("first0", false);
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

var startGenerator = function () {
    addLoading();
    var worker = new Worker("generator.js");
    worker.onmessage = function(event) {
        var message = event.data;
        if (typeof message === 'string'){
            if (message === "Worker started" || message === "Generating done"){
                console.log('Worker said: ', message);
            } else {
                generating = false;
                generated.push(parseTanArray(message));
                if (generated.length === numTangrams){
                    addTangrams();
                }
            }
        } else {
            console.log('Worker said: ', "Generated!");
            updateLoading((message+1)/numTangrams);
        }

    };
    worker.postMessage(numTangrams);
};

window.onload = function () {
    // TODO provide fallBack if Workers are not supported
    startGenerator();
    chosen = 0;
    resetPieces();
    /* Show larger version of the chosen tangram */

    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].addEventListener('click', function (event) {
            changeTangramVisibility(true);
            var sourceId;
            var target = ((window.event) ? (event.srcElement) : (event.currentTarget.firstElementChild));
            if (target.id.length === 0) {
                sourceId = target.parentNode.parentNode.id;
            } else {
                sourceId = target.id;
            }
            /* Prevent error when click event fires on content (?) */
            if (sourceId === 'content'){
                return;
            }
            chosen = parseInt(sourceId[sourceId.length - 1]);
            generated[chosen].toSVGOutline("game");
            console.log(JSON.stringify(generated[chosen].tans));
            //generated[chosen].toSVGTans("game");
            document.getElementById("game").style.display = "block";
            addTangramPieces();
            addFlipButton();
            addIcons();
            rotations = 0;
            translations = 0;
            startWatch();
            sendChoice(chosen, generated.slice(0,6));
        });
    }

    document.getElementById("generate").addEventListener('click', function () {
        changeTangramVisibility(true);
        generated = [];
        startGenerator();
        resetPieces();
    });

    document.getElementById("select").addEventListener('click', function () {
        document.getElementById("game").style.display = 'none';
        var gameNode = document.getElementById('game');
        while (gameNode.firstChild) {
            gameNode.removeChild(gameNode.firstChild);
        }
        changeTangramVisibility(false);
        resetPieces();
        stopWatch();
        hints = [0, 1, 2, 3, 4, 5, 6];
        numHints = 0;
        snapped = [false, false, false, false, false, false, false];
    });

    document.getElementById("set").addEventListener('click', function () {
        resetPieces();
        for (var tanIndex = 0; tanIndex < gameOutline.length; tanIndex++) {
            updateTanPiece(tanIndex);
        }
        rotations = 0;
        translations = 0;
        snapped = [false, false, false, false, false, false, false];
        var watch = document.getElementById("watch");
        while (watch.firstChild) {
            watch.removeChild(watch.firstChild);
        }
        watch.setAttributeNS(null, "x", "3");
        watch.setAttributeNS(null, "y", "58.5");
        startWatch();
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
        var tangramPieces = document.getElementsByClassName("tan");
        for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
            tangramPieces[tanIndex].setAttributeNS(null, "fill", "#3299BB");
            tangramPieces[tanIndex].setAttributeNS(null, "opacity", "1.0");
        }
        /* Hide watch */
        stopWatch();
        var watch = document.getElementById("watch");
        while (watch.firstChild) {
            watch.removeChild(watch.firstChild);
        }
    });
};

