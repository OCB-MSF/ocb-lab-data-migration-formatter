const path = require('path');
const csv = require('csvtojson');
const Promise = require('promise');
const writeFile = require('fs').writeFile;

const getDestFileName = (sourceFile, destFile) => {
    const extension = path.extname(sourceFile);
    return destFile || (path.basename(sourceFile, extension) + "_generated" + extension);
};

const convertCSVToJSON = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        csv().fromFile(csvFilePath)
            .on('json', (jsonObj) => {
                results.push(jsonObj)
            })
            .on('done', (error) => {
                if (error)
                    reject(error);
                else
                    resolve(results)
            });
    });
};

const writeToDestFile = (contents, fileName) => {
    return writeFile(fileName, contents, (err) => {
        if (err)
            throw err;
        console.info("File has been successfully converted.");
        console.info("The generated file can be found here: " + fileName);
    });
};

const getIdentifier = (identifier) => convertSlashID(identifier.replace(/^(CHK)|(CP)/, ""));

const convertSlashID = (identifier) => {
    const regex = new RegExp("^([0-9]{2})999/([0-9]+)$")
    if (regex.test(identifier)) {
        const res = regex.exec(identifier)
        return res[1] + (1000 + parseInt(res[2]))
    }
    return identifier
}

const getTestName = (testName, value, defaultTestName) => !!value ? testName : defaultTestName;

const getDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
};

module.exports = {getDestFileName, convertCSVToJSON, getDate, writeToDestFile, getTestName, getIdentifier};

