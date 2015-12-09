/**
 * Created by lixiaodong on 15/11/27.
 */

var crypto = require('crypto');
var Redis = require('../lib/redis.js');
var redis = new Redis();
var redisClient = redis.createRedisClient();

function hashAlgorithm(key){
    var shasum = crypto.createHash('md5');
    shasum.update(key);
    return shasum.digest('hex');
}

function setRedisData(key,value,callback){
    redisClient.set(key,JSON.stringify(value),callback)
}

function getRedisData(key,callback){
    redisClient.get(key,function(err,data){
       if(!err && !!data){
            callback(err,JSON.parse(data));
       } else {
           callback(err);
       }
    });
}

function getMNTime(date){
    var curr = new Date();
    if(!!date){
        curr = new Date(date);
    }

    var year = curr.getFullYear();
    var month = curr.getMonth() + 1;
    month = month < 10 ? '0'+month : month;
    var day = curr.getDate();
    day = day < 10 ? '0'+day : day;

    var morning = new Date(year + '-' + month + '-' + day + ' 00:00:00').getTime();
    var night = morning + 24 * 60 * 60 * 1000;
    return {morning : morning, night : night};
}

exports.getMNTime = getMNTime;
exports.hashAlgorithm = hashAlgorithm;
exports.setRedisData = setRedisData;
exports.getRedisData = getRedisData;