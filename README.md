# Random Tangram Generator

Tangram is an old Chinese dissection puzzle. Seven puzzle pieces, called tans,
have to be placed within a given shape in a way such that the entire shape is covered.
This application randomly generates a large number of such shapes, orders them
according to an interestingness measure and then displays a number of top candidates.
It is then possible to chose one of the shapes and attempt to solve it. This choice
and game statistics are communicated to a server.

# File contents

The following describes which files contain which functionality and which measures
have to be taken for running the application (this applies to server-side parts
that work with additional frameworks).

## Generator

#### `index.html, style.css`
These two files define the basic structure and design of the web page displaying
the application. Almost all elements are already defined here, but some elements
are hidden when entering the site and some do not have any content, but will be
filled during the run of the application. This includes all paragraphs, all buttons
 and all inline SVGs that will be displayed at different stages of application.

#### `script.js, loading.js`
`script.js` contains the `window.onload`-function which initializes all variables
used during the run of the application, starts the generation process and adds
event listeners to all buttons. All interaction within the application is
defined and handled in this file. This includes:
* event listeners for all buttons (for regenerating tangrams, resetting a game,
showing a hint, showing the solution, flipping the parallelogram, ...)
* functions for changing the content of already defined HTML-elements (showing and
hiding elements as well as filling them with content depending on the state of the
application, e.g. adding the svg version of the top 6 tangrams to the respective
already defined `<svg>`-tags, once the generating process has finished)
* functions for reacting to mouse and touch input within the game area (these are
mostly event listeners attached to individual tans or the entire game area)
* functions containing the game logic, which includes checking if the tangram
has been solved, snapping once an action has been performed and displaying the current
action (translation or rotation) as well as displaying solution and hints if the
user clicks the respective button
* functions to start and stop the watch

`loading.js` contains the functions to create and update (thus fill
 according to the progress of the generation) the loading screen

#### `directions.js, exampleTangrams.js`
`directions.js` contains the pre-computation of direction vectors for the vertices
of the individual tans and points within the tans (from a specific anchor vertex)
for each possible orientation as well as direction vectors for all segments (thus
extending the directions for vertices to include direction vectors starting from
the other points as well) and direction vectors used when flipping the parallelogram
(specifying how the anchor has to be moved). These can then later accessed by e.g.
 `Direction[tantype][orientation][id]`.

`exampleTangrams.js` contains some example tangrams (a square, a swan, a cat, a
mountain, ... ) that have been used in the beginning stages of the project and
for testing. Additionally, the positions for the tans that have to be moved within
the game are defined here. This means that the variable `gameOutline` is set here.

#### `intadjoinsqrt2.js`
Contains a wrapper class for numbers in the ring of integers adjoined square root of 2
including functions for:
* basic arithmetic: addition, subtraction, multiplication and division of two numbers,
scaling, negation and computation of the absolute value of one number
* conversion to a floating point number
* comparison of two numbers: general compare function (returning -1, 0 or 1),
equality check, comparison to zero, and function for checking if two numbers have
the same sign
* min and max operations for two given numbers

#### `point.js`
Contains a wrapper class for a point defined by an x- and a y-coordinate
(both being numbers in the ring of integers adjoined square root of 2) including
functions for:
* computation of combinations of two points (add, subtract, middle)
* computation of properties of one (length, angle) or two points (distance, angle to
another point)
* comparison of two points according to their coordinates (both equality and general
comparison are provided as well as comparison function for both comparing by x-coordinate
and then y-coordinate first as well as the other way around)
* checking if a point if equal to (0,0), checking if one point/vector is a multiple of
a given other one and checking if points lie within a given range of each other
* transformation of a point (scaling, rotation, translation)
* computation of dot product and determinant of two points
* getting the floating point value of the coordinates

Additionally, some functions related to multiple points can be found here. These
are the computation of the relative orientation of three points and a function that
checks if a given array contains two given points both more than once (needed for
filtering segments).

#### `lineSegment.js`
Contains a wrapper class for a line segment defined by two end points, which are
sorted when creating the line segment, (so that the first point is always the one
with lower x and lower y values) including functions for:
* computation of properties (length, direction, angle to another segment)
* comparison of line segments according to their end points
* intersection tests for two line segments and containment test for a segment
and a point
* splitting one line segment according to a given array of split points

#### `tan.js`
Contains a wrapper class for an individual tan, defined by its type (0 for large
triangles, 1 for the medium triangle, ...), a point defining the anchor position
and an orientation. Functions defined here are used for getting the points, segments
or the area of the tan.

Additionally, some functions based on multiple tans (but not necessarily a whole
tangram) and an outline are defined here:
* computation of the outline of multiple tans and all related functions like computation
 of all segments and points involved or finding the segment with maximum or minimum angle
 with respect to a given segment
* computation of the bounding box of multiple tans based on either points or outline
* containment test for a point within an outline (can also be a tan defined by its
points)
* computation of the area of an outline

#### `tangram.js`
Contains a wrapper class for a tangram defined by an array of individual tans.
Additionally, the tangram contains its outline and an evaluation object.
The file also includes functions for:
* computing the center of a tangram and centering the tangram in the drawing area
* creating SVG-elements for the outline and individual tans and attaching them to a
given element
* comparing tangrams according to their evaluation value

#### `evaluation.js`
Contains a wrapper class for all properties of a tangram, most of which are computed
based on the outline of a tangram. Additionally, a function for computing the
convex hull of a tangram can be found here, as it is only needed for the evaluation
properties. The function `getValue(mode)` (called on a `Evaluation` object of a
tangram) returns a value used for sorting, with modes 0 through 5 sorting according to
different properties. If another value is given, no sorting will be applied (as
all tangrams have an evaluation value of 0).

#### `generator.js`
Contains a function to generate a given number of tangrams which calls one of two
functions that will generate one tangram. This script is passed to a web worker,
created in the main script, and therefore runs independently of the remaining
code. This file thus contains some commands not present in other JavaScript
files (like `importScripts(...)`). Integrating the file in a HTML-document within
a `<script>`-tag will lead to an error. Apart from the functions to generate a given
number of tangrams, functions used within the generating process are found here.
This includes functions for determining an overlap between already placed tans and a new
tan as well as the computation, normalization and sampling for a probability
distribution. The parameters used during generation (maximum range and weight for
orientations where edges of the new tan are aligned) are set here as well.

#### `serverCommunication.js`
Contains two functions that create a JSON Object that is to be send to the server
(one for sending the choice of a tangram and one for sending statistics once a
 tangram has been solved) and functions for creating a `XMLHttpRequest` and actually
 sending the JSON Object to the Server. In the current state the server-address is set
 to an [OpenShift](https://www.openshift.com)-address, where the server-side part of
 this project is hosted.

#### `helpers.js`
Contains some helper functions that are continuously used throughout the whole
application
 * functions to convert angles from radians to degrees and back as well as clipping
 to the interval [0;360[ for angles given in degrees
 * functions to test two floating point numbers for equality (or inequality)
 * functions operating on arrays that shuffle a given array, eliminate all duplicates,
 determine if two arrays have the same content and count the number of unique elements

## Server

`server.js` defines the server-side part of this project, a web server receiving
JSON objects (by HTTP POST requests) and writing them to a database.
This part uses [Node.js](https://nodejs.org) and [MongoDb](https://www.mongodb.org),
which have to be installed if the server is run locally. The file is configured so
that is uses OpenShift values, if they are defined, but defaults to a `localhost`
environment if not. The database contains different collections defined for
saving game stats and choices within generator and evaluation (see below). Which
database a received JSON object is written into depends on the type within the
objects. The type is just used for this decision and subsequently deleted from
the object and therefore not saved.

`server.js` requires the `mongodb` module, which has to be added using
```javascript
npm install
```
if the server is to be tested locally. This will install the necessary dependencies
listed in `package.json`.

## Evaluation (Application)

#### `eval.html, evalstyle.css, evaluation.js`
These three files define an additional page used for collecting some data. The
structure of the page and content of the script are very similar to the page for
the generator. However, no game play is possible here. Instead the user is asked
to choose the most interesting tangram out of six for ten times and his/her choice
is then send to the server. For the first choice, the tangrams are always the
same (the ones defined as `interesting0`, `interesting1`, ... in `exampleTangrams.js`).
For the other 9 choices the tangrams are generated randomly. For the second, third,
fourth and fifth choice, the presented tangrams have certain properties (a
convex percentage larger than 0.6, contain a hole with an area smaller than 50,
contain a hanging piece and have a shortest edge with length smaller than 4), for
all choices, the tangrams are completely random.

## Evaluation (Data Extraction)

`getData.js` defines a locally running Node.js application that takes the data
collected with both the evaluation and the generated (contained in a local MongoDB
database) and computes the evaluation properties of the tangrams saved there, as
well as in same cases, a rank for each property and saves this information to
file. The rank specifies in which place the chosen tangram out of the six presented ones
would have ended up in if sorted according to that property. When analyzing the
data from the evaluation only the number of times a tangram has been chosen is
computed for the first choice. For all other choices, the rank is computed and the
tangram properties are added to a file containing all properties.
This requires for the database to be exported in Openshift/RockMongo and then to
be imported on the local machine by using
```javascript
load(file)
```
(where `file` is the filename of the exported `.js`-File) in a `mongo` shell environment,
as well as having both Node.js and MongoDB installed.






