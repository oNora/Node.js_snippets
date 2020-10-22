/*
 * Create and export configuration variables
 *
 * set env on windows CMD:
 * ------------------------
 * set NODE_ENV=staging
 * and the run node index.js
 *
 * set env on linux based terminal :
 * ------------------------
 * NODE_ENV=staging node index.js
 */

// Container for all environments
const environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3003,
    'httpsPort': 3004,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'stripe': {
        'apiKey': '',
    },
    'mailgun': {
        'accountId': 'sandbox5a7d08475c1b4c0b80007da21b5e67a7',
        'apiKey': ''
    },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'NotARealCompany, Inc.',
        'yearCreated': '2018',
        'baseUrl': 'http://localhost:3003/'
    }
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsAlsoASecret',
    'stripe': {
        'apiKey': '',
    },
    'mailgun': {
        'accountId': 'sandbox5a7d08475c1b4c0b80007da21b5e67a7',
        'apiKey': ''
    },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'NotARealCompany, Inc.',
        'yearCreated': '2018',
        'baseUrl': 'http://localhost:5000/'
    }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


// Export the module
module.exports = environmentToExport;