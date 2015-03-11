/* Test tangram - Square */
var anchorBT1 = new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(2, 0));
var bigTriangle1 = new Tan(0, anchorBT1, 1);
var anchorBT2 = new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(2, 0));
var bigTriangle2 = new Tan(0, anchorBT2, 7);
var anchorM = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0));
var mediumTriangle = new Tan(1, anchorM, 0);
var anchorST1 = new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(3, 0));
var smallTriangle1 = new Tan(2, anchorST1, 3);
var anchorST2 = new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(2, 0));
var smallTriangle2 = new Tan(2, anchorST2, 5);
var anchorS = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(2, 0));
var square = new Tan(3, anchorS, 7);
var anchorP = new Point(new IntAdjoinSqrt2(4, 0), new IntAdjoinSqrt2(0, 0));
var parallelogram = new Tan(5, anchorP, 4);

var squareTangram = new Tangram([bigTriangle1, bigTriangle2, mediumTriangle, smallTriangle1, smallTriangle2, square, parallelogram]);

/* Test tangram - Swan */
var anchorBT1_2 = new Point(new IntAdjoinSqrt2(-1, 2), new IntAdjoinSqrt2(5, 1));
var bigTriangle1_2 = new Tan(0, anchorBT1_2, 6);
var anchorBT2_2 = new Point(new IntAdjoinSqrt2(1, 2), new IntAdjoinSqrt2(7, -1));
var bigTriangle2_2 = new Tan(0, anchorBT2_2, 5);
var anchorM_2 = new Point(new IntAdjoinSqrt2(-1, 1), new IntAdjoinSqrt2(5, 0));
var mediumTriangle_2 = new Tan(1, anchorM_2, 7);
var anchorST1_2 = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 1));
var smallTriangle1_2 = new Tan(2, anchorST1_2, 4);
var anchorST2_2 = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(4, 0));
var smallTriangle2_2 = new Tan(2, anchorST2_2, 3);
var anchorS_2 = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(2, 0));
var square_2 = new Tan(3, anchorS_2, 1);
var anchorP_2 = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 0));
var parallelogram_2 = new Tan(5, anchorP_2, 2);

var swanTangram = new Tangram([bigTriangle1_2, bigTriangle2_2, mediumTriangle_2, smallTriangle1_2, smallTriangle2_2, square_2, parallelogram_2]);

/* Test tangram - Cat */
var anchorBT1_3 = new Point(new IntAdjoinSqrt2(3, 2), new IntAdjoinSqrt2(5, -1));
var bigTriangle1_3 = new Tan(0, anchorBT1_3, 3);
var anchorBT2_3 = new Point(new IntAdjoinSqrt2(3, 2), new IntAdjoinSqrt2(5, 1));
var bigTriangle2_3 = new Tan(0, anchorBT2_3, 4);
var anchorM_3 = new Point(new IntAdjoinSqrt2(1, 1), new IntAdjoinSqrt2(3, 0));
var mediumTriangle_3 = new Tan(1, anchorM_3, 7);
var anchorST1_3 = new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(1, 0));
var smallTriangle1_3 = new Tan(2, anchorST1_3, 3);
var anchorST2_3 = new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(1, 0));
var smallTriangle2_3 = new Tan(2, anchorST2_3, 7);
var anchorS_3 = new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(1, 0));
var square_3 = new Tan(3, anchorS_3, 1);
var anchorP_3 = new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(3, 0));
var parallelogram_3 = new Tan(4, anchorP_3, 7);

var catTangram = new Tangram([bigTriangle1_3, bigTriangle2_3, mediumTriangle_3, smallTriangle1_3, smallTriangle2_3, square_3, parallelogram_3]);

/* Test tangram - Bird */
var anchorBT1_4 = new Point(new IntAdjoinSqrt2(4, 0), new IntAdjoinSqrt2(0, 0));
var bigTriangle1_4 = new Tan(0, anchorBT1_4, 1);
var anchorBT2_4 = new Point(new IntAdjoinSqrt2(6, 0), new IntAdjoinSqrt2(2, 0));
var bigTriangle2_4 = new Tan(0, anchorBT2_4, 5);
var anchorM_4 = new Point(new IntAdjoinSqrt2(2, 3), new IntAdjoinSqrt2(2, 1));
var mediumTriangle_4 = new Tan(1, anchorM_4, 3);
var anchorST1_4 = new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(1, 0));
var smallTriangle1_4 = new Tan(2, anchorST1_4, 1);
var anchorST2_4 = new Point(new IntAdjoinSqrt2(2, 1), new IntAdjoinSqrt2(2, 0));
var smallTriangle2_4 = new Tan(2, anchorST2_4, 2);
var anchorS_4 = new Point(new IntAdjoinSqrt2(2, 1), new IntAdjoinSqrt2(2, 0));
var square_4 = new Tan(3, anchorS_4, 0);
var anchorP_4 = new Point(new IntAdjoinSqrt2(2, 2), new IntAdjoinSqrt2(2, 0));
var parallelogram_4 = new Tan(4, anchorP_4, 0);

var birdTangram = new Tangram([bigTriangle1_4, bigTriangle2_4, mediumTriangle_4, smallTriangle1_4, smallTriangle2_4, square_4, parallelogram_4]);


/* Test tangram - Mountain */
var anchorBT1_5 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(2, 1));
var bigTriangle1_5 = new Tan(0, anchorBT1_5, 4);
var anchorBT2_5 = new Point(new IntAdjoinSqrt2(0, 4), new IntAdjoinSqrt2(2, 1));
var bigTriangle2_5 = new Tan(0, anchorBT2_5, 6);
var anchorM_5 = new Point(new IntAdjoinSqrt2(0, 3), new IntAdjoinSqrt2(2, 0));
var mediumTriangle_5 = new Tan(1, anchorM_5, 7);
var anchorST1_5 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(2, 1));
var smallTriangle1_5 = new Tan(2, anchorST1_5, 6);
var anchorST2_5 = new Point(new IntAdjoinSqrt2(0, 3), new IntAdjoinSqrt2(2, 1));
var smallTriangle2_5 = new Tan(2, anchorST2_5, 6);
var anchorS_5 = new Point(new IntAdjoinSqrt2(0, 3), new IntAdjoinSqrt2(0, 0));
var square_5 = new Tan(3, anchorS_5, 1);
var anchorP_5 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(2, -1));
var parallelogram_5 = new Tan(4, anchorP_5, 1);

var mountainTangram = new Tangram([bigTriangle1_5, bigTriangle2_5, mediumTriangle_5, smallTriangle1_5, smallTriangle2_5, square_5, parallelogram_5]);

/* Test tangram - Mountain */
var anchorBT1_6 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 0));
var bigTriangle1_6 = new Tan(0, anchorBT1_6, 0);
var anchorBT2_6 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 4));
var bigTriangle2_6 = new Tan(0, anchorBT2_6, 6);
var anchorM_6 = new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2));
var mediumTriangle_6 = new Tan(1, anchorM_6, 7);
var anchorST1_6 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 3));
var smallTriangle1_6 = new Tan(2, anchorST1_6, 2);
var anchorST2_6 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 2));
var smallTriangle2_6 = new Tan(2, anchorST2_6, 4);
var anchorS_6 = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 2));
var square_6 = new Tan(3, anchorS_6, 0);
var anchorP_6 = new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 0));
var parallelogram_6 = new Tan(5, anchorP_6, 3);

var arrowTangram = new Tangram([bigTriangle1_6, bigTriangle2_6, mediumTriangle_6, smallTriangle1_6, smallTriangle2_6, square_6, parallelogram_6]);

/* Original outline for the game */
var anchorBT1_G = new Point(new IntAdjoinSqrt2(12, -1), new IntAdjoinSqrt2(3.15, -1.25));
var bigTriangle1_G = new Tan(0, anchorBT1_G, 0);
var anchorBT2_G = new Point(new IntAdjoinSqrt2(13, 1), new IntAdjoinSqrt2(3.15, 0.75));
var bigTriangle2_G = new Tan(0, anchorBT2_G, 4);
var anchorM_G = new Point(new IntAdjoinSqrt2(12, -1), new IntAdjoinSqrt2(4.85, 1.25));
var mediumTriangle_G = new Tan(1, anchorM_G, 0);
var anchorST1_G = new Point(new IntAdjoinSqrt2(12, -1), new IntAdjoinSqrt2(4.35, 0.25));
var smallTriangle1_G = new Tan(2, anchorST1_G, 0);
var anchorST2_G = new Point(new IntAdjoinSqrt2(12.5, 0), new IntAdjoinSqrt2(4.35, 1.25));
var smallTriangle2_G = new Tan(2, anchorST2_G, 4);
var anchorS_G = new Point(new IntAdjoinSqrt2(13, 1), new IntAdjoinSqrt2(4.35, 1.25));
var square_G = new Tan(3, anchorS_G, 4);
var anchorP_G = new Point(new IntAdjoinSqrt2(10,1), new IntAdjoinSqrt2(6.85, 1.25));
var parallelogram_G = new Tan(5, anchorP_G, 0);

var gameOutline = [bigTriangle1_G, bigTriangle2_G, mediumTriangle_G, smallTriangle1_G, smallTriangle2_G, square_G, parallelogram_G];


var ExampleTangrams = [squareTangram,swanTangram,catTangram,birdTangram,mountainTangram,arrowTangram];

/*ExampleTangrams[0].toSVGOutline("first");
 ExampleTangrams[1].toSVGOutline("second");
 ExampleTangrams[2].toSVGOutline("third");
 ExampleTangrams[3].toSVGOutline("fourth");
 ExampleTangrams[4].toSVGOutline("fifth");
 ExampleTangrams[5].toSVGOutline("sixth");*/