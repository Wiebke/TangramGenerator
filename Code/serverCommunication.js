/* Taken from http://www.html5rocks.com/en/tutorials/cors/ */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        /* Check if the XMLHttpRequest object has a "withCredentials" property.
         "withCredentials" only exists on XMLHTTPRequest2 objects. */
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        /* IE support for CORS */
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
    } else {
        /* Otherwise, CORS is not supported by the browser. */
        xhr = null;
    }
    return xhr;
}


/* Mostly taken from http://www.html5rocks.com/en/tutorials/cors/ */
var sendPost = function (jsonString) {
    /* Changed to Openshift server */
    var url = 'http://tangen-wiebke.rhcloud.com:80';
    //var url = 'http://localhost:8080';
    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
        console.log('CORS not supported');
        return;
    }
    /* Handle response */
    xhr.onload = function () {
        var text = xhr.responseText;
        console.log('Response from CORS request to ' + url + ': ' + text);
    };
    xhr.onerror = function () {
        console.log('Error occurred when contacting the server');
    };
    /* Send the JSON string */
    xhr.send(jsonString);
};

var sendChoice = function (user, choice, availableTangrams, choicesMade) {
    /* Send only tans to server */
    for (var index = 0; index < availableTangrams.length; index++) {
        availableTangrams[index] = availableTangrams[index].tans;
    }
    if (typeof choicesMade === 'undefined'){
        var data = {type: 0, user: user, eval:eval, choice: choice, tangrams: availableTangrams};
    } else {
        data = {type: 2, user: user, eval:eval, evalId: choicesMade, choice: choice, tangrams: availableTangrams};
    }
    sendPost(JSON.stringify(data));
};

var sendGame = function (user, minutes, seconds, hints, translations, rotations, tangram) {
    /* Send only tans to server */
    tangram = tangram.tans;
    var data = {
        type: 1, user: user, eval:eval, minutes: minutes, seconds: seconds, hints: hints,
        translations: translations, rotations: rotations, tangram: tangram
    };
    sendPost(JSON.stringify(data));
};