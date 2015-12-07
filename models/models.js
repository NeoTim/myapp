/**
 * Created by lixiaodong on 15/12/2.
 */

var schema = require('../schema/schema.js');

var mongoose = require('mongoose');
var userModel = mongoose.model('user',schema.userSchema);
var articleModel = mongoose.model('articles',schema.articleSchema);

exports.userModel = userModel;
exports.articleModel = articleModel;

