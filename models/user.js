/**
 * Created by lixiaodong on 15/11/26.
 */
//var user = require('../schema/userInfo.js');
var util = require('../util/util.js');
var mongo = require('./mongo.js');

var checkIsInDb = function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;

    email = util.hashAlgorithm(email);
    password = util.hashAlgorithm(password);

    mongo.find('user',email,function(err,userInfo){
        console.log(err,userInfo);
        if(!err){
            if(!userInfo){
                next('no_user');
                return;
            } else {
                next(null,userInfo);
            }
        } else {
            next(err);
        }
    });
}

exports.checkIsInDb = checkIsInDb;