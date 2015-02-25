
window.onload = function () {
    fillDirections();
    ExampleTangrams[0].toSVG("first");
    ExampleTangrams[1].toSVG("second");
    ExampleTangrams[2].toSVG("third");
    ExampleTangrams[3].toSVG("fourth");
    ExampleTangrams[4].toSVG("fifth");
    ExampleTangrams[5].toSVG("sixth");
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].style.display = 'block';
    }
    console.log(JSON.stringify(Directions));

};

