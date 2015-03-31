var numTangrams = 100;
var generated;
var chosen;
/* Variables used during solving */
var currentTan = -1;
var move = false;
var mouseOffset = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var lastMouse = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var lastAngle = 0;
var hints = [0, 1, 2, 3, 4, 5, 6];
var numHints = 0;
var snapRange = 0.2;
var snapped = [false, false, false, false, false, false, false];
/* Variables for statistics */
var timer;
var minutes;
var seconds;
var rotations;
var translations;

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

var changeIconVisibility = function (showMove, showRotate) {
    if (showMove) {
        document.getElementById("move").setAttributeNS(null, "display", "block");
        move = true;
    } else {
        document.getElementById("move").setAttributeNS(null, "display", "none");
        move = false;
    }
    if (showRotate) {
        document.getElementById("rotate").setAttributeNS(null, "display", "block");
    } else {
        document.getElementById("rotate").setAttributeNS(null, "display", "none");
    }
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
    var solved = true;
    for (var outlineId = 0; outlineId < generated[chosen].outline.length; outlineId++) {
        solved = solved && arrayEq(generated[chosen].outline[outlineId], tangramFromPieces.outline[outlineId], comparePoints);
    }
    if (!solved) {
        return;
    }
    var tangramPieces = document.getElementsByClassName("tan");
    for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
        tangramPieces[tanIndex].setAttributeNS(null, "fill", "#3299BB");
        tangramPieces[tanIndex].setAttributeNS(null, "opacity", "1.0");
    }
    stopWatch();
    var watch = document.getElementById("watch");
    watch.textContent = "";
    var line0 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    line0.setAttributeNS(null, 'x', '11');
    line0.setAttributeNS(null, 'y', '4');
    line0.textContent = "You solved it";
    watch.appendChild(line0);
    var line1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    line1.setAttributeNS(null, 'x', '11');
    line1.setAttributeNS(null, 'y', '4.5');
    line1.textContent = "in \uf017  " + (minutes ? (minutes > 9 ? minutes : "0" +
    minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) + " with";
    watch.appendChild(line1);
    var line2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    line2.setAttributeNS(null, 'x', '11');
    line2.setAttributeNS(null, 'y', '5');
    line2.textContent = "\uf047  " + translations + " and \uf01e  " + rotations;
    watch.appendChild(line2);
    /* Set new position */
    /*watch.setAttributeNS(null, "x", "11");
     watch.setAttributeNS(null, "y", "4");*/
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
    var tanCenter = gameOutline[currentTan].insidePoint();
    var currentAngle = clipAngle(lastAngle - new LineSegment(tanCenter,
        gameOutline[currentTan].anchor).angleTo(new LineSegment(tanCenter, mouse)));
    currentAngle = Math.round(currentAngle / 45);
    gameOutline[currentTan].orientation = (gameOutline[currentTan].orientation + currentAngle) % 8;
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
    var tanCenter = gameOutline[tanIndex].insidePoint();
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
    if (Math.abs(mouseMove.toFloatX()) < 0.05 && Math.abs(mouseMove.toFloatY()) < 0.05) {
        /* console.log("rotated: " + tanIndex); */
        gameOutline[tanIndex].orientation = (gameOutline[tanIndex].orientation + 1) % 8;
        gameOutline[tanIndex].anchor.subtract(mouse).rotate(45).add(mouse);
        updateTanPiece(tanIndex);
        rotations++;
    }
};

var selectTan = function (event) {
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    //console.log("selected: " + tanIndex);
    currentTan = tanIndex;
    var mouse = getMouseCoordinates(event);
    lastMouse = mouse.dup();
    var tanCenter = gameOutline[currentTan].insidePoint();
    lastAngle = new LineSegment(tanCenter, gameOutline[currentTan].anchor).angleTo(
        new LineSegment(tanCenter, lastMouse));
    mouseOffset = mouse.subtract(gameOutline[tanIndex].anchor);
    /* Bring this piece to the front -> Disables click, thus call click handler */
    /*if (document.getElementById("game").lastChild.id != "piece" + tanIndex){
     var piece = document.getElementById("piece" + tanIndex);
     document.getElementById("game").appendChild(piece);
     rotateTan(event);
     }*/
};

var deselectTan = function (event) {
    // console.log("deselected: ");
    if (!move) {
        snapToClosestRotation(getMouseCoordinates(event));
    } else {
        /* Fires twice on release */
        translations += 0.5;
    }
    if (currentTan != -1) {
        snapped[currentTan] = false;
    }
    snapToClosePoints();
    currentTan = -1;
    mouseOffset = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
    checkSolved();
};

var moveTan = function (event) {
    var mouse = getMouseCoordinates(event);
    if (currentTan != -1) {
        if (move) {
            gameOutline[currentTan].anchor = mouse.subtract(mouseOffset);
            updateTanPiece(currentTan);
        } else {
            var tanCenter = gameOutline[currentTan].insidePoint();
            var currentAngle = clipAngle(lastAngle - new LineSegment(tanCenter, gameOutline[currentTan].anchor).angleTo(
                new LineSegment(tanCenter, mouse)));
            updateTanPieceRotation(currentTan, currentAngle);
        }
    }
};

var showAction = function (event) {
    if (currentTan != -1) return;
    var target = ((window.event) ? (event.srcElement) : (event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    var mouse = getMouseCoordinates(event);
    var points = gameOutline[tanIndex].getPoints();
    var rotate = false;
    for (var pointId = 0; pointId < points.length; pointId++) {
        if (Math.abs(points[pointId].toFloatX() - mouse.toFloatX()) < 0.45
            && Math.abs(points[pointId].toFloatY() - mouse.toFloatY()) < 0.45) {
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
        shape.setAttributeNS(null, "stroke-width", "0.05");
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
    }
    document.getElementById("game").addEventListener('mousemove', moveTan);
    document.getElementById("game").addEventListener('mouseup', deselectTan);
};

var addIcons = function () {
    var moveIcon = document.createElementNS("http://www.w3.org/2000/svg", "text");
    moveIcon.setAttributeNS(null, "x", "11.5");
    moveIcon.setAttributeNS(null, "y", "9.65");
    moveIcon.setAttributeNS(null, "font-size", "0.45");
    moveIcon.setAttributeNS(null, "fill", "#E9E9E9");
    moveIcon.setAttributeNS(null, "id", "move");
    moveIcon.setAttributeNS(null, "display", "none");
    moveIcon.textContent = "\uf047";
    document.getElementById("game").appendChild(moveIcon);
    var rotateIcon = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rotateIcon.setAttributeNS(null, "x", "11.5");
    rotateIcon.setAttributeNS(null, "y", "9.65");
    rotateIcon.setAttributeNS(null, "font-size", "0.45");
    rotateIcon.setAttributeNS(null, "fill", "#E9E9E9");
    rotateIcon.setAttributeNS(null, "id", "rotate");
    rotateIcon.setAttributeNS(null, "display", "none");
    rotateIcon.textContent = "\uf01e";
    document.getElementById("game").appendChild(rotateIcon);
    var watch = document.createElementNS("http://www.w3.org/2000/svg", "text");
    watch.setAttributeNS(null, "x", "0.5");
    watch.setAttributeNS(null, "y", "9.65");
    watch.setAttributeNS(null, "fill", "#E9E9E9");
    watch.setAttributeNS(null, "id", "watch");
    watch.setAttributeNS(null, "font-size", "0.45");
    watch.textContent = "\uf017  " + "00:00";
    document.getElementById("game").appendChild(watch);
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
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":2,"coeffSqrt":0},"y":{"coeffInt":4,"coeffSqrt":0}},"orientation":7},{"tanType":0,"anchor":{"x":{"coeffInt":7,"coeffSqrt":2},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":2},{"tanType":1,"anchor":{"x":{"coeffInt":7,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":2},{"tanType":2,"anchor":{"x":{"coeffInt":6,"coeffSqrt":0},"y":{"coeffInt":6,"coeffSqrt":0}},"orientation":3},{"tanType":2,"anchor":{"x":{"coeffInt":6,"coeffSqrt":0},"y":{"coeffInt":4,"coeffSqrt":0}},"orientation":1},{"tanType":3,"anchor":{"x":{"coeffInt":7,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":1},{"tanType":4,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":2}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":4},{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":1},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":2},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-3},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":4},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":1},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":2},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-4},"y":{"coeffInt":7,"coeffSqrt":2}},"orientation":5},{"tanType":5,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":3}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":11,"coeffSqrt":0}},"orientation":7},{"tanType":0,"anchor":{"x":{"coeffInt":1,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":7},{"tanType":1,"anchor":{"x":{"coeffInt":4,"coeffSqrt":0},"y":{"coeffInt":8,"coeffSqrt":0}},"orientation":6},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":7},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":3},{"tanType":5,"anchor":{"x":{"coeffInt":6,"coeffSqrt":0},"y":{"coeffInt":6,"coeffSqrt":0}},"orientation":2}]';
    //var failTangram ='[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":1},"y":{"coeffInt":7.5,"coeffSqrt":-1}},"orientation":2},{"tanType":0,"anchor":{"x":{"coeffInt":7,"coeffSqrt":1},"y":{"coeffInt":5.5,"coeffSqrt":-1}},"orientation":3},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":3.5,"coeffSqrt":0}},"orientation":5},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":3.5,"coeffSqrt":-1}},"orientation":5},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":3.5,"coeffSqrt":0}},"orientation":2},{"tanType":3,"anchor":{"x":{"coeffInt":4,"coeffSqrt":-1},"y":{"coeffInt":4.5,"coeffSqrt":-1}},"orientation":5},{"tanType":5,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":7.5,"coeffSqrt":-1}},"orientation":6}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":4},{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":4},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-3},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":2},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":-2}},"orientation":4},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":4},{"tanType":5,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":-2}},"orientation":7}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":5},{"tanType":0,"anchor":{"x":{"coeffInt":8,"coeffSqrt":0},"y":{"coeffInt":8,"coeffSqrt":0}},"orientation":3},{"tanType":1,"anchor":{"x":{"coeffInt":7,"coeffSqrt":1},"y":{"coeffInt":3,"coeffSqrt":-1}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":1},{"tanType":2,"anchor":{"x":{"coeffInt":4,"coeffSqrt":0},"y":{"coeffInt":6,"coeffSqrt":0}},"orientation":5},{"tanType":3,"anchor":{"x":{"coeffInt":3,"coeffSqrt":0},"y":{"coeffInt":7,"coeffSqrt":0}},"orientation":5},{"tanType":5,"anchor":{"x":{"coeffInt":3,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":6}]';
    //var failTangram = '[{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-4},"y":{"coeffInt":5,"coeffSqrt":2}},"orientation":4},{"tanType":0,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":-1}},"orientation":4},{"tanType":1,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-3},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":5},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":0},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":4},{"tanType":2,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":6},{"tanType":3,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-1},"y":{"coeffInt":5,"coeffSqrt":1}},"orientation":4},{"tanType":4,"anchor":{"x":{"coeffInt":5,"coeffSqrt":-2},"y":{"coeffInt":5,"coeffSqrt":0}},"orientation":5}]';
     /*failTangram = JSON.parse(failTangram);
     var failTans = [];
     for (var index = 0; index < 7; index++){
     var currentTan = failTangram[index];
     var anchor = new Point(new IntAdjoinSqrt2(currentTan.anchor.x.coeffInt,
     currentTan.anchor.x.coeffSqrt), new IntAdjoinSqrt2(currentTan.anchor.y.coeffInt,
     currentTan.anchor.y.coeffSqrt));
     failTans[index] = new Tan(currentTan.tanType, anchor, currentTan.orientation);
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
            var sourceId;
            var target = ((window.event) ? (event.srcElement) : (event.currentTarget.firstElementChild));
            if (target.id.length === 0) {
                sourceId = target.parentNode.parentNode.id;
            } else {
                sourceId = target.id;
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
        watch.setAttributeNS(null, "x", "0.5");
        watch.setAttributeNS(null, "y", "9.75");
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
        checkSolved();
        /* Hide watch */
        var watch = document.getElementById("watch");
        while (watch.firstChild) {
            watch.removeChild(watch.firstChild);
        }
    });


};

