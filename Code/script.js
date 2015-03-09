
window.onload = function () {
    var generated = []
    for (var i = 0; i < 10; i++){
        generated[i] = generateTangram();
    }
    generated[0].toSVGTans("first");
    generated[0].toSVGOutline("fourth");

    generated[1].toSVGTans("second");
    generated[1].toSVGOutline("fifth");

    generated[2].toSVGTans("third");
    generated[2].toSVGOutline("sixth");

    /* ExampleTangrams[0].toSVGOutline("first");
     ExampleTangrams[1].toSVGOutline("second");
    ExampleTangrams[2].toSVGOutline("third");
    ExampleTangrams[3].toSVGOutline("fourth");
    ExampleTangrams[4].toSVGOutline("fifth");
    ExampleTangrams[5].toSVGOutline("sixth");*/
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].style.display = 'block';
    }
};

