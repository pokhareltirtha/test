
var client = require('./esutil')

module.exports=function(options){
    return {
    	esClient: client,
        index: "8001_test",
        type: options.type
    };
};
