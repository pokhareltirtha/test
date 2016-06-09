var mongoose = require('mongoose');
var fs = require('fs');
var Restaurant = require('./models/restaurantData');
var path = require('path');
var async = require('async');
var _ = require('lodash');


mongoose.connect('mongodb://localhost/cityDataDB1');

var i = 1 ; 
function writeFile(fileContent,cb){
    console.log('writing file');

    var data = JSON.parse(fileContent);


        if (data.categories.indexOf('Pizzerie') > -1) {
            data.pizzerieService = true;
        }

         if (data.categories.indexOf('Ristoranti') > -1) {
            data.restaurantService = true;
        }


        var barTest = new RegExp('\\bbar\\b');

        if(barTest.test(data.name.toLowerCase()) || barTest.test(data.description.toLowerCase()) ) {
           data.barService = true;
        
           data.categories.push("Bar");
        }






    
    if(!data.address || !data.coordinates.lon || !data.coordinates.lat){
        return cb(null,'Empty');    
    }


    var restaurant = new Restaurant(data);
    
    restaurant.save(cb);

}




    var fileNames = fs.readdirSync('./jsonfinal/');



    async.forEachOfLimit(fileNames, 10 , function(file,ind,cb){
        console.log('reading file content');
        var fullFileName = './jsonfinal/'+file;
        var fileContent = fs.readFileSync(fullFileName).toString();
                console.log(' ind::' , ind);
        writeFile(fileContent,cb);
    },function end (err,f) {
        // body...
        console.log(err);
        console.log(' end');
    });

    // fileNames.forEach(function(fileName){
    //     console.log('reading file content');
    //     var fullFileName = './json-final/'+fileName;
    //     var fileContent = fs.readFileSync(fullFileName).toString();
    //     writeFile(fileContent);


    // })










