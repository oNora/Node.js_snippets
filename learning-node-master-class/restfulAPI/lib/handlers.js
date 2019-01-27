/*
 * Request Handlers
 *
 */

// Dependencies


// Define all the handlers
const handlers = {};


// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code and a payload object
    callback(406, { 'name': 'sample handler' });
};


// Ping handler
handlers.ping = (data, callback) => callback(200);

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};


// Export the handlers
module.exports = handlers;