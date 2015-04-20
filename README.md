# Random Tangram Generator

Description of the program

# File contents

The following describes which files contain which functionality and which measures
have to be taken for running  (this applies

## Generator

### `index.html, style.css`
basic structure already there, but some element are hidden when entering the
site, filled during run of the application

### `script.js, loading.js`
Main Script

### `directions.js, exampleTangrams.js`
Pre-Computations

### `intadjoinsqrt2.js`

### `point.js`

### `lineSegment.js`

### `tan.js`

### `tangram.js`

### `evaluation.js`

### `generator.js`

### `serverCommunication.js`

### `helpers.js`
Contains some helper functions that are continuously used throughout the whole
application
 * `toRadians(degrees)` converts an angle from degrees to radians
 * `toDegrees(radians)` converts an angle from radians to degrees
 * `clipAngle(angle)` clips an angle given in degrees to the interval [0;360[
 * ``
 * ``
 * ``
 * ``
 * ``




## Server

If run locally, [Node.js](https://nodejs.org) and [MongoDb](https://www.mongodb.org)
have to be installed

```javascript
npm install
```

will install the necessary dependencies listen in `package.json`. Here, only `mongodb`
 will be installed.


## Evaluation (Application)

### `eval.html, evalstyle.css`

### `evaluation.js`

## Evaluation (Data Extraction)

takes like Server required Node.js and MongoDb to be installed
```javascript

```
