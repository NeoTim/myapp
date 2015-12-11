var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var logger = require('../lib/logger.js').logger('login');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', { title: '撞撞游戏中心' });
});

router.get('/register', function (req,res) {
    res.render('register.html', { title: '注册' });
});

router.post('/register', function (req, res) {
    user.register(req, function (err) {
        if(!err){
            res.status(200).send({redirect : '/roomlist'});
        } else {
            return res.send(err);
        }
    });
});

router.post('/login',function(req, res){
    logger.info('login parameters : email '+req.body.email+' pass '+req.body.password);
    user.checkIsInDb(req,function(err,userInfo){
        if(!err){
            if(!userInfo){
                return res.sendStatus(300);
            } else {
                res.status(200).send({redirect : '/main'});
            }
        } else {
            return res.sendStatus(500);
        }
    });
});

router.get('/roomlist', function (req,res) {
    res.render('roomlist.html',{title : '撞撞对战'});
});

module.exports = router;
