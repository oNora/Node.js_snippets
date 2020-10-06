/*
 * Request Handlers
 *
 */

// Dependencies
const config = require('./config');
const _data = require('./data');
const helpers = require('./helpers');


// Define all the handlers
const handlers = {};

// test handler
handlers.test = (data, callback) => {
    // Callback a http status code and a payload object
    callback(406, {
        'name': 'test handler'
    });
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};


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
 * How to test it?
 * Make a post request (postman) with following object:
 * {
 *  "firstName":"John",
 *  "lastName":"Smit",
 *  "phone":"5551234568",
 *  "email": "test@mail.com",
 *  "password":"ThisIsAPassword",
 *  "address" : "24A Some str., Sofia",
 *  "tosAgreement":true
 *  }
 */
handlers._users.post = (data, callback) => {

    // Check that all required fields are filled out
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().includes('@', '.') ? data.payload.email.trim() : false;
    const address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    const tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && email && address && tosAgreement) {
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
                        'email': email,
                        'address': address,
                        'hashedPassword': hashedPassword,
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
                // User already exists
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
    const email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().includes('@', '.') ? data.payload.email.trim() : false;
    const address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    // Error if phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password || email || address) {

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
                            if (email) {
                                userData.email = email;
                            }
                            if (address) {
                                userData.address = address;
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
        // const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                _data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        _data.delete('users', phone, (err) => {
                            if (!err) {
                                callback(200, {
                                    'Success': 'The user has been deleted successfully'
                                });
                            } else {
                                callback(500, {
                                    'Error': 'Could not delete the selected user.'
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            'Error': 'Could not find the selected customer.'
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

/**
 * Tokens - post
 * Required data: phone, password
 * Optional data: none
 *
 * How to test it?
 * Use date from existing user and make a post request (postman) with following object:
 * {
 *  "phone":"5551234568",
 *  "password":"ThisIsAPassword",
 *  }
 */
handlers._tokens.post = (data, callback) => {

    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {

        // Lookup the user who marches that phone number
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
 * How to test it?
 * Creat a new token, make a PUT with an id from the created token:
 * {
 * "id": "palleeb7tohvptnl611r",
 * "extend": true
 * }
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
 * How to test it?
 * Make a DELETE request with an id of existing token.
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


// menu
handlers.menu = (data, callback) => {
    let goodMethods = ['get'];
    if (goodMethods.indexOf(data.method) > -1) {
        handlers._menu[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the menu methods
handlers._menu = {};


/**
 * Menus - get
 * Required data: user's phone
 * Optional data: none
 *
 * How to test it?
 * Create an user and token fot this user. Make a GET request whit user's phone as param and the token in the headers
 */
handlers._menu.get = (data, callback) => {

    // Check that phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {

        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                // Lookup the menu
                _data.read('menuItems', 'menu', (err, dataMenu) => {
                    if (!err && dataMenu) {
                        console.log("dataMenu", dataMenu);
                        callback(200, dataMenu);
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

// shopping card
handlers.shoppingCard = (data, callback) => {
    let goodMethods = ['post', 'get', 'put', 'delete'];
    if (goodMethods.indexOf(data.method) > -1) {
        handlers._shoppingCard[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the shopping card methods
handlers._shoppingCard = {};

/**
 * Shopping Card - post
 * Required data: user's phone and at least one menu item
 * Optional data: none
 *
 * How to test it?
 * Create a POST request with the following params and at least one menu item:
 * {
 *  "userPhone": "palleeb7tohvptnl611r",
 *   "menuItems": [
 *        {
 *            "id": 3,
 *            "itemName": "Vegan",
 *            "quantity" : 2,
 *            "singlePrice": 12.99
 *        }
 *    ]}
 */
handlers._shoppingCard.post = (data, callback) => {
    // console.log('data paylod: ', data.payload);
    const phone = typeof (data.payload.userPhone) == 'string' && data.payload.userPhone.trim().length == 10 ? data.payload.userPhone.trim() : false;
    const menuItems = data.payload.menuItems.constructor === Array && data.payload.menuItems.length > 0 ? data.payload.menuItems : false;

    if (phone && menuItems) {

        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                const cartData = {}

                // Lookup the user
                _data.read('users', phone, (err, dataUser) => {
                    if (!err && dataUser) {

                        const orderId = helpers.createRandomString(10);
                        cartData.orderId = orderId;
                        cartData.userPhone = phone;
                        cartData.userEmail = dataUser.email;

                        let orderTotalPrice = 0;
                        for (let i = 0; i < menuItems.length; i++) {
                            menuItems[i].totalItemPrice = menuItems[i].quantity * menuItems[i].singlePrice;
                            orderTotalPrice += menuItems[i].totalItemPrice;
                        }

                        cartData.menuItems = menuItems;
                        cartData.orderTotalPrice = orderTotalPrice;

                        // Store the order
                        _data.create('orders', orderId, cartData, (err) => {
                            if (!err) {
                                callback(200, cartData);
                            } else {
                                console.log(err);
                                callback(500, {
                                    'Error': 'Could not create the new user'
                                });
                            }
                        });


                    } else {
                        callback(404);
                    }
                });



            } else {
                callback(400, {
                    'Error': 'Missing required token in the headers, or the token is invalid.'
                });
            }
        });

    } else {
        callback(400, {
            'Error': 'Missing required field'
        })
    }
}

/**
 * Shopping Card - get
 * Required data: phone
 * Optional data: none
 *
 * How to test it? Make a get request with existing order numbers & user phone and add a token (must be created first) in a heder of the request:
 * localhost:3000/shoppingCard?orderId=3b25804f9o&phone=5551234568
 *
 */
handlers._shoppingCard.get = (data, callback) => {

    // Check that phone number and order id are valid
    const orderId = typeof (data.queryStringObject.orderId) == 'string' && data.queryStringObject.orderId.trim().length == 10 ? data.queryStringObject.orderId.trim() : false;
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;

    if (orderId && phone) {

        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                // Lookup the order
                _data.read('orders', orderId, (err, dataOrder) => {
                    if (!err && dataOrder) {
                        callback(200, dataOrder);
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
 * Shopping Card - put
 * Required data: phone, orderId, menuItems
 * Optional data: firstName, lastName, password (at least one must be specified)
 *
 * How to test it?
 * Create a PUT request with the following params and at least one menu item and add a token (must be created first) in a heder of the request:
 * {
 *  "phone": "8q14kyby83",
 *   "menuItems": [
 *        {
 *            "id": 3,
 *            "itemName": "Vegan",
 *            "quantity" : 2,
 *            "singlePrice": 12.99
 *        }
 *    ]}
 *
 */
handlers._shoppingCard.put = (data, callback) => {

    const phone = typeof (data.payload.userPhone) == 'string' && data.payload.userPhone.trim().length == 10 ? data.payload.userPhone.trim() : false;
    const orderId = typeof (data.payload.orderId) == 'string' && data.payload.orderId.trim().length == 10 ? data.payload.orderId.trim() : false;
    const menuItems = data.payload.menuItems.constructor === Array && data.payload.menuItems.length > 0 ? data.payload.menuItems : false;

    if (phone && menuItems && orderId) {

        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                const cartData = {}

                // Lookup the user
                _data.read('users', phone, (err, dataUser) => {
                    if (!err && dataUser) {

                        cartData.userPhone = phone;
                        cartData.userEmail = dataUser.email;

                        let orderTotalPrice = 0;
                        for (let i = 0; i < menuItems.length; i++) {
                            menuItems[i].totalItemPrice = menuItems[i].quantity * menuItems[i].singlePrice;
                            orderTotalPrice += menuItems[i].totalItemPrice;
                        }

                        cartData.menuItems = menuItems;
                        cartData.orderTotalPrice = orderTotalPrice;

                        // Update the order
                        _data.update('orders', orderId, cartData, (err) => {
                            console.log('err: ', err);
                            if (!err) {
                                callback(200, cartData);
                            } else {
                                console.log(err);
                                callback(500, {
                                    'Error': 'Could not UPDATE the order'
                                });
                            }
                        });


                    } else {
                        callback(404);
                    }
                });



            } else {
                callback(400, {
                    'Error': 'Missing required token in the headers, or the token is invalid.'
                });
            }
        });

    } else {
        callback(400, {
            'Error': 'Missing required field'
        })
    }
};

/**
 * Shopping Card delete
 * Required data : orderId, userPhone
 * Optional data:  none
 *
 * How to test it?
 * Make a DELETE request with an id of existing order id and user phone.
 */
handlers._shoppingCard.delete = (data, callback) => {

    // Check that phone number and order id are valid
    const orderId = typeof (data.queryStringObject.orderId) == 'string' && data.queryStringObject.orderId.trim().length == 10 ? data.queryStringObject.orderId.trim() : false;
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;

    if (phone && orderId) {
        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {

                _data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        _data.delete('orders', orderId, (err) => {
                            if (!err) {
                                callback(200, {
                                    'Success': 'The order has been deleted successfully'
                                });
                            } else {
                                callback(500, {
                                    'Error': 'Could not delete the selected order.'
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            'Error': 'Could not find the selected customer.'
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

// payment.
handlers.payment = (data, callback) => {
    let goodMethods = ['post'];
    if (goodMethods.indexOf(data.method) > -1) {
        handlers._payment[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the payment methods
handlers._payment = {};


/**
 * payment post
 * Required data : orderId, userPhone, cardNumber, cardExpiryDate, cardHolder, cardCVVCode
 * Optional data:  none
 *
 * How it si work?
 * Make a POST request with following data and make sure have a valid token:
 *
 * {
 * "orderId":"8q14kyby83",
 * "userPhone": "5551234568",
 * "cardNumber": "4242424242424242",
 * "cardExpiryDate": "07.07.2022",
 * "cardHolder": "John Smit",
 * "cardCVVCode": "545"
 * }
 */

handlers._payment.post = (data, callback) => {

    // Check that phone number and order id are valid
    const orderId = typeof data.payload.orderId == 'string' && data.payload.orderId.trim().length == 10 ? data.payload.orderId.trim() : false;
    const userPhone = typeof data.payload.userPhone == 'string' && data.payload.userPhone.trim().length == 10 ? data.payload.userPhone.trim() : false;
    // payment information
    const cardNumber = typeof data.payload.cardNumber == 'string' && data.payload.cardNumber.trim().length === 16 ? data.payload.cardNumber.trim() : false;
    const cardExpiryDate = typeof data.payload.cardExpiryDate == 'string' && data.payload.cardExpiryDate.trim().length > 0 ? data.payload.cardExpiryDate.trim() : false;
    const cardHolder = typeof data.payload.cardHolder == 'string' && data.payload.cardHolder.trim().length > 0 ? data.payload.cardHolder.trim() : false;
    const cardCVVCode = typeof data.payload.cardCVVCode == 'string' && data.payload.cardCVVCode.trim().length === 3 ? data.payload.cardCVVCode.trim() : false;

    if (userPhone && orderId && cardNumber && cardExpiryDate && cardHolder && cardCVVCode) {
        // Get token from headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('orders', orderId, (err, orderData) => {

                    if (!err && orderData) {
                        let orderInfo = {
                            id: orderId,
                            userEmail: orderData.userEmail,
                            totalAmount: orderData.totalAmount
                        };

                        helpers.proceedPayment(orderData.orderTotalPrice, (err) => {
                            if (!err) {

                                helpers.sendEmail(orderData.userEmail, orderData.orderTotalPrice, (err) => {

                                    if (err) {
                                        orderInfo = {
                                            Message: 'Order completed successfully but couldn\'t send confirmation email'
                                        };
                                    } else {
                                        orderInfo = {
                                            Message: 'Order completed successfully! Thank you for your order!'
                                        };
                                    }

                                    callback(200, orderInfo);
                                });

                            } else {
                                callback(400, {
                                    Error: "Could not proceed payment"
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            Error: 'Could not get shopping cart'
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

// Export the handlers
module.exports = handlers;