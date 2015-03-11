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

var dragging = false;
var mouseOffset = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
var lastMouse = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));

var getMouseCoordinates = function (event){
    var svg = document.getElementById("game");
    var pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    var globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return new Point(new IntAdjoinSqrt2(globalPoint.x,0), new IntAdjoinSqrt2(globalPoint.y,0));
};

var updateTanPiece = function (id){
    var tanId = "piece" + id;
    var tan = document.getElementById(tanId);
    tan.setAttributeNS(null, "points", gameOutline[id].toSVG());
};

var rotateTan = function (event){

    var tan = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    var mouse = getMouseCoordinates(event);
    var mouseMove = lastMouse.dup().subtract(mouse);
    if (Math.abs(mouseMove.toFloatX()) < 0.05 && Math.abs(mouseMove.toFloatY()) < 0.05) {
        gameOutline[tan].orientation = (gameOutline[tan].orientation + 1) % 8;
        gameOutline[tan].anchor.subtract(mouse).rotate(45).add(mouse) ;
        updateTanPiece(tan);
    }
};

var selectTan = function (event) {
    var tan = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    dragging = true;
    var mouse = getMouseCoordinates(event);
    lastMouse = mouse.dup();
    mouseOffset = mouse.subtract(gameOutline[tan].anchor);
};

var deselectTan = function (event){
    var tan = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    dragging = false;
};

var moveTan = function (event){
    var tan = parseInt(event.srcElement.id[event.srcElement.id.length - 1]);
    var mouse = getMouseCoordinates(event);
    if (dragging){
        gameOutline[tan].anchor = mouse.subtract(mouseOffset);
        updateTanPiece(tan);
    }

};

var addTangramPieces = function () {
    for (var i = 0; i < gameOutline.length; i++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var id = "piece" + i;
        shape.setAttributeNS(null, "id", id);
        shape.setAttributeNS(null, "class", "tan");
        shape.setAttributeNS(null, "points", gameOutline[i].toSVG());
        shape.setAttributeNS(null, "fill", '#FF9900');
        shape.setAttributeNS(null, "opacity", "0.8");
        shape.setAttributeNS(null, "stroke", "#E9E9E9");
        shape.setAttributeNS(null, "stroke-width", "0.05");
        document.getElementById("game").appendChild(shape);
    }

    var tangramPieces = document.getElementsByClassName("tan");
    for (var i = 0; i < tangramPieces.length; i++) {
        tangramPieces[i].addEventListener('click', rotateTan);
        tangramPieces[i].addEventListener('mousedown', selectTan);
        tangramPieces[i].addEventListener('mouseup', deselectTan);
        tangramPieces[i].addEventListener('mousemove', moveTan);
    }
    tangramPieces[6].addEventListener('onContextMenu', function (event) {
        gameOutline[6].tanType = gameOutline[6].tanType === 4 ? 5: 4;
        updateTanPiece(6);
    });
};

var addTangrams = function (generated) {
    generated[0].toSVGOutline("first0");
    generated[1].toSVGOutline("second1");

    generated[2].toSVGOutline("third2");
    generated[3].toSVGOutline("fourth3");

    generated[4].toSVGOutline("fifth4");
    generated[5].toSVGOutline("sixth5");
};


window.onload = function () {
    var generated = generateTangrams(10);
    var chosen = 0;
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
    });

    document.getElementById("set").addEventListener('click', function (){
        resetPieces();
        for (var i = 0; i < gameOutline.length; i++) {
            updateTanPiece(i);
        }
    });

    document.getElementById("sol").addEventListener('click', function (){
        for (var i = 0; i < gameOutline.length; i++) {
            var center = generated[chosen].center();
            gameOutline[i] = generated[chosen].tans[i].dup();
            gameOutline[i].anchor = gameOutline[i].anchor.dup().add(
                new Point(new IntAdjoinSqrt2(center[0], 0), new IntAdjoinSqrt2(center[1], 0)));
            updateTanPiece(i);
        }
    });
};

