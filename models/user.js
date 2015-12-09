/**
 * Created by lixiaodong on 15/11/26.
 */
//var user = require('../schema/userInfo.js');
var util = require('../util/util.js');
var userModel = require('../schema/schema.js').userModel;

var checkIsInDb = function(req,next){
    var email = req.body.email;
    var password = req.body.password;

    email = util.hashAlgorithm(email);
    password = util.hashAlgorithm(password);

    userModel.find({email:email, password: password},function(err,userInfo){
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