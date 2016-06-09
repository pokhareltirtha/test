
var fs = require('fs');
var downloadFile = require('./download-file');
var clean = require('./clean');
var utils = require('./utils');


var cityName = utils.getDir();
var cityDir = utils.getDir();



function getLinks(from,to){

    var baseUrl = "http://www.paginegialle.it/ricerca/restaurant/"+ cityName+ "/p-";

    var urlArr = [];

    for(var i=from; i<=to; i++){
        urlArr.push(baseUrl+i+"?mr=50");
    }

    return urlArr;

}
var baseUrl = "http://www.paginegialle.it/ricerca/restaurant/"+ cityName+ "/p-";

function  getLinkI(i){
    return (baseUrl+i+"?mr=50");
}

function containsFile(fileName,fileNames){

    return fileNames.indexOf(fileName) > -1;
}

function getFileName(item){
    var fileName = item.split("/");
    var fn = fileName[fileName.length-1].split("?")[0];

    return fn;
}

 function createDir (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

function downloadPage(link,fileName,fullFileName){
     var res = downloadFile(link,"restaurantList/"+cityDir+"/"+fileName);
            if(res.error){
                console.log("Error in downloading");
                throw res.error;
            }
            if(clean.shouldBeCleaned(fullFileName)){
                clean.cleanFile(fullFileName);
                console.log('ROBOT downloaded');

                    sleep(20000, function() {
     
                   console.log('download paused');

                    downloadPage(link,fileName,fullFileName)

                });


                // throw 'Robot is downloaded';
            }
}


var run = function(from,to){

    //array of links
    var links = getLinks(from,to);


    utils.createDir('./restaurantList/'+cityDir);

    var fileNames = fs.readdirSync('./restaurantList/'+cityDir);

    for(i=from; i<=to; i++){

        var link = getLinkI(i);
        var fileName = "p-" + i;
        var fullFileName = './restaurantList/'+cityDir+'/'+fileName;

        var contains = containsFile(fileName,fileNames);

        if(contains){
            if(clean.shouldBeCleaned(fullFileName)){
                clean.cleanFile(fullFileName);
                contains = false;
            }
        }

        if(contains == false){

            downloadPage(link,fileName,fullFileName);
           
        }else{
            console.log('file already downloaded');
        }
    }
    //
    //
    //links.forEach(function(item){
    //
    //    var fileName = getFileName(item);
    //    var contains = containsFile(fileName,fileNames);
    //
    //
    //    if(contains == false){
    //
    //        downloadFile(item,"pizzerie/"+cityDir+"/"+fileName);
    //
    //
    //        var fullFileName = './pizzerie/'+cityDir+'/'+fileName;
    //
    //
    //        if(clean.shouldBeCleaned(fullFileName)){
    //            clean.cleanFile(fullFileName);
    //
    //            console.log('ROBOT downloaded');
    //        }
    //
    //
    //    }else{
    //        console.log('file already downloaded');
    //    }
    //
    //});

}


var from = parseInt(process.argv[2]) || undefined;
var to = parseInt(process.argv[3]) || undefined;

run(from,to);