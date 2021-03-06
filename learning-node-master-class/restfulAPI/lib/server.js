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
// will use it to see in console messages only from here when start the app with this command:
// NODE_DEBUG=server node index.js
// NB!!! for windows use this: SET NODE_DEBUG=server&&node index.js
const debug = util.debuglog('server');


// use this only for quick test sending sms
// helpers.sendTwilioSms('4158375309', 'HAllo', (err) => {
//     console.log('this was the error', err);
// });


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
        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory use to the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specifies in the router
        chosenHandler(data, (statusCode, payload, contentType) => {

            // Determine the type of response (fallback to JSON)
            contentType = typeof (contentType) == 'string' ? contentType : 'json';

            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Return the response parts that are content-type specific
            let payloadString = '';
            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json');
                payload = typeof (payload) == 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }

            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof (payload) == 'string' ? payload : '';
            }

            if(contentType == 'favicon'){
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'plain'){
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'png'){
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'jpg'){
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            // Return the response-parts common to all content-types
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green, otherwise print red
            if (statusCode == 200) {
                debug('\x1b[32m%s\x1b[0m', `Returning this response with method:${method.toUpperCase()}  trimmedPath: /${trimmedPath} statusCode:${statusCode} `);
            } else {
                debug('\x1b[31m%s\x1b[0m', `Returning this response with method:${method.toUpperCase()}  trimmedPath: /${trimmedPath} statusCode:${statusCode} `);
            }

        });

        // NB! all this comments are not needed here when we have routing
        // Send the response
        // res.end('Hello World!\n');
        // Log the request/response
        // console.log(`Request received on path: ${trimmedPath}  with method: ${method} and with these query string param: `, queryStringObject);
        // console.log(`Request received with these headers`, headers);
        // console.log('Request received with this payload: ', buffer);
    });
}

// Define the request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all': handlers.checksList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'sample': handlers.sample,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico': handlers.favicon,
    'public': handlers.public
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