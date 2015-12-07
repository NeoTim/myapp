var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var logger = require('../lib/logger.js').logger('login');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.post('/login',function(req, res){
    logger.info('login parameters : email '+req.body.email+' pass'+req.body.password);
    user.checkIsInDb(req,function(err,userInfo){
        if(!err){
            if(!userInfo){
                return res.sendStatus(300);
            } else {
                //todo
                console.log('用户登陆',userInfo);
                //return res.render('main.html',{title : '首页'});
                return res.send({status : 200,info : userInfo});
            }

        } else {
            return res.sendStatus(500);
        }
    });
});

module.exports = router;
