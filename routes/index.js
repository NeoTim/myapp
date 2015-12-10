var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var logger = require('../lib/logger.js').logger('login');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', { title: 'Express' });
});

router.get('/register', function (req,res) {
    res.render('register.html', { title: '注册' });
});

router.post('/register', function (req, res) {
    user.register(req, function (err) {
        console.log('--->>>',err);
        if(!err){
            res.status(200).send({redirect : '/main'});
        } else {
            return res.send(err);
        }
    });
});

router.get('/main', function (req,res) {
    console.log('////////main');
    res.render('main.html',{title : '碰碰对战'});
});

router.post('/login',function(req, res){
    logger.info('login parameters : email '+req.body.email+' pass '+req.body.password);
    user.checkIsInDb(req,function(err,userInfo){
        if(!err){
            if(!userInfo){
                return res.sendStatus(300);
            } else {
                //todo
                console.log('用户登陆',userInfo);
                //return res.send({status : 200,info : userInfo});
                return res.render('main.html',{title : '房间管理'});
            }
        } else {
            return res.sendStatus(500);
        }
    });
});


module.exports = router;
