//var mongoose = require('mongoose');
//
//
///**
// * _id : email
// */
//var userSchema = new mongoose.Schema({
//    _id: String,
//    password : String
//});
//
////if (!userSchema.options.toObject) userSchema.options.toObject = {};
////userSchema.options.toObject.transform = function (doc, ret, options) {
////
////};
//
//userSchema.methods.hasItem = function (id) {
//    //var item = util.getItemFromArray(this.knapsack, 'id', id);
//    //return (item && item.amount > 0) ? true : false;
//};
//
//if (!userSchema.options.toObject) userSchema.options.toObject = {};
//
////数据过滤
//userSchema.options.toObject.transform = function (doc, ret, options) {
//
//}
//var user = mongoose.model('user', userSchema);
//
//module.exports = user;
