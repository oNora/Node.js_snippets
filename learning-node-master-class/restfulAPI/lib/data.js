/*
 * Library for storing and editing data
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {

    // Open the file for writing
    //'wx' - rights to write on file. This throws error if file already exist
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {

        if (!err && fileDescriptor) {

            // Convert data to string
            const stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });

        } else {
            callback('Could not create new file, it may already exist');
        }

    });
};

// Read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err && data) {
            const parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

// Update data in a file
lib.update = (dir, file, data, callback) => {

    // Open the file for writing
    //'r+' - rights to write on file. This throws error if file doesn't exist yet
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Truncate the file - remove existing data in the file and write only the new one
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write to file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing existing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open file for updating, it may not exist yet');
        }
    });

};

lib.delete = (dir, file, callback) => {

    // Open the file for writing
    // unlink - removing file of this file system
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err, fileDescriptor) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file', err);
        }
    });

};

// List all the items in a directory
lib.list = (dir, callback) => {
    fs.readdir(lib.baseDir + dir + '/', (err, data) => {
        if (!err && data && data.length > 0) {
            const trimmedFileNames = [];
            data.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }
    });
};

// Export the module
module.exports = lib;