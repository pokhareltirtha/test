var mongoose = require('mongoose');
var path = require('path')
var deasync = require('deasync');
var fs = require('fs');
var utils = require('./utils');
var _ = require('lodash');



function printData(res,jsonNew){
    // console.log('in writing');
    console.log('>>>>>>>>>>>' + res.length)

    var i = 0;

    if(res.length > 0){
        _.each(res,function(item){
            i++;
            console.log(i + ' ' + item.name);

            // console.log('res item------------------------' + item.name)

            fs.writeFileSync('./jsonfinal/'+i+'.json', JSON.stringify(item, null, 4));
        })
    }

    if(jsonNew.length > 0){
        _.each(jsonNew,function(item){
            i++;
            console.log('>>>>>>>>>>>' + jsonNew.length);
            // console.log('writing jsonNew');
             // console.log('jsonNew item----------------------' + item.address)
            fs.writeFileSync('./jsonfinal/'+i+'.json', JSON.stringify(item, null, 4));
        })
    }

}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return a.indexOf(i) < 0;});
};


function jsonData(res,piz) {

   
    console.log('..............................');
  

    // console.log('in json data');
    var jsonNew = [];

    _.each(piz, function (value) {
        
        // console.log('looping');
        //console.log('title' + value.title);
        var obj = _.findIndex(res, {name: value.name});




        if (obj > -1) {

            // console.log('WIITH SAMEE TITLEEE');

            var newValue = value.categories.diff(res[obj].categories);
           
           res[obj].categories = res[obj].categories.concat(newValue);

           
        } else {
            // console.log('with diff title');

            jsonNew.push(value);
        }
    })

    // console.log('now printing data');

    console.log('.......res'+ res.length);
    console.log('.......jsonNew'+ jsonNew.length);

    console.log(res.length);
    console.log('*********');
     console.log(jsonNew.length);

    printData(res,jsonNew);

}

function restaurant() {

    var directoryNames = utils.getDirectories('./json');

    var restaurantArray = [];

    directoryNames.forEach(function (dirName) {

        var fileNames = fs.readdirSync('./json/' + dirName);


        fileNames.forEach(function (fileName) {
            var fullFileName = './json/' + dirName + '/' + fileName;
            var fileContent = JSON.parse(fs.readFileSync(fullFileName).toString());
            restaurantArray.push(fileContent)


        });


    });

    
    console.log('got restaurant');

    return restaurantArray;
}

function pizzerie() {

    var directoryNames = utils.getDirectories('./json2');

    var pizzerieArray = [];

    directoryNames.forEach(function (dirName) {

        var fileNames = fs.readdirSync('./json2/' + dirName);


        fileNames.forEach(function (fileName) {
            var fullFileName = './json2/' + dirName + '/' + fileName;
            var fileContent = JSON.parse(fs.readFileSync(fullFileName).toString());


            pizzerieArray.push(fileContent)


        });


    });

   
    console.log('got pizzaerie');

    return pizzerieArray;
}




var res = restaurant();
console.log('---------------->' + res.length);

 var piz = pizzerie();
 // console.log('---------------->' + piz.length);



 jsonData(res,piz);
