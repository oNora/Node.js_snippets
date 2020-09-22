// Dependencies
const server = require('./lib/server');

// Declare the app
const app = {};

// init function
app.init = () => {
    // start the server
    server.init();
}

// Execute
app.init();

// Export the app
module.exports = app;