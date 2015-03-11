var changeTangramVisibility = function (hide){
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].style.display = hide ? 'none' : 'block';

    }
};

var addTangramPieces = function () {
    for (var i = 0; i < gameOutline.length; i++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var id = "piece" + i;
        shape.setAttributeNS(null, "id", id);
        shape.setAttributeNS(null, "points", gameOutline[i].toSVG());
        shape.setAttributeNS(null, "fill", '#FF9900');
        document.getElementById("game").appendChild(shape);
    }
};

window.onload = function () {
    var generated = [];
    for (var i = 0; i < 100; i++){
        generated[i] = generateTangram();
    }
    generated = generated.sort(compareTangrams);
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


    changeTangramVisibility(false);
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].addEventListener('click', function (event){
            changeTangramVisibility(true);
            var sourceId;
            if (event.srcElement.id.length === 0){
                sourceId = event.srcElement.parentNode.parentNode.id;
            } else {
                sourceId = event.srcElement.id;
            }
            var chosen = parseInt(sourceId[sourceId.length-1]);
            generated[chosen].toSVGOutline("game");
            document.getElementById("game").style.display = "block";
            addTangramPieces();
        });
    }



};

