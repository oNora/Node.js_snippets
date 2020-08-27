/*
 * Request Handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');


// Define all the handlers
const handlers = {};

// Users
handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        //405 - http code for method not allowed
        callback(405);
    }
};

// Container for all the users methods
handlers._users = {};

/**
 * Users - post
 * Required data: firstName, lastName, phone, password, tosAgreement
 * Optional data: none
 *
 * How to test it. Make a post request (postman) with following object:
 * {
 *  "firstName":"John",
 *  "lastName":"Smit",
 *  "phone":"5551234568",
 *  "password":"ThisIsAPassword",
 *  "tosAgreement":true
 *  }
 */
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        /**
         * Make sure the user doesn't already exist
         * the phone number MUST be unique in order to create a new user
         */
        _data.read('users', phone, (err, data) => {
            if (err) {
                // Hash the password - not storing it as plain text
                const hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    const userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };

                    // Store the user
                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {
                                'Error': 'Could not create the new user'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        'Error': 'Could not hash the user\'s password.'
                    });
                }

            } else {
                // User alread exists
                callback(400, {
                    'Error': 'A user with that phone number already exists'
                });
            }
        });

    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }

};


/**
 * Users - get
 * Required data: phone
 * Optional data: none
 *
 * How to test it. Make a get request with existing phone numbers:
 * localhost:3000/users?phone=5551234568
 *
 * @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
 */
handlers._users.get = (data, callback) => {

    // Check that phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Lookup the user
        _data.read('users', phone, (err, dataR) => {
            if (!err && dataR) {
                // Remove the hashed password from the user user object before returning it to the requester
                delete dataR.hashedPassword;
                callback(200, dataR);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        })
    }

};

/**
 * Users - put
 * Required data: phone
 * Optional data: firstName, lastName, password (at least one must be specified)
 *
 * How to test it. Make a put request (postman) with object similar to the following
 * with requeued field and at lest one optional whit updated data:
 * {
 *  "firstName":"John 2",
 *  "phone":"5551234568",
 *  }
 *
 * @TODO TODO Only let an authenticated user up their object. Dont let them access update elses.
 */
handlers._users.put = (data, callback) => {
    // Check for required field
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for optional fields
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Lookup the user
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update the fields if necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new updates
                    _data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {
                                'Error': 'Could not update the user.'
                            });
                        }
                    });
                } else {
                    callback(400, {
                        'Error': 'Specified user does not exist.'
                    });
                }
            });
        } else {
            callback(400, {
                'Error': 'Missing fields to update.'
            });
        }
    } else {
        callback(400, {
            'Error': 'Missing required field.'
        });
    }
};

/**
 * Users - delete
 * Required data: phone
 * @TODO Only let an authenticated user delete their object. Dont let them delete update elses.
 * @TODO Cleanup (delete) any other data files associated with the user
 */
handlers._users.delete = (data, callback) => {
    // Check that phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;

    if (phone) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                _data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            'Error': 'Could not delete the specified user'
                        });
                    }
                });
            } else {
                callback(400, {
                    'Error': 'Could not find the specified user.'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        })
    }
};

// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code and a payload object
    callback(406, {
        'name': 'sample handler'
    });
};


// Ping handler
handlers.ping = (data, callback) => callback(200);

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};


// Export the handlers
module.exports = handlers;