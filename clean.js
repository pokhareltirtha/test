var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');


function shouldBeCleanedText(fileContent){
    var clean;

    if (!fileContent.trim()) {
        clean = true;
    } else {
        var $ = cheerio.load(fileContent);
        clean = $('meta[name="ROBOTS"]').attr("content");
    }
    return clean;

}


function shouldBeCleaned(fileName) {
    // console.log('fileName',fileName);
    var fileContent = fs.readFileSync(fileName).toString();
    return shouldBeCleanedText(fileContent);
}

function cleanFile(fileName) {

    var sbc = shouldBeCleaned(fileName);
    if (sbc) {
        fs.unlinkSync(fileName);
    }
}

module.exports = {


    shouldBeCleaned : shouldBeCleaned,
    shouldBeCleanedText : shouldBeCleanedText,
    cleanFile: cleanFile

}
