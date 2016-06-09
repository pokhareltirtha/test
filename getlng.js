var cheerio = require('cheerio');
var fs = require('fs');
var utils = require('./utils');
var path = require('path');
var _ = require("lodash");
var async = require('async');





function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}


function createFile(json,dirName){
    fs.writeFileSync('./json2/'+dirName+"/"+utils.getFileName(json.title)+'.json', JSON.stringify(json, null, 4));
}

function scrapeData($,cb){

    var json ={};
    $('div.listElementsInnerWrapper div.vcard').each(function(i,elem) {


        var title = $(this).find($('[itemprop="name"]')).text().trim();
        // var desc = $(this).find($('[itemprop="description"]')).text().trim();
        // var addr = $(this).find($('[itemprop="address"]')).text().trim().replace(/\s\s+/g, ',').replace(/,(?=[^,]*$)/, ' ').replace(/,(?=[^,]*$)/, ' ');
        // var streetAddress = $(this).find($('[itemprop="streetAddress"]')).text().trim();
        // var postalCode = $(this).find($('[itemprop="postalCode"]')).text().trim();
        // var addressLocality = $(this).find($('[itemprop="addressLocality"]')).text().trim();
        // var addressRegion = $(this).find($('[itemprop="addressRegion"]')).text().trim();


        var lat = $(this).find($('[itemprop="latitude"]')).text().trim();
        
        json[title] = lat ; 
        // var lon = $(this).find($('[itemprop="longitude"]')).text().trim();
 
        // // var coords = {lat:parseFloat(lat) , lon : parseFloat((lon))};

        // //var latitude = $(this).find($('[itemprop="longitude"]')).text().trim();
        // //var longitude = $(this).find($('[itemprop="longitude"]')).text().trim)(;

        // var categories = [];
        // var catt = $(this).find($('.cat')).text().trim();
        // categories.push(catt);

        // var phone = [];
        // var phoneNum = $(this).find($('[itemprop="telephone"]')).text().trim().split(',');

        // for(var i=0; i<phoneNum.length;i++){
        //     phone.push(phoneNum[i].trim());
        // }


        // var rating = $(this).find($('.userVote')).children().first().text().replace( /^\D+/g, '');

        // json.name = title;
        // json.description = desc;
        // json.address = addr;
        // json.streetAddress = streetAddress;
        // json.postalCode = postalCode;
        // json.addressLocality = addressLocality;
        // json.addressRegion = addressRegion;
        // json.coordinates = coords;
        // json.categories = categories;
        // json.telephone = phone;
        // json.rating = rating;
        // //console.log(json);
        // json.barService = false;
        // json.restaurantService = false;
        // json.pizzerieService = true;

        // if(json.desc.toLowerCase().includes("bar") || json.title.toLowerCase().includes("bar") ){
        //     json.barService = true;

        //     json.categories.push("Bar");
        // }

        // // _.each(json.categories, function(item){
        // //     if(item == "Ristoranti"){
        // //         json.restaurantService = true;
        // //         json.categories.push("Ristoranti");
        // //     } 
        // // })

     
        // if(!json.addr){
        //     console.log('title: ' + json.title);
        //     console.log('addr : ' + json.addr);
        //     console.log('coords ' + json["coords"]["lat"]);
        //     console.log('file' + item);
        //     console.log('dir' + dirName);
        //     console.log('...............................................');
        // }


        // createFile(json,dirName);

    })

    cb(null,json);



    //fs.writeFileSync('./json/italy/'+json.restaurantName+'.json', JSON.stringify(json, null, 4));
}


function parseHtml(html,cb){
    var $ = cheerio.load(html);
    return scrapeData($,cb);

}

var directories = {
    download : getDirectories('./download'),
    pizzerie : getDirectories('./pizzerie')
}

var restNames = {};

async.forEachOf(directories,function(v,k,cb){
    async.forEachOf(v,function(dirName,ind,cb){

        var dirProcessing = './' + k + "/" + dirName;

        console.log('processing',dirProcessing);

        var fileNames = fs.readdirSync('./' + k + "/" + dirName);

        async.each(fileNames,function(item,cb){
            var fullFileName = "./" + k + "/" + dirName + "/" + item ; 

            fs.readFile(fullFileName,function(err,data){
                if(err){
                    return cb(err);
                }

                var fileContent = data.toString();

                parseHtml(fileContent,function(err,d){
                    if(err){
                        return cb(err);
                    }

                    _.assign(restNames,d);
                    cb();
                });
            })
        },function(e,d){
            if(e){
                return cb(e);
            }
            console.log('Processed ' , dirProcessing);
            cb();
        });
    },cb);
},function(e,d){
    console.log(e,restNames);
    fs.writeFileSync('./latlng.json',JSON.stringify(restNames));
})


process.on('exit',function(code){
    console.log('restNames',restNames);
    fs.writeFileSync('./latlng.json',JSON.stringify(restNames));
})



// var directoryNames = getDirectories('./download');
// console.log(directoryNames);
// directoryNames.forEach(function(dirName){

//     var fileNames = fs.readdirSync('./download/'+dirName);
//     utils.createDir('./download/'+dirName)

//         fileNames.forEach(function(item){

//         var fullFileName ="./download/"+dirName+"/"+ item;
//         var fileContent = fs.readFileSync(fullFileName).toString();
//         parseHtml(fileContent,item,dirName);
//         // console.log('writing json file for ' + item);

//     })
// });

