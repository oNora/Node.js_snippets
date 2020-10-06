/*
 * Helpers for various tasks
 *
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

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

// Send an email
helpers.sendEmail = () => {

    // Validate parameters

    // TODO: put the logic here
    // if () {

    // } else {
    //     callback('Given parameters were missing or invalid');
    // }
};

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


// Export the module
module.exports = helpers;