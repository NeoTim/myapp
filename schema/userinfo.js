var mongoose = require('mongoose');

/**
 * id : 训练ID
 * name : 训练名称
 * lock : 是否解锁
 * exp : 训练经验值
 * level : 训练等级
 * freeLimit : 当天剩余的免费次数
 * times : 当天已使用的收费次数
 * costType : 花费类型
 * cost : 花费值
 */
var trainingSchema = new mongoose.Schema({
    id:String,
    name:String,
    lock: { type: Boolean, default: false },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    freeLimit: { type: Number, default: 0 },
    times: { type: Number, default: 0 },
    costType: { type: Number, default: 0 },
    cost: { type: Number, default: 0 }
}, { _id:false });

/**
 * _id : email
 */
var userSchema = new mongoose.Schema({
    _id: String,
    password : String
});

//if (!userSchema.options.toObject) userSchema.options.toObject = {};
//userSchema.options.toObject.transform = function (doc, ret, options) {
//
//};

userSchema.methods.hasItem = function (id) {
    var item = util.getItemFromArray(this.knapsack, 'id', id);
    return (item && item.amount > 0) ? true : false;
};


var user = mongoose.model('user', userSchema);

module.exports = user;
