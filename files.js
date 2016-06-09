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
    fs.writeFileSync('./json2/'+dirName+"/"+utils.getFileName(json.name)+'.json', JSON.stringify(json, null, 4));
}

function scrapeData($,item,dirName){

    var json ={};
    $('div.listElementsInnerWrapper div.vcard').each(function(i,elem) {


        var name = $(this).find($('[itemprop="name"]')).text().trim();
        var description = $(this).find($('[itemprop="description"]')).text().trim();
        var address = $(this).find($('[itemprop="address"]')).text().trim().replace(/\s\s+/g, ',').replace(/,(?=[^,]*$)/, ' ').replace(/,(?=[^,]*$)/, ' ');
        var streetAddress = $(this).find($('[itemprop="streetAddress"]')).text().trim();
        var postalCode = $(this).find($('[itemprop="postalCode"]')).text().trim();
        var addressLocality = $(this).find($('[itemprop="addressLocality"]')).text().trim();
        var addressRegion = $(this).find($('[itemprop="addressRegion"]')).text().trim();


        var lat = $(this).find($('[itemprop="latitude"]')).text().trim();
        var lon = $(this).find($('[itemprop="longitude"]')).text().trim();
 
        var coordinates = {lat:parseFloat(lat) , lon : parseFloat((lon))};

        //var latitude = $(this).find($('[itemprop="longitude"]')).text().trim();
        //var longitude = $(this).find($('[itemprop="longitude"]')).text().trim();

        var categories = [];
        var catt = $(this).find($('.cat')).text().trim();
        categories.push(catt);

        var telephone = [];
        var phoneNum = $(this).find($('[itemprop="telephone"]')).text().trim().split(',');

        for(var i=0; i<phoneNum.length;i++){
            telephone.push(phoneNum[i].trim());
        }


        var rating = $(this).find($('.userVote')).children().first().text().replace( /^\D+/g, '');

        json.name = name;
        json.description = description;
        json.address = address;
        json.streetAddress = streetAddress;
        json.postalCode = postalCode;
        json.addressLocality = addressLocality;
        json.addressRegion = addressRegion;
        json.coordinates = coordinates;
        json.categories = categories;
        json.telephone = telephone;
        json.rating = rating;
        //console.log(json);
        //json.barService = false;
        //json.restaurantService = false;
        //json.pizzerieService = true;

        //if(json.desc.toLowerCase().includes("bar") || json.title.toLowerCase().includes("bar") ){
        //    json.barService = true;
        //
        //    json.categories.push("Bar");
        //}

        // _.each(json.categories, function(item){
        //     if(item == "Ristoranti"){
        //         json.restaurantService = true;
        //         json.categories.push("Ristoranti");
        //     } 
        // })

     
        if(!json.address){
           console.log('title: ' + json.name);
           console.log('addr : ' + json.address);
           console.log('file' + item);
           console.log('dir' + dirName);
           console.log('...............................................');
        }


         // createFile(json,dirName);

    })



    //fs.writeFileSync('./json/italy/'+json.restaurantName+'.json', JSON.stringify(json, null, 4));
}


function parseHtml(html,item,dirName){
    var $ = cheerio.load(html);
    return scrapeData($,item,dirName);

}

var directoryNames = getDirectories('./Firenze2');

//console.log(directoryNames);

directoryNames.forEach(function(dirName){

    var fileNames = fs.readdirSync('./Firenze2/'+dirName);

    utils.createDir('./json2/'+dirName)
    console.log(dirName);

        fileNames.forEach(function(item){

        var fullFileName ="./Firenze2/"+dirName+"/"+ item;
        var fileContent = fs.readFileSync(fullFileName).toString();

        parseHtml(fileContent,item,dirName);
         // console.log('writing json file for ' + item);

    })
});

