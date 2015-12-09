/**
 * Created by lixiaodong on 15/12/8.
 */
var redis = require('redis');
var config = require('../config/redis.json');
var oneDay = 24 * 60 * 60 * 1000;

var Redis = function(){
    this.client = null;
}

Redis.prototype.createRedisClient = function(){
    var client;

    if(!this.client){
        client = redis.createClient(config.port,config.host,config.opts);
        this.client = client;
    }

    client.on('ready', function (res) {
        console.log('redis is ready!');
    });

    client.on('end',function(err){
        console.log('redis end');
    });

    client.on('connect',function(){
        console.log('redis connect success!');
    });
    return client;
}

Redis.prototype.set = function(key,value,callback){
    this.client.set(key,value,function(){
        this.client.expire(key,oneDay);
        callback();
    });
}

Redis.prototype.get = function(key,callback){
    this.client.get(key,callback);
};



module.exports = Redis;