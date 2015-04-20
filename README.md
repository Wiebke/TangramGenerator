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
action as well as solution and hints if the user clicks the respective button
* functions to start and stop the watch


`loading.js` contains the functions to create and update (fill
 according to progress) the loading screen

#### `directions.js, exampleTangrams.js`
Contains
ThePre-Computations
The examples have been used in the beginning stages

#### `intadjoinsqrt2.js`

#### `point.js`

#### `lineSegment.js`

#### `tan.js`

#### `tangram.js`

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
functions that will generate one tangram. This script is the one passed to the
Web Worker in the main script and therefore runs independently of the remaining
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
 to an [Openshift](https://www.openshift.com)-address, where the server-side part of
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

If run locally, [Node.js](https://nodejs.org) and [MongoDb](https://www.mongodb.org)
have to be installed

```javascript
npm install
```

will install the necessary dependencies listen in `package.json`. Here, only `mongodb`
 will be installed.


## Evaluation (Application)

#### `eval.html, evalstyle.css`

#### `evaluation.js`

## Evaluation (Data Extraction)

takes like Server required Node.js and MongoDb to be installed
```javascript

```
