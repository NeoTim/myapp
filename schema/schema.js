/**
 * Created by lixiaodong on 15/12/2.
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    password : String,
    age : {type : Number, default : 0},
    name : String,
    loginTime : {type : Number, default:0}
},{_id : false});

var articleSchema = new mongoose.Schema({
    _id:String,
    title : String,
    content : String,
    createTime : {type :Number, default: Date.now()},
    modifyTime : {type : Number,default: Date.now()}
});

var userModel = mongoose.model('user',userSchema);
var articleModel = mongoose.model('articles',articleSchema);


exports.userModel = userModel;
exports.articleModel = articleModel;