const lib = require("./lib.js");

const getVisitType = (visitTypeSynonym) => {
    switch (visitTypeSynonym) {
        case 'Hospitalisation':
            return 'IPD';
        case 'Consultation':
            return 'OPD';
        default:
            return '';
    }
};

const mapHepBValue = (synonym) => {
    switch (synonym) {
        case 'Positive':
            return 'Positif';
        case 'Negative':
            return 'Négatif';
        default:
            return '';
    }
};

const mapGlucoseValue = (synonym) => {
    switch (synonym) {
        case '0':
            return 'Négatif';
        case '1+':
            return '+';
        case '2+':
            return '++';
        case '3+':
            return '++';
        default:
            return '';
    }
};

const mapProteinValue = (synonym) => mapGlucoseValue(synonym);


const writeAsCSV = function (lines, destFileName) { //Need to make it generic
    const contents = lines.filter((line) => {
        return !!line["Sample Date"];
    }).map((line) => {
        const hepBValue = mapHepBValue(line['Hep B(Positive, Negative, Not specified)']);
        const glucoseValue = mapGlucoseValue(line['Glucose(urine)(0, 1+, 2+, 3+, Non spécifié)']);
        const proteinValue = mapProteinValue(line["Proteine(urine)(0, 1+, 2+, 3+, Non spécifié)"]);
        return [
            lib.getIdentifier(line["Patient ID"]), lib.getDate(line["Sample Date"]), getVisitType(line['Visit Type']),
            lib.getTestName("Hépatite B", hepBValue), hepBValue,
            lib.getTestName("GPT", line["GPT"]), line["GPT"],
            lib.getTestName("Creatinine", line["Creatinine"]), line["Creatinine"],
            lib.getTestName("Hemoglobine", line["Hemoglobine"]), line["Hemoglobine"],
            lib.getTestName("Glucose", glucoseValue), glucoseValue,
            lib.getTestName("LYM%", line["LYM%(sang)"]), line["LYM%(sang)"],
            lib.getTestName("CD4", line["CD4"]), line["CD4"],
            lib.getTestName("CD4 % (enfants de - 5 ans)", line["CD4 %"]), line["CD4 %"],
            lib.getTestName("Charge Virale HIV - Value", line["Viral Load"]), line["Viral Load"],
            lib.getTestName("Protéines", proteinValue), proteinValue
        ].join(",");
    });
    contents.unshift(["Registration Number", "Date", "Visit Type",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result",
        "Test", "Result"].join(","));

    return lib.writeToDestFile(contents.join("\r\n"), destFileName);
};

module.exports = (sourceFileName, destFileName) => {
    lib.convertCSVToJSON(sourceFileName).then(function (data) {
        writeAsCSV(data, lib.getDestFileName(sourceFileName, destFileName))
    });
};
