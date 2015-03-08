
window.onload = function () {
    ExampleTangrams[0].toSVGOutline("first");
    ExampleTangrams[1].toSVGOutline("second");
    ExampleTangrams[2].toSVGOutline("third");
    ExampleTangrams[3].toSVGOutline("fourth");
    ExampleTangrams[4].toSVGOutline("fifth");
    ExampleTangrams[5].toSVGOutline("sixth");
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].style.display = 'block';
    }
};

