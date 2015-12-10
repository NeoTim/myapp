var userModel = require('../schema/schema.js').userModel;
var async = require('async');
var util = require('../util/util.js');

var ActionQueue = require('../lib/queue.js');
var Queue = new ActionQueue();

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

var getIndex = function(level){
    if(level === 0){
        return 0;
    } else {
        if(!(level % 10)){
            return level / 10 - 1;
        } else {
            return Math.floor(level / 10 );
        }
    }
}


var robots = {all : {}, info : [], levelRanking : {}};

var Robot = function(){

}

//按照等级查询 order(level).desc
Robot.prototype.initRobot = function(cb){
    var users = [];
    var time = 0;

    setTimeout(function(){
        function currQueue(){
            async.waterfall([
                function(cb){
                    util.getRedisData('robots',function(err,data){
                        if(!err && !!data){
                            console.log('initRobot-缓存中有机器人数据==>>',data);
                            robots = data;
                        }
                        cb(err);
                    });
                },
                function(cb){
                    if(!!robots){
                        util.setRedisData('tempRobots',robots, function (err) {
                            util.deleteRedisData('robots', function () {
                                cb();
                            });
                        });
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    var col = {_id :1, name : 1, level : 1}; //查询字段
                    async.mapSeries(index, function (item,call) {
                        var con = {level : {$gte : item.start, $lte : item.end}};//条件
                        userModel.find(con,col).sort({level : -1}).exec(function(err,data) {
                            if (!err && !!data && data.length > 0) {
                                robots.levelRanking[item.start % 10] = data;
                                users = users.concat(data);
                            }
                            call(err);
                        });
                    }, function (err) {
                        cb(err);
                    });
                },
                function(cb){
                    util.bubbleSort(users,'level');
                    robots.users = users;
                    robots.all = {};
                    for(var i = 0 ; i < users.length; i++) {
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
                console.log('机器人初始化完毕!');
            });
            setTimeout(arguments.callee, 10 * 1000);
            cb();
        }
        Queue.enqueue(currQueue,cb);
    }, time);
}

/**
 *
 * @param rankingName
 * @param obj
 */
Robot.prototype.updateRanking = function(obj,callback){
    async.waterfall([
        function (cb) {
            util.getRedisData('robots',function(err,data){
                if(!err && !!data){
                    console.log('getOwnRanking-缓存中有机器人数据==>>',data);
                    robots = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(!robots){
                callback();
                return;
            }

            var index = getIndex(obj.level);
            robots.levelRanking[index] = robots.levelRanking[index] || [];
            var levelRanking = robots.levelRanking[index];
            levelRanking.push(obj);
            util.bubbleSort(levelRanking,'level');

            robots.users = robots.users || [];
            robots.users.push(obj);
            util.bubbleSort(robots.users,'level');

            robots.all = robots.all || {};
            robots.all[obj._id] = obj;

            util.setRedisData('robots',robots,cb);
        }
    ], function (err) {
        if(!!err){
            console.log('updateRanking-error',err);
        }
        callback(err);
    });
}

Robot.prototype.getTop = function(end,callback){
    function currQueue(){
        var topTen = [];
        async.waterfall([
            function(cb){
                util.getRedisData('robots',function(err,data){
                    if(!err && !!data){
                        robots = data;
                    }
                    cb(err);
                });
            },
            function(cb){
                if(!robots){
                    util.getRedisData('tempRobots', function (err,data) {
                        if(!err && !!data){
                            robots = data;
                        }
                        cb(err);
                    });
                } else {
                    cb();
                }
            },
            function (cb) {
                if(!robots){
                    callback('no_redis_robots');
                    return;
                }
                var users = robots.users || [];
                topTen = users.slice(0,end);
                cb();
            }
        ], function (err) {
            if(!!err){
                console.log('获取排行榜前十名错误',err);
                return;
            }
            callback(err,topTen);
        });
    }
    Queue.enqueue(currQueue,callback);
}

Robot.prototype.getOwnRanking = function(uid,callback){
    function currQueue(){
        var ranking = 0;
        async.waterfall([
            function (cb) {
                util.getRedisData('robots',function(err,data){
                    if(!err && !!data){
                        console.log('getOwnRanking-缓存中有机器人数据==>>',data);
                        robots = data;
                    }
                    cb(err);
                });
            },
            function(cb){
                if(!robots){
                    console.log('机器人数据错误==>');
                    util.getRedisData('tempRobots', function (err,data) {
                        if(!err && !!data){
                            robots = data; //老数据 正在刷新排行榜
                        }
                        cb(err);
                    });
                } else {
                    cb();
                }
            },
            function (cb) {
                var users = robots.users;
                if(!users || !users.length){
                    callback('no_redis_robots_users');
                    return;
                }
                for(var i = 0 ; i < users.length; i++){
                    ranking ++;
                    if(users[i]._id === uid){
                        break;
                    }
                }
                cb();
            }
        ], function () {
            callback(null,ranking);
        });
    }
    Queue.enqueue(currQueue,callback);
}


module.exports = Robot;

