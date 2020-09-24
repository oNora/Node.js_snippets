/**
 * Server related tasks
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
// NB!!! for windows use this: SET NODE_DEBUG=server&&node index.js
const debug = util.debuglog('server');

// Instantiate the server module object
var server = {};

// Initiate the Http server
// The server should respond to all request with a string
server.serverHttp = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});


server.ServerHttpSOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

// Initiate the HttpS server
// The server should respond to all request with a string
server.serverHttpS = https.createServer(server.ServerHttpSOptions, (req, res) => {
    unifiedServer(req, res);
});


// All the server logic for both the http and https server
server.unifiedServer = function (req, res) {
    // Get the URL and parse it as an object with all date related to the URL
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method
    const method = req.method.toLowerCase();

    //Get the headers as an object
    const headers = req.headers;

    // Get the payload,if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handles this request should got to.  If one is not found, use the notFound handler.
        const chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specifies in the router
        chosenHandler(data, (statusCode, payload) => {

            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green, otherwise print red
            if (statusCode == 200) {
                debug('\x1b[32m%s\x1b[0m', `Returning this response with method:${method.toUpperCase()}  trimmedPath: /${trimmedPath} statusCode:${statusCode} `);
            } else {
                debug('\x1b[31m%s\x1b[0m', `Returning this response with method:${method.toUpperCase()}  trimmedPath: /${trimmedPath} statusCode:${statusCode} `);
            }

        });

    });
}

// Define the request router
server.router = {
    'test': handlers.test,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'menu': handlers.menu,
};

server.init = () => {

    // Start the HTTP server
    server.serverHttp.listen(config.httpPort, () => {
        console.log('\x1b[36m%s\x1b[0m', `The HTTP server is up and running now on port ${config.httpPort} in ${config.envName} mode`);
    });

    // Start the HTTPS server
    server.serverHttpS.listen(config.httpsPort, () => {
        console.log('\x1b[35m%s\x1b[0m', `The HTTPS server is up and running now on port ${config.httpsPort} in ${config.envName} mode`);
    });

}

// Export the module
module.exports = server;