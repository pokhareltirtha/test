var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
//var esUtil= require('./../es/esutil');
//console.log(esUtil);
var esOptions = require('./../es/esoptions');
var Schema = mongoose.Schema;
var _ = require('lodash');

var RestaurantSchema=new Schema({
    "name": {"type" : String , "required" : true },
    "description" : String ,
    "cusine" : String,
    "logo" : String,
    "photo" : [String],
    "price"  : Number,
    //"owner_email" : String,
    //"restaurantName":{"type":String, "required":true},
    "streetAddress" : { "type" : String },
    "addressLocality": String,
    "subdomain":{"type":String},
    "companyName":{"type":String},
    "city":{"type":String},
    "province":{"type":String},
    "address":{type:String},
    "telephone": Array,
    "rating": Number,
    "postalCode": Number,
    "categories": Array,
    "addressRegion": String,
    "zipCode":{"type":Number},
    "email":{"type":String},
    "holidayDates":String,
    "homeDelivery":Boolean,
    "takeAway":Boolean,
    "barService":{ type : Boolean , default : false },
    "restaurantService":{ type : Boolean , default : false },
    "pizzeria":Boolean,
    "zoom":{"Type":Number},
    "coordinates" : {
        lat : { type : Number } , 
        lon : { type : Number }
    },
    archived : { type : Boolean , default : false },
    claimed : { type : Boolean , default : false } ,
    pizzerieService: { type : Boolean , default : false },
    addressLocality_suggest : Object,
    name_suggest : Object,
    streetAddress_suggest : Object,
    status : {
        type : String , 
        enums :['claimed','pending','nothing','disabled'],
        default : 'nothing'
    }

});


// var CONTEXT = ["categories","coordinates","price","rating"];

function makeSuggest (value) {
    var valArr = value.split(" ");

    return {
        input : valArr,
        output : value
    }
}
// RestaurantSchema.pre('index',function(next){

//     // var context = _.pick(this,CONTEXT);
//     // this.addressLocality_suggest = makeSuggest(this.addressLocality);
//     // this.name_suggest = makeSuggest(this.name);
//     // this.streetAddress_suggest = makeSuggest(this.streetAddress);
//     next();
// });

var options = {
    index: '7060_test',
    type: 'restaurants'
};

RestaurantSchema.plugin(mongoosastic,esOptions(options));


var Restaurant =  mongoose.model('oRestaurant', RestaurantSchema);


module.exports = Restaurant;