
var fs = require('fs');
var path = require('path');



function createDir (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

function getDir(){
    var cityDir = "Firenze";
    return cityDir;
}

function getFileName(link) {
    return require('crypto').createHash('sha1').update(JSON.stringify(link)).digest('hex')
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}



module.exports={
    createDir: createDir,
    getDir: getDir,
    getFileName: getFileName,
    getDirectories: getDirectories
}