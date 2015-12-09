/**
 * Created by lixiaodong on 15/12/8.
 */
var userModel = require('../schema/schema.js').userModel;
var async = require('async');
var util = require('../util/util.js');

var index =
    [
        { start: 0,  end: 10 },
        { start: 11, end: 20 },
        { start: 21, end: 30 },
        { start: 31, end: 40 },
        { start: 41, end: 50 },
        { start: 51, end: 60 },
        { start: 61, end: 70 },
        { start: 71, end: 80 },
        { start: 81, end: 90 },
        { start: 91, end: 100 }
    ];



var robots = {all : {}, info : [], levelRange : {}};

var Robot = function(){

}

//按照等级查询 order(level).desc
Robot.prototype.initRobot = function(){
    var userCount = 0;
    var users = [];
    var time = 0;
    setTimeout(function(){
        async.waterfall([
            function(cb){
                util.getRedisData('robots',function(err,data){
                    if(!err && !!data){
                        console.log('缓存中有机器人数据==>>',data);
                        robots = data;
                    }
                    cb(err);
                });
            },
            function (cb) {
                userModel.count({},function(err,count){
                    if(!err && !!count){
                        userCount = count;
                    }
                    cb(err);
                });
            },
            function (cb) {
                var col = {_id :1, name : 1, level : 1}; //查询字段
                async.mapSeries(index, function (item,call) {
                    var con = {level : {$gte : item.start, $lte : item.end}};//条件
                    userModel.find(con,col).sort({level : -1}).exec(function(err,data) {
                        if (!err && !!data && data.length > 0) {
                            robots.levelRange[item.start % 10] = data;
                            users = users.concat(data);
                        }
                        call(err);
                    });
                }, function (err) {
                    cb(err);
                });
            },
            function(cb){
                bubbleSort(users,'level');
                robots.info = users;
                robots.all = robots.all || {};
                for(var i = 0 ; i < users.length; i++) {
                    console.log(users[i]);
                    robots.all[users[i]._id] = users[i];
                }

                util.setRedisData('robots',robots,function(){
                    cb();
                });
            }
        ], function (err) {
            if(err){
                console.log('机器人初始化失败!');
            }
            console.log('机器人初始化完毕!',robots);
        });
        setTimeout(arguments.callee,4 * 60 * 60 * 1000);
    }, time);


}

//冒泡排序
function bubbleSort(array,key){
    for(var i = 0 ; i < array.length; i++){
        for(var j = i ; j < array.length; j++){
            if(array[i][key] < array[j][key]){
                var temp = array[j];
                array[j] = array[i];
                array[i] = temp;
            }
        }
    }
}

/**
 *
 * @param rankingName
 * @param obj
 */
Robot.prototype.updateRanking = function(rankingName,obj){

}


module.exports = Robot;

