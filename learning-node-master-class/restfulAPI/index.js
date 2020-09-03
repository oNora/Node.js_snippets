// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// Initiate the Http server
// The server should respond to all request with a string
const serverHttp = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start the server
serverHttp.listen(config.httpPort, () => {
    console.log(`The HTTP server is up and running now on port ${config.httpPort} in ${config.envName} mode`);
});

const ServerHttpSOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

// Initiate the HttpS server
// The server should respond to all request with a string
const serverHttpS = https.createServer(ServerHttpSOptions, (req, res) => {
    unifiedServer(req, res);
});

// Start the server
serverHttpS.listen(config.httpsPort, () => {
    console.log(`The HTTPS server is up and running now on port ${config.httpsPort} in ${config.envName} mode`);
});

// All the server logic for both the http and https server
const unifiedServer = function (req, res) {
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
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

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
            console.log("Returning this response: ", statusCode, payloadString);

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
const router = {
    'sample': handlers.sample,
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks,
};