/**
 * Created by lixiaodong on 15/12/2.
 */
var models = require('./models.js');

var Mongo = function(){

}

Mongo.prototype.findById = function(schemaName,id,cb){
    var model = models[schemaName+'Model'];
    model.findById(id).exec(cb);
}


module.exports = new Mongo();