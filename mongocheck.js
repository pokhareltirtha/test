var mongoose = require('mongoose');
var Restaurant = require('./models/restaurantData');

mongoose.connect('mongodb://localhost/restaurantDB');

console.log('hello');

function something(){

   

Restaurant.find(function(err,data){
    console.log('asssds');
  if(!err){
    console.log('not err');
    console.log(data);
  }else{
    console.log(err);
  }

});

}

something();