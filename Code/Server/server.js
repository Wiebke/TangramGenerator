/* Load the http module to create an http server */
var http = require('http');
/* Load the mongodb module to connect to database */
var MongoClient = require('mongodb').MongoClient;

/* Default to a 'localhost' configuration, but if OPENSHIFT env variables are
 present, use the available connection info: */
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var connection_string = '127.0.0.1:27017/tangen';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

var database;

/* Connect to the database */
MongoClient.connect('mongodb://' + connection_string, function (error, db) {
    if (error) throw error;
    console.log("Connected correctly to MongoDB");
    database = db;
    //db.close();
});

var insertDb = function (collectionName, jsonObject) {
    database.collection(collectionName).insert(jsonObject, {w: 1},
        function (error, records) {
            if (error) throw error;
        });
};

/* Configure our HTTP server to respond to CORS requests OPTIONS and POST */
var server = http.createServer(function (request, response) {
    // Set CORS headers: changed origin from * to actual url
    response.setHeader('Access-Control-Allow-Origin', 'http://www.wiebke-koepp.de');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    response.setHeader('Access-Control-Allow-Headers', 'X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin');
    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end()
    } else if (request.method === 'POST') {
        var jsonString = '';
        request.on('data', function (data) {
            jsonString += data;
            /* React to data larger than 1MB */
            if (jsonString.length > 1e6) {
                jsonString = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });
        request.on('end', function () {
            var jsonObject = JSON.parse(jsonString);
            if ('type' in jsonObject) {
                var type = jsonObject.type;
                /* Remove type from JSON */
                delete jsonObject.type;
                if (type === 0) {
                    insertDb('tangram-choices', jsonObject);
                    console.log("Choice inserted");
                } else if (type === 1) {
                    insertDb('tangram-statistics', jsonObject);
                    console.log("Game-Stats inserted");
                }
            }
        });
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Handled POST Request");
        console.log();
    } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Request type is not supported");
    }
});

// Listen on port 8080, IP defaults to 127.0.0.1
server.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", Port: " + server_port)
});