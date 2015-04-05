/* Test tangram - Square */
var anchorBT1 = new Point(new IntAdjoinSqrt2(12, 0), new IntAdjoinSqrt2(12, 0));
var bigTriangle1 = new Tan(0, anchorBT1, 1);
var anchorBT2 = new Point(new IntAdjoinSqrt2(12, 0), new IntAdjoinSqrt2(12, 0));
var bigTriangle2 = new Tan(0, anchorBT2, 7);
var anchorM = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var mediumTriangle = new Tan(1, anchorM, 0);
var anchorST1 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(18, 0));
var smallTriangle1 = new Tan(2, anchorST1, 3);
var anchorST2 = new Point(new IntAdjoinSqrt2(12, 0), new IntAdjoinSqrt2(12, 0));
var smallTriangle2 = new Tan(2, anchorST2, 5);
var anchorS = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(12, 0));
var square = new Tan(3, anchorS, 7);
var anchorP = new Point(new IntAdjoinSqrt2(24, 0), new IntAdjoinSqrt2(0, 0));
var parallelogram = new Tan(5, anchorP, 4);

var squareTangram = new Tangram([bigTriangle1, bigTriangle2, mediumTriangle, smallTriangle1, smallTriangle2, square, parallelogram]);

/* Test tangram - Swan */
var anchorBT1_2 = new Point(new IntAdjoinSqrt2(-6, 12), new IntAdjoinSqrt2(30, 6));
var bigTriangle1_2 = new Tan(0, anchorBT1_2, 6);
var anchorBT2_2 = new Point(new IntAdjoinSqrt2(6, 12), new IntAdjoinSqrt2(42, -6));
var bigTriangle2_2 = new Tan(0, anchorBT2_2, 5);
var anchorM_2 = new Point(new IntAdjoinSqrt2(-6, 6), new IntAdjoinSqrt2(30, 0));
var mediumTriangle_2 = new Tan(1, anchorM_2, 7);
var anchorST1_2 = new Point(new IntAdjoinSqrt2(0, 6), new IntAdjoinSqrt2(0, 6));
var smallTriangle1_2 = new Tan(2, anchorST1_2, 4);
var anchorST2_2 = new Point(new IntAdjoinSqrt2(0, 6), new IntAdjoinSqrt2(24, 0));
var smallTriangle2_2 = new Tan(2, anchorST2_2, 3);
var anchorS_2 = new Point(new IntAdjoinSqrt2(0, 6), new IntAdjoinSqrt2(12, 0));
var square_2 = new Tan(3, anchorS_2, 1);
var anchorP_2 = new Point(new IntAdjoinSqrt2(0, 6), new IntAdjoinSqrt2(0, 0));
var parallelogram_2 = new Tan(5, anchorP_2, 2);

var swanTangram = new Tangram([bigTriangle1_2, bigTriangle2_2, mediumTriangle_2, smallTriangle1_2, smallTriangle2_2, square_2, parallelogram_2]);

/* Test tangram - Cat */
var anchorBT1_3 = new Point(new IntAdjoinSqrt2(18, 12), new IntAdjoinSqrt2(30, -6));
var bigTriangle1_3 = new Tan(0, anchorBT1_3, 3);
var anchorBT2_3 = new Point(new IntAdjoinSqrt2(18, 12), new IntAdjoinSqrt2(30, 6));
var bigTriangle2_3 = new Tan(0, anchorBT2_3, 4);
var anchorM_3 = new Point(new IntAdjoinSqrt2(6, 6), new IntAdjoinSqrt2(18, 0));
var mediumTriangle_3 = new Tan(1, anchorM_3, 7);
var anchorST1_3 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(6, 0));
var smallTriangle1_3 = new Tan(2, anchorST1_3, 3);
var anchorST2_3 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(6, 0));
var smallTriangle2_3 = new Tan(2, anchorST2_3, 7);
var anchorS_3 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(6, 0));
var square_3 = new Tan(3, anchorS_3, 1);
var anchorP_3 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(18, 0));
var parallelogram_3 = new Tan(4, anchorP_3, 7);

var catTangram = new Tangram([bigTriangle1_3, bigTriangle2_3, mediumTriangle_3, smallTriangle1_3, smallTriangle2_3, square_3, parallelogram_3]);

/* Test tangram - Bird */
var anchorBT1_4 = new Point(new IntAdjoinSqrt2(24, 0), new IntAdjoinSqrt2(0, 0));
var bigTriangle1_4 = new Tan(0, anchorBT1_4, 1);
var anchorBT2_4 = new Point(new IntAdjoinSqrt2(36, 0), new IntAdjoinSqrt2(12, 0));
var bigTriangle2_4 = new Tan(0, anchorBT2_4, 5);
var anchorM_4 = new Point(new IntAdjoinSqrt2(12, 18), new IntAdjoinSqrt2(12, 6));
var mediumTriangle_4 = new Tan(1, anchorM_4, 3);
var anchorST1_4 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(6, 0));
var smallTriangle1_4 = new Tan(2, anchorST1_4, 1);
var anchorST2_4 = new Point(new IntAdjoinSqrt2(12, 6), new IntAdjoinSqrt2(12, 0));
var smallTriangle2_4 = new Tan(2, anchorST2_4, 2);
var anchorS_4 = new Point(new IntAdjoinSqrt2(12, 6), new IntAdjoinSqrt2(12, 0));
var square_4 = new Tan(3, anchorS_4, 0);
var anchorP_4 = new Point(new IntAdjoinSqrt2(12, 12), new IntAdjoinSqrt2(12, 0));
var parallelogram_4 = new Tan(4, anchorP_4, 0);

var birdTangram = new Tangram([bigTriangle1_4, bigTriangle2_4, mediumTriangle_4, smallTriangle1_4, smallTriangle2_4, square_4, parallelogram_4]);


/* Test tangram - Mountain */
var anchorBT1_5 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(12, 6));
var bigTriangle1_5 = new Tan(0, anchorBT1_5, 4);
var anchorBT2_5 = new Point(new IntAdjoinSqrt2(0, 24), new IntAdjoinSqrt2(12, 6));
var bigTriangle2_5 = new Tan(0, anchorBT2_5, 6);
var anchorM_5 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(12, 0));
var mediumTriangle_5 = new Tan(1, anchorM_5, 7);
var anchorST1_5 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(12, 6));
var smallTriangle1_5 = new Tan(2, anchorST1_5, 6);
var anchorST2_5 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(12, 6));
var smallTriangle2_5 = new Tan(2, anchorST2_5, 6);
var anchorS_5 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(0, 0));
var square_5 = new Tan(3, anchorS_5, 1);
var anchorP_5 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(12, -6));
var parallelogram_5 = new Tan(4, anchorP_5, 1);

var mountainTangram = new Tangram([bigTriangle1_5, bigTriangle2_5, mediumTriangle_5, smallTriangle1_5, smallTriangle2_5, square_5, parallelogram_5]);

/* Test tangram - Arrow */
var anchorBT1_6 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 0));
var bigTriangle1_6 = new Tan(0, anchorBT1_6, 0);
var anchorBT2_6 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 24));
var bigTriangle2_6 = new Tan(0, anchorBT2_6, 6);
var anchorM_6 = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 12));
var mediumTriangle_6 = new Tan(1, anchorM_6, 7);
var anchorST1_6 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 18));
var smallTriangle1_6 = new Tan(2, anchorST1_6, 2);
var anchorST2_6 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 12));
var smallTriangle2_6 = new Tan(2, anchorST2_6, 4);
var anchorS_6 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(0, 12));
var square_6 = new Tan(3, anchorS_6, 0);
var anchorP_6 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 0));
var parallelogram_6 = new Tan(5, anchorP_6, 3);

var arrowTangram = new Tangram([bigTriangle1_6, bigTriangle2_6, mediumTriangle_6, smallTriangle1_6, smallTriangle2_6, square_6, parallelogram_6]);

/* Test tangram - Big T */
var anchorBT1_7 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 0));
var bigTriangle1_7 = new Tan(0, anchorBT1_7, 2);//
var anchorBT2_7 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(0, 18));
var bigTriangle2_7 = new Tan(0, anchorBT2_7, 3);
var anchorM_7 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(0, 0));
var mediumTriangle_7 = new Tan(1, anchorM_7, 0);//
var anchorST1_7 = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 36));
var smallTriangle1_7 = new Tan(2, anchorST1_7, 6);//
var anchorST2_7 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(0, 36));
var smallTriangle2_7 = new Tan(2, anchorST2_7, 2);//
var anchorS_7 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 0));
var square_7 = new Tan(3, anchorS_7, 0);//
var anchorP_7 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 36));
var parallelogram_7 = new Tan(4, anchorP_7, 1);

var bigT = new Tangram([bigTriangle1_7, bigTriangle2_7, mediumTriangle_7, smallTriangle1_7, smallTriangle2_7, square_7, parallelogram_7]);

/* Test tangram - Big G */
var anchorBT1_8 = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(12, 0));
var bigTriangle1_8 = new Tan(0, anchorBT1_8, 7);//
var anchorBT2_8 = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(12, 12));
var bigTriangle2_8 = new Tan(0, anchorBT2_8, 6);
var anchorM_8 = new Point(new IntAdjoinSqrt2(12 ,0), new IntAdjoinSqrt2(0, 0));
var mediumTriangle_8 = new Tan(1, anchorM_8, 0);//
var anchorST1_8 = new Point(new IntAdjoinSqrt2(-6, 12), new IntAdjoinSqrt2(18, 12));
var smallTriangle1_8 = new Tan(2, anchorST1_8, 5);//
var anchorST2_8 = new Point(new IntAdjoinSqrt2(-12, 24), new IntAdjoinSqrt2(12, 0));
var smallTriangle2_8 = new Tan(2, anchorST2_8, 6);//
var anchorS_8 = new Point(new IntAdjoinSqrt2(-6, 18), new IntAdjoinSqrt2(18, 36));
var square_8 = new Tan(3, anchorS_8, 6);//
var anchorP_8 = new Point(new IntAdjoinSqrt2(-6, 12), new IntAdjoinSqrt2(18, 12));
var parallelogram_8 = new Tan(4, anchorP_8, 7);

var bigG = new Tangram([bigTriangle1_8, bigTriangle2_8, mediumTriangle_8, smallTriangle1_8, smallTriangle2_8, square_8, parallelogram_8]);

/* Test tangram - Arrow */
var anchorBT1_9 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 0));
var bigTriangle1_9 = new Tan(0, anchorBT1_9, 2);
var anchorBT2_9 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 24));
var bigTriangle2_9 = new Tan(0, anchorBT2_9, 4);
var anchorM_9 = new Point(new IntAdjoinSqrt2(0, 24), new IntAdjoinSqrt2(0, 12));
var mediumTriangle_9 = new Tan(1, anchorM_9, 3);
var anchorST1_9 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 18));
var smallTriangle1_9 = new Tan(2, anchorST1_9, 0);
var anchorST2_9 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 12));
var smallTriangle2_9 = new Tan(2, anchorST2_9, 6);
var anchorS_9 = new Point(new IntAdjoinSqrt2(0, 12), new IntAdjoinSqrt2(0, 12));
var square_9 = new Tan(3, anchorS_9, 0);
var anchorP_9 = new Point(new IntAdjoinSqrt2(0, 18), new IntAdjoinSqrt2(0, 12));
var parallelogram_9 = new Tan(4, anchorP_9, 5);

var playTangram = new Tangram([bigTriangle1_9, bigTriangle2_9, mediumTriangle_9, smallTriangle1_9, smallTriangle2_9, square_9, parallelogram_9]);



/* Original outline for the game */
var gameOutline;

var resetPieces = function () {
    var anchorBT1_G = new Point(new IntAdjoinSqrt2(72, -6), new IntAdjoinSqrt2(18.9, -7.5));
    var bigTriangle1_G = new Tan(0, anchorBT1_G, 0);
    var anchorBT2_G = new Point(new IntAdjoinSqrt2(78, 6), new IntAdjoinSqrt2(18.9, 4.5));
    var bigTriangle2_G = new Tan(0, anchorBT2_G, 4);
    var anchorM_G = new Point(new IntAdjoinSqrt2(72, -6), new IntAdjoinSqrt2(29.1, 7.5));
    var mediumTriangle_G = new Tan(1, anchorM_G, 0);
    var anchorST1_G = new Point(new IntAdjoinSqrt2(72, -6), new IntAdjoinSqrt2(26.1, 1.5));
    var smallTriangle1_G = new Tan(2, anchorST1_G, 0);
    var anchorST2_G = new Point(new IntAdjoinSqrt2(75, 0), new IntAdjoinSqrt2(26.1, 7.5));
    var smallTriangle2_G = new Tan(2, anchorST2_G, 4);
    var anchorS_G = new Point(new IntAdjoinSqrt2(78, 6), new IntAdjoinSqrt2(26.1, 7.5));
    var square_G = new Tan(3, anchorS_G, 4);
    var anchorP_G = new Point(new IntAdjoinSqrt2(60, 6), new IntAdjoinSqrt2(41.1, 7.5));
    var parallelogram_G = new Tan(5, anchorP_G, 0);
    gameOutline = [bigTriangle1_G, bigTriangle2_G, mediumTriangle_G, smallTriangle1_G, smallTriangle2_G, square_G, parallelogram_G];
};


var ExampleTangrams = [squareTangram, swanTangram, catTangram, birdTangram, mountainTangram, arrowTangram];

/*ExampleTangrams[0].toSVGOutline("first");
 ExampleTangrams[1].toSVGOutline("second");
 ExampleTangrams[2].toSVGOutline("third");
 ExampleTangrams[3].toSVGOutline("fourth");
 ExampleTangrams[4].toSVGOutline("fifth");
 ExampleTangrams[5].toSVGOutline("sixth");*/