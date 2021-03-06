/*
 * Request Handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');


// Define all the handlers
const handlers = {};

/*
 * HTML Handlers
 *
 */

// Index Handler
handlers.index = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'This is the title',
            'head.description': 'This is the meta description',
            'body.title': 'Hello templated world!',
            'body.class': 'index'
        };

        // Read in a template as a string
        helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });

    } else {
        callback(405, undefined, 'html');
    }
};

// Create Account
handlers.accountCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Signup is easy and only takes a few seconds.',
            'body.class': 'accountCreate'
        };

        // Read in a template as a string
        helpers.getTemplate('accountCreate', templateData, (err, str) => {
            if (!err && str) {

                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html');
            }
        });

    } else {
        callback(405, undefined, 'html');
    }
};

// Create New Session
handlers.sessionCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Login to your account.',
            'head.description': 'Please enter your phone number and password to access your account.',
            'body.class': 'sessionCreate'
        };

        // Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });

    } else {
        callback(405, undefined, 'html');
    }
};

// Session has been deleted
handlers.sessionDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Logged Out',
            'head.description': 'You have been logged out of your account.',
            'body.class': 'sessionDeleted'
        };
        // Read in a template as a string

        helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Edit Your Account
handlers.accountEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation

        const templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        };

        // Read in a template as a string
        helpers.getTemplate('accountEdit', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });

    } else {
        callback(405, undefined, 'html');
    }
};

// Account has been deleted
handlers.accountDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted.',
            'body.class': 'accountDeleted'
        };
        // Read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};


// Create a new check
handlers.checksCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Create a New Check',
            'body.class': 'checksCreate'
        };

        // Read in a template as a string
        helpers.getTemplate('checksCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Dashboard (view all checks)
handlers.checksList = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList'
        };
        // Read in a template as a string
        helpers.getTemplate('checksList', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Edit a Check
handlers.checksEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Check Details',
            'body.class': 'checksEdit'
        };

        // Read in a template as a string
        helpers.getTemplate('checksEdit', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });

    } else {
        callback(405, undefined, 'html');
    }
};


// Favicon
handlers.favicon = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Read in the favicon's data
        helpers.getStaticAsset('favicon.ico', (err, data) => {
            if (!err && data) {
                // Callback the data
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });

    } else {
        callback(405);
    }
};


// Public assets
handlers.public = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Get the filename being requested
        const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, (err, data) => {

                if (!err && data) {

                    // Determine the content type (default to plain text)
                    let contentType = 'plain';

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }

            });

        } else {
            callback(404);
        }

    } else {
        callback(405);
    }
};




/*
 * JSON API Handlers
 *
 */

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
 * How to test it? Make a post request (postman) with following object:
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
 * How to test it? Make a get request with existing phone numbers and add a token (must be created first) in a heder of the request:
 * localhost:3000/users?phone=5551234568
 *

 */
handlers._users.get = (data, callback) => {

    // Check that phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {

        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                // Lookup the user

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
                callback(403, {
                    "Error": "Missing required token in header, or token is invalid."
                })
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
 * How to test it? Make a put request (postman) with object similar to the following
 * with requeued field and at lest one optional whit updated data and add a token (must be created first) in a heder of the request :
 * {
 *  "firstName":"John 2",
 *  "phone":"5551234568",
 *  }
 *
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

            // Get token from headers
            const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

            // Verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
                if (tokenIsValid) {
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
                    callback(403, {
                        "Error": "Missing required token in header, or token is invalid."
                    })
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
 *
 * When make a DELETE request add a token (must be created first) in a heder of the request.
 *
 */
handlers._users.delete = (data, callback) => {
    // Check that phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;

    if (phone) {
        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                // Lookup the user
                _data.read('users', phone, (err, userData) => {
                    if (!err && data) {
                        _data.delete('users', phone, (err) => {

                            if (!err) {
                                // Delete each of the checks associated with the user
                                const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                const checksToDelete = userChecks.length;
                                if (checksToDelete > 0) {
                                    let checksDeleted = 0;
                                    let deletionErrors = false;

                                    // Loop through the checks
                                    userChecks.forEach(function (checkId) {

                                        // Delete the check
                                        _data.delete('checks', checkId, function (err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if (checksDeleted == checksToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        'Error': "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."
                                                    })
                                                }
                                            }

                                        });

                                    });

                                } else {
                                    callback(200);
                                }

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
                callback(403, {
                    "Error": "Missing required token in header, or token is invalid."
                })
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

// Tokens
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};


// Container for all the tokens methods
handlers._tokens = {};

/**
 * Tokens - post
 * Required data: phone, password
 * Optional data: none
 *
 * How to test it? Use date from existing user and make a post request (postman) with following object:
 * {
 *  "phone":"5551234568",
 *  "password":"ThisIsAPassword",
 *  }
 */
handlers._tokens.post = (data, callback) => {

    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {

        // Looku the user who marches that phone number
        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                // Hash the sent password and compared in to the password store in the user object
                const hashedPassword = helpers.hash(password);

                if (hashedPassword == userData.hashedPassword) {
                    // if valid, create a new token with  a random name. Set expiration date 1 hour in the future
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60;
                    const tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    }

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                'Error ': 'Could not create the new token'
                            });
                        }
                    });
                } else {
                    callback(400, {
                        'Error': 'Password didn\'t match the specified user\'s stored password'
                    });
                }

            }
        });

    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }

}

/**
 * Tokens - get
 * Required data: id
 * Optional data: none
 *
 * How to test it? Make a get request with existing token id:
 * localhost:3000/tokens?id=9gjjx4m0brso5vvliqtt
 *
 */
handlers._tokens.get = (data, callback) => {

    // Check that phone number is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Remove the hashed password from the tokes object before returning it to the requester
                delete tokenData.hashedPassword;
                callback(200, tokenData);
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
 * Tokens put
 *
 * Required data : id, extend
 * Optional data:  none
 *
 * How to test it? Creat a new token, make a PUT request with the data form that token.
 */
handlers._tokens.put = (data, callback) => {
    const id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    const extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    if (id && extend) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new updates
                    _data.update('tokens', id, tokenData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': 'Could not update the token\'s expiration.'
                            });
                        }
                    });
                } else {
                    callback(400, {
                        "Error": "The token has already expired, and cannot be extended."
                    });
                }
            } else {
                callback(400, {
                    'Error': 'Specified user does not exist.'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field(s) or fields(s) are invalid'
        })
    }
}


/**
 * Tokens delete
 * Required data : id
 * Optional data:  none
 *
 * How to test it? Make a DELETE request with an id of existing token.
 */
handlers._tokens.delete = (data, callback) => {
    // Check that id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Delete the token
                _data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            'Error': 'Could not delete the specified token'
                        });
                    }
                });
            } else {
                callback(400, {
                    'Error': 'Could not find the specified token.'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        })
    }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// Checks
handlers.checks = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the checks methods
handlers._checks = {};

/**
 * Checks - post
 *
 * Required data: protocol,url,method,successCodes,timeoutSeconds
 * Optional data: none
 *
 * How to test it?
 * First create a token for a user, then make a checks POST request with following object:
 *
 * {
 * "protocol" :"http",
 * "url": "google.com",
 * "method" : "get",
 * "successCodes" : [200, 201],
 * "timeoutSeconds" : 3
 * }
 */

handlers._checks.post = (data, callback) => {

    const protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {

        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Lookup the user phone by reading the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const userPhone = tokenData.phone;

                // Lookup the user data
                _data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // Verify that user has less than the number of max-checks per user
                        if (userChecks.length < config.maxChecks) {
                            // Create random id for check
                            const checkId = helpers.createRandomString(20);

                            // Create check object including userPhone
                            const checkObject = {
                                'id': checkId,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            };

                            // Save the object
                            _data.create('checks', checkId, checkObject, (err) => {
                                if (!err) {
                                    // Add check id to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    // Save the new user data
                                    _data.update('users', userPhone, userData, (err) => {
                                        if (!err) {
                                            // Return the data about the new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, {
                                                'Error': 'Could not update the user with the new check.'
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, {
                                        'Error': 'Could not create the new check'
                                    });
                                }
                            });



                        } else {
                            callback(400, {
                                'Error': 'The user already has the maximum number of checks (' + config.maxChecks + ').'
                            })
                        }


                    } else {
                        callback(403);
                    }
                });


            } else {
                callback(403);
            }
        });


    } else {
        callback(400, {
            'Error': 'Missing required inputs, or inputs are invalid'
        });
    }
}


/**
 * Checks - get
 * Required data: id
 * Optional data: none
 *
 * How to test?
 * Make sure that the you have created a token for the user already,
 * then make a checks GET request with check's id:
 * http://localhost:3000/checks?id=r583l6qsf06osmwmhgpf
 */
handlers._checks.get = (data, callback) => {
    // Check that id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the check
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // Get the token that sent the request
                const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

                // Verify that the given token is valid and belongs to the user who created the check
                handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        // Return check data
                        callback(200, checkData);
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field, or field invalid'
        })
    }
};




/**
 * Checks - put
 * Required data: id
 * Optional data: protocol,url,method,successCodes,timeoutSeconds (one must be sent)
 *
 * How to test it? Make first that you have a user with a valid token.
 * Make a checks PUT request with the following objects where id is the id of the checks:
 *
 * {
 * "id": "r583l6qsf06osmwmhgpf",
 * "protocol" :"https",
 * "url": "yahoo.com",
 * "method" : "put",
 * "successCodes" : [200, 201, 403],
 * "timeoutSeconds" : 2
 * }
 */
handlers._checks.put = (data, callback) => {
    // Check for required field
    const id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    // Check for optional fields
    const protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    // Error if id is invalid
    if (id) {
        // Error if nothing is sent to update
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // Lookup the check
            _data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    // Get the token that sent the request
                    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

                    // Verify that the given token is valid and belongs to the user who created the check
                    handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {

                            // Update check data where necessary
                            if (protocol) {
                                checkData.protocol = protocol;
                            }

                            if (url) {
                                checkData.url = url;
                            }

                            if (method) {
                                checkData.method = method;
                            }

                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }

                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            // Store the new updates
                            _data.update('checks', id, checkData, (err) => {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, {
                                        'Error': 'Could not update the check.'
                                    });
                                }
                            });
                        } else {
                            callback(403);
                        }
                    });
                } else {
                    callback(400, {
                        'Error': 'Check ID did not exist.'
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
 * Checks - delete
 * Required data: id
 * Optional data: none
 *
 * How to test id?
 * Make first that you have a user with a valid token.
 * Make a checks DELETE request where the id is the id of the check:
 * http://localhost:3000/checks?id=r583l6qsf06osmwmhgpf
 */
handlers._checks.delete = (data, callback) => {
    // Check that id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the check
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // Get the token that sent the request
                const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                // Verify that the given token is valid and belongs to the user who created the check
                handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {

                        // Delete the check data
                        _data.delete('checks', id, (err) => {
                            if (!err) {
                                // Lookup the user's object to get all their checks
                                _data.read('users', checkData.userPhone, (err, userData) => {
                                    if (!err) {
                                        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                                        // Remove the deleted check from their list of checks
                                        const checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            // Re-save the user's data
                                            userData.checks = userChecks;
                                            _data.update('users', checkData.userPhone, userData, (err) => {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        'Error': 'Could not update the user.'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                "Error": "Could not find the check on the user's object, so could not remove it."
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            "Error": "Could not find the user who created the check, so could not remove the check from the list of checks on their user object."
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    "Error": "Could not delete the check data."
                                })
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, {
                    "Error": "The check ID specified could not be found"
                });
            }
        });
    } else {
        callback(400, {
            "Error": "Missing valid id"
        });
    }
};


// Ping handler
handlers.ping = (data, callback) => callback(200);

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};


// Export the handlers
module.exports = handlers;