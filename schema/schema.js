/**
 * Created by lixiaodong on 15/12/2.
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    password : String,
    age : {type : Number, default : 0},
    name : String,
    level :{type : Number, default : 1},
    loginTime : {type : Number, default:0}
},{_id : false});

var articleSchema = new mongoose.Schema({
    _id:String,
    title : String,
    content : String,
    createTime : {type :Number, default: Date.now()},
    modifyTime : {type : Number,default: Date.now()}
});

userSchema.static.findPagination = function(obj,callback) {
    var q = obj.search || {};//查询条件
    var col = obj.columns; //查询字段

    var pageNumber = obj.page.num || 1;
    var resultsPerPage = obj.page.limit || 10;//单次查询数据数量

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;

    var query = userSchema.find(q,col).sort('level').skip(skipFrom).limit(resultsPerPage);

    query.exec(function(error, results) {
        if (error) {
            callback(error, null, null);
        } else {
            userSchema.count(q, function(error, count) {
                if (error) {
                    callback(error, null, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, pageCount, results);
                }
            });
        }
    });
}

var userModel = mongoose.model('user',userSchema);
var articleModel = mongoose.model('articles',articleSchema);


exports.userModel = userModel;
exports.articleModel = articleModel;