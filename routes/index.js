var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.post('/login',function(req, res, next){
    console.log('===>>>>>',req.body);
    user.checkIsInDb(req,res,function(err,userInfo){
        if(!err){
            if(!userInfo){
                return res.sendStatus(300);
            } else {
                //todo
                return res.sendStatus(200);
            }
        } else {
            return res.sendStatus(500);
        }
    });
});

module.exports = router;
