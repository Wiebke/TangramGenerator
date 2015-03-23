/**
 * Definition of directions for each of the tans, the anchor point for each piece
 * is at position x, the directions are defined in clockwise order (except for
 * the flipped parallelogram) and are the vectors to the points a,b,(c), where c
 * is only for four-sided tans, the pieces are all constructed from 16 basic
 * triangles, so that the square built from all 7 pieces has a side length of 4
 * x---a  x----a  x-----a        c-----b
 * |  /   |    |   \     \      /     /
 * | /    |    |    \     \    /     /
 * b      c----b     c-----b  x-----a
 */
var Directions = [];
var InsideDirections = [];

    // Create Array for each tan piece
    for (var i = 0; i <= 5; i++) {
        InsideDirections[i] = [];
        Directions[i] = [];
    }
    // Fill the first entry of each array with the direction vectors for when
    // a piece is not rotated
    Directions[0][0] =
        [new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 0)),
            new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2))];
    //InsideDirections[0][0] = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 1));
    Directions[1][0] =
        [new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(0, 0)),
            new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(2, 0))];
    //InsideDirections[1][0] = new Point(new IntAdjoinSqrt2(0.5, 0), new IntAdjoinSqrt2(0.5, 0));
    Directions[2][0] =
        [new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 0)),
            new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1))];
    //InsideDirections[2][0] = new Point(new IntAdjoinSqrt2(0, 0.25), new IntAdjoinSqrt2(0, 0.25));
    Directions[3][0] =
        [new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 0)),
            new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 1)),
            new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1))];
    //InsideDirections[3][0] = new Point(new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, 0.5));
    Directions[4][0] =
        [new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(0, 0)),
            new Point(new IntAdjoinSqrt2(3, 0), new IntAdjoinSqrt2(1, 0)),
            new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(1, 0))];
    //InsideDirections[4][0] = new Point(new IntAdjoinSqrt2(1.5,0), new IntAdjoinSqrt2(0.5,0));
    Directions[5][0] =
        [new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(0, 0)),
            new Point(new IntAdjoinSqrt2(3, 0), new IntAdjoinSqrt2(-1, 0)),
            new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(-1, 0))];
    //InsideDirections[5][0] = new Point(new IntAdjoinSqrt2(1.5,0), new IntAdjoinSqrt2(-0.5,0));
    for (var tanTypeID = 0; tanTypeID <= 5; tanTypeID ++){
        var centerPoint = new Point();
        for (var pointId = 0; pointId < Directions[tanTypeID][0].length; pointId++){
            centerPoint.add(Directions[tanTypeID][0][pointId]);
        }
        centerPoint.scale(1/(Directions[tanTypeID][0].length+1));
        InsideDirections[tanTypeID][0] = centerPoint;
    }
    // Matrix for rotating by 45 degrees
    var rotationMatrix =
        [[new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, -0.5), new IntAdjoinSqrt2(0, 0)],
            [new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, 0)],
            [new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)]];
    // For each type, rotate the direction vectors of orientation orientID by 45
    // degrees to get the direction vectors for orientation orientID+1
    for (var tanTypeID = 0; tanTypeID <= 5; tanTypeID++) {
        for (var orientID = 0; orientID < 7; orientID++) {
            Directions[tanTypeID][orientID + 1] = [];
            InsideDirections[tanTypeID][orientID + 1] = InsideDirections[tanTypeID][orientID].dup().transform(rotationMatrix);
            for (var dir = 0; dir < Directions[tanTypeID][0].length; dir++) {
                Directions[tanTypeID][orientID + 1][dir] =
                    Directions[tanTypeID][orientID][dir].dup().transform(rotationMatrix);
            }
        }
    }

var FlipDirections = [[new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-1, 0)), /* 0 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1)), /* 1 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(3, 0)), /* 2 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2)), /* 3 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)), /* 4 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -1)), /* 5 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-3, 0)), /* 6 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -2))], /* 7 */
    [new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)), /* 0 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2)), /* 1 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(3, 0)), /* 2 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1)), /* 3 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-1, 0)), /* 4 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -2)), /* 5 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-3, 0)), /* 6 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -1))]]; /* 7 */