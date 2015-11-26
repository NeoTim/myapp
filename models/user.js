/**
 * Created by lixiaodong on 15/11/26.
 */

var user = require('../schema/userInfo.js');

//var User = function(){
//    this.players = {};
//}

var checkIsInDb = function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;

    console.log(email,password);
    user.findById(email).exec(function(err,userInfo){
        console.log(err,userInfo);
        if(!err){
            if(!userInfo){
                userInfo = new user({_id : email, password : password});
                userInfo.save(function(err){
                    console.log('创建新角色==>>',err,userInfo);
                    next(err,userInfo);
                });
            } else {
                next(null,userInfo);
            }
        } else {
            next(err);
        }
    });
}

exports.checkIsInDb = checkIsInDb;