// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all request with a string
const server = http.createServer(function (req, res) {

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

        // Send the response
        res.end('Hello World!\n');

        // Log the request/response
        // console.log(`Request received on path: ${trimmedPath}  with method: ${method} and with these query string param: `, queryStringObject);
        // console.log(`Request received with these headers`, headers);
        console.log('Request received with this payload: ', buffer);
    });


});

// Start the server
server.listen(3000, function () {
    console.log('The server is up and running now');
});