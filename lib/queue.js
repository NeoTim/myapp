/**
 * Created by lixiaodong on 15/12/9.
 */
/**
 * Created on 15/8/27.
 */

function ActionQueue(){
    this.msgQueue = [];
}

ActionQueue.prototype.__enqueue = function (action){
    if(this.msgQueue.length > 0){
        this.msgQueue.push({func: action, time: Date.now()});
        this.msgQueue.shift();
        this.dequeue();
    } else {
        this.msgQueue.push({func: -1, time: Date.now()});
        action();
    }
}

ActionQueue.prototype.dequeue = function (){
    if(this.msgQueue.length > 0){
        var data = this.msgQueue.shift();
        var func = data.func;
        if(typeof func === "function"){
            func();
        } else {
            var data = this.msgQueue.shift();
            if(!!data && !!data.func){
                var func = data.func;
                if(typeof func === "function"){
                    func();
                }
            }
        }
    }
}

//
//ActionQueue.prototype.isFull = function (){
//    if(!this.msgQueue.length){
//        return false;
//    }
//    var now = Date.now();
//    if(now - this.msgQueue[0].time >= 10 * 1000){
//        this.msgQueue.shift();
//        this.dequeue();
//
//        if(!!this.msgQueue[0]){
//            this.msgQueue[0].time = now;
//        }
//    }
//
//    return this.msgQueue.length >= 100;
//};

ActionQueue.prototype.enqueue = function (action, next){
    var self = this;
    self.__enqueue(function(){
        action(function(err,msg){
            next(err,msg);
            self.dequeue();
        });
    });
}

module.exports = ActionQueue;

//use method

//var Queue = new ActionQueue();

//function currAction(next){
//    //.....逻辑
//}
//
//Queue.enqueue( currAction , next);




