/**
 * Created by lixiaodong on 15/11/26.
 */
//var user = require('../schema/userInfo.js');
var util = require('../util/util.js');
var userModel = require('../schema/schema.js').userModel;
var async = require('async');


var checkIsInDb = function(req,next){
    var email = req.body.email;
    var password = req.body.password;

    email = util.hashAlgorithm(email);
    password = util.hashAlgorithm(password);

    userModel.findById(email).exec(function(err,userInfo){
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

var register = function( req, next){
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;

    if(!email || !password || !name){
        next('INVALID_PARAMETER');
        return;
    }

    console.log('parameter===>>',req.body);
    email = util.hashAlgorithm(email);
    password = util.hashAlgorithm(password);

    async.waterfall([
        function (cb) {
            userModel.findById(email, function (err,data) {
                if(!err && !!data){
                    next('USER_EXISTS');
                    return;
                }
                cb(err);
            });
        },
        function (cb) {
            var userInfo = new userModel({
                _id : email,
                password : password,
                name : name,
                loginTime : parseInt(Date.now())
            });
            var userEntity = new userModel(userInfo);
            userEntity.save(userInfo, function (err) {
                cb(err);
            });
        }
    ], function (err) {
        next(err);
    });
}

exports.checkIsInDb = checkIsInDb;
exports.register = register;