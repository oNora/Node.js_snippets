/*
 * Helpers for various tasks
 *
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof (str) == 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = (stringLength) => {
    stringLength = typeof (stringLength) == 'number' && stringLength > 0 ? stringLength : false;
    if (stringLength) {
        // Define all the possible characters that could go into a string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        let str = '';
        for (i = 1; i <= stringLength; i++) {
            // Get a random characters from the possibleCharacters string
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the string
            str += randomCharacter;
        }
        // Return the final string
        return str;
    } else {
        return false;
    }
}


// Payment with stripe
helpers.proceedPayment = (total, callback) => {

    const postData = querystring.stringify({
        source: 'tok_visa',
        amount: total * 100,
        currency: 'usd'
    });

    const postDetails = {
        host: 'api.stripe.com',
        protocol: 'https:',
        path: '/v1/charges',
        method: 'POST',
        auth: config.stripe.apiKey
    };

    const req = https.request(postDetails, function (res) {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', () => {
            body = JSON.parse(body);
            // Check if the payment was successful
            if (!body.error) {
                callback(false);
            } else {
                callback(`Could not make payment. ${body.error}`);
            }
        });
    });

    req.write(postData);
    req.end();

};

helpers.sendEmail = (email, totalPrice, callback) => {
    const emailMessage = `
        Your order was successfully proceeded.
        -----------------------------------------
        Total payed: ${totalPrice} $
    `;

    const requestBody = querystring.stringify({
        from: 'Pizza store pizza@pizza.com',
        to: email,
        subject: 'Order Confirmation',
        text: emailMessage,
    });

    const options = {
        method: 'POST',
        protocol: 'https:',
        host: 'api.mailgun.net',
        path: `/v3/${config.mailgun.accountId}.mailgun.org/messages`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from('api:' + config.mailgun.apiKey).toString('base64')}`,
        },
        payload: requestBody
    };

    // Set up the request
    var req = https.request(options, function (res) {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', () => {
            body = JSON.parse(body);
            // Check if email was sent successfully
            if (body.id) {
                callback(false);
            } else {
                callback(`Could not send email. ${body.message}`);
            }
        });
    });
    // post the data
    req.write(requestBody);
    req.end();
};


/**
 *
 *  template related methods
 *
 */

// Get the string content of a template
helpers.getTemplate = (templateName, data, callback) => {
    templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) == 'object' && data !== null ? data : {};

    if (templateName) {
        var templatesDir = path.join(__dirname, '/../templates/');
        fs.readFile(templatesDir + templateName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length > 0) {
                const finalString = helpers.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        });
    } else {
        callback('A valid template name was not specified');
    }
}

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};

    // Get the header
    helpers.getTemplate('_header', data, (err, headerString) => {
        if (!err && headerString) {

            // Get the footer
            helpers.getTemplate('_footer', data, (err, footerString) => {
                if (!err && headerString) {
                    // Add them all together
                    const fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the footer template');
                }
            });

        } else {
            callback('Could not find the header template');
        }

    });
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = (str, data) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with "global."
    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName]
        }
    }
    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key] == 'string')) {
            const replace = data[key];
            const find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }
    return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {

    fileName = typeof (fileName) == 'string' && fileName.length > 0 ? fileName : false;

    if (fileName) {

        let publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir + fileName, (err, data) => {
            if (!err && data) {
                callback(false, data);
            } else {
                callback('No file could be found');
            }
        });

    } else {
        callback('A valid file name was not specified');
    }
};

// Export the module
module.exports = helpers;