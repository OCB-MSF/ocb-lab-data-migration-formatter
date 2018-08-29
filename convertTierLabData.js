const lib = require("./lib.js");

const writeAsCSV = function (lines, destFileName) { //Need to make it generic
    const contents = lines.filter((line) => {
        return !!line["ResultDate"];
    }).map((line) => [
            line["First Name"],
            line["Last Name"],
            lib.getIdentifier(line["Patient ID"]),
            lib.getDate(line["ResultDate"]),
            "OPD",
            lib.getTestName("CD4", line["CD4"], ""),
            line["CD4"],
            lib.getTestName("Charge Virale HIV - Value", line["VL"], ""),
            line["VL"]
        ].join(",")
    );
    contents.unshift(["Patient.name", "Patient.Surname", "Registration Number", "Date", "Visit Type",
        "Test", "Result", "Test", "Result"].join(","));

    return lib.writeToDestFile(contents.join("\r\n"), destFileName);
};

module.exports = (sourceFileName, destFileName) => {
    lib.convertCSVToJSON(sourceFileName).then((data) => {
        writeAsCSV(data, lib.getDestFileName(sourceFileName, destFileName));
    });
};

