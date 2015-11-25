var mongoose = require('mongoose');
var petConfig = require('../config/pet.json');
var xpConfig = require('../config/xp.json');
var jobConfig = require('../config/job.json');
var patcher = require('../json-patch');
var util = require('../util');
var quest = require('../routes/game/quest');
var training = require('../routes/game/training.js');
var job = require('../routes/game/job.js');


var itemSchema = new mongoose.Schema({
    id:String,
    amount:Number
}, { _id:false });

var jobSchema = new mongoose.Schema({
    id:String,
    limit:Number,
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    lock: { type: Boolean, default: true },
    onceDone: { type: Boolean, default: false }
}, { _id:false });

var questSchema = new mongoose.Schema({
    _id:Number,
    questId:String,
    progress: { type: Number, default: 0 },
    started: { type: Boolean, default: false },
    byCash: { type: Boolean, default: false }
});

var visitSchema = new mongoose.Schema({
    _id:Number,
    fromId:String,
    nickName:String,
    headImage:String,
    actionId:String,
    award:Number
});

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

var userSchema = new mongoose.Schema({

    _id: String,

    lastLoginTime: { type: Date, default: Date.now },
    lastRecoveryTime: { type: Date, default: Date.now },

    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    vip: { type: Number, default: 0 },
    isEgg: { type: Boolean, default: true },
    jobSpeedupLimit: { type: Number, default: petConfig.jobSpeedupLimit },
    buyJobTime: { type: Number, default: 0 },

    stats: {
        quest: { type: Number, default: 0 },
        visit: { type: Number, default: 0 }
    },

    pet: {
        updateTime: { type: Date, default: Date.now },
        hunger: { type: Number, default: petConfig.status.hunger },
        cleaness: { type: Number, default: petConfig.status.cleaness },
        mood: { type: Number, default: petConfig.status.mood },
        hungerMax: { type: Number, default: petConfig.status.hungerMax },
        cleanessMax: { type: Number, default: petConfig.status.cleanessMax },
        moodMax: { type: Number, default: petConfig.status.moodMax },

        appearance: {
            hat: { type: String, default: petConfig.appearance.hat },
            deco: { type: String, default: petConfig.appearance.deco },
            cloth: { type: String, default: petConfig.appearance.cloth },
            pants: { type: String, default: petConfig.appearance.pants },
            item: { type: String, default: petConfig.appearance.item },
            overall: { type: String, default: petConfig.appearance.overall },

            body: { type: String, default: petConfig.appearance.body },
            ear: { type: String, default: petConfig.appearance.ear },
            brow: { type: String, default: petConfig.appearance.brow },
            eye: { type: String, default: petConfig.appearance.eye },
            nose: { type: String, default: petConfig.appearance.nose },
            mouth: { type: String, default: petConfig.appearance.mouth }
        }
    },

    currency: {
        coin: { type: Number, default: petConfig.currency.coin },
        social: { type: Number, default: petConfig.currency.social },
        cash: { type: Number, default: petConfig.currency.cash }
    },

    knapsack: [itemSchema],

    jobs: [jobSchema],

    currentJob: {
        id: { type: String, default: ''},
        endTime: { type: Date, default: Date.now }
    },

    quests: [questSchema],

    questStatus:{
        zero: { type: Boolean, default: false },
        first: { type: Boolean, default: false },
        second: { type: Boolean, default: false }
    },

    trainings : [trainingSchema],

    visits: [visitSchema],

    pendingVisits: [visitSchema],

    chest:{
        level: { type: Number, default: 0 },
        click: { type: Number, default: 0 },
        okTime:{ type: Date, default: Date.now },
        coins:[]
    },

    limitedActions: [itemSchema],

    secret: {
        accessToken: String,
        refreshToken: String
    },

    nickName: { type: String, default: ''},
    sex: { type: String, default: ''},
    headImage: { type: String, default: ''},

    friendship : {type : Number, default : 0},
    friendshipLevel : {type : Number, default : 0},

    nextRefreshTime : {type : Number, default : 0},

    session: String,

    reqIndex: Number
});

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {

    ret.id = ret._id;

    ret.serverTime = Date.now();
    ret.level++;
    if(ret.level > xpConfig.levelMax)
        ret.nextXP = 0;
    else
        ret.nextXP = xpConfig.levelXP[ret.level];
    ret.currentJob.endTime = ret.currentJob.endTime.getTime();

    // TO-DO need optimization, udpate when job level up
    var length = ret.jobs.length;
    for(var i = 0; i < length; i++){
        var userItem = ret.jobs[i];
        userItem.level++;
        var jobItem = util.getItemFromArray(jobConfig.jobs, 'id', userItem.id);
        if(jobItem) {
            if (userItem.level > jobItem.maxLevel)
                userItem.nextXP = 0;
            else
                userItem.nextXP = jobItem.level[userItem.level].xp;
            delete userItem.onceDone;
        }else{
            console.log('Job does not exist: ' + userItem.id);
        }
    }

    length = ret.quests.length;
    for(var i = 0; i < length; i++){
        ret.quests[i].index = ret.quests[i]._id;
        delete ret.quests[i]._id;
    }

    length = ret.visits.length;
    for(var i = 0; i < length; i++){
        ret.visits[i].index = ret.visits[i]._id;
        delete ret.visits[i]._id;
    }

    delete ret.secret;
    delete ret.pendingVisits;
    delete ret._id;
    delete ret.__v;
    delete ret.lastLoginTime;
    delete ret.lastRecoveryTime;
    delete ret.pet.updateTime;
    delete ret.session;

    return ret;
};

userSchema.methods.hasItem = function (id) {
    var item = util.getItemFromArray(this.knapsack, 'id', id);
    return (item && item.amount > 0) ? true : false;
};

userSchema.methods.addItem = function (id, amount){
    var item = util.getItemFromArray(this.knapsack, 'id', id);
    if(item) item.amount += amount;
    else this.knapsack.push({id:id, amount:amount});
};

userSchema.methods.addItems = function (items){
    var length = items.length;
    for (var i = 0; i < length; i++){
        this.addItem(items[i].id, items[i].amount);
    }
};

userSchema.methods.useItem = function (id, amount) {
    var item = util.getItemFromArray(this.knapsack, 'id', id);
    if(item && item.amount >= amount) {
        item.amount -= amount;
        return true;
    }else return false;
};

userSchema.methods.addJob = function (job) {
    this.jobs.push({id:job.id, limit:job.dailyLimit, level:0, xp:0});
};


userSchema.methods.asFriendInfoLite = function () {
    return {
        id:this._id,
        level:this.level + 1,
        nickName:this.nickName,
        sex:this.sex,
        headImage:this.headImage
    };
};

userSchema.methods.asFriendInfo = function () {
    var result = {};
    result.id = this._id;
    result.level = this.level + 1;
    result.pet = this.pet;
    return result;
};

//添加新的训练
userSchema.methods.addTraining = function(trainingObj){
    this.trainings.push(trainingObj);
};


// return true if level up...
userSchema.methods.udpateInfo = function (){

    if(this.pet.hunger > this.pet.hungerMax) {
        this.pet.hunger = this.pet.hungerMax;
        quest.hungerFull(this);
    }

    if(this.pet.cleaness > this.pet.cleanessMax) {
        this.pet.cleaness = this.pet.cleanessMax;
        quest.cleanessFull(this);
    }

    if(this.pet.mood > this.pet.moodMax) {
        this.pet.mood = this.pet.moodMax;
        quest.moodFull(this);
    }

    if(this.level < xpConfig.levelMax && this.xp >= xpConfig.levelXP[this.level + 1]){

        this.level++;
        this.xp -= xpConfig.levelXP[this.level];

        this.pet.hungerMax = petConfig.status.hunger + 20 * this.level;
        this.pet.cleanessMax = petConfig.status.cleaness + 20 * this.level;
        this.pet.moodMax = petConfig.status.moodMax + 20 * this.level;

        this.pet.hunger = this.pet.hungerMax;
        this.pet.cleaness = this.pet.cleanessMax;
        this.pet.mood = this.pet.moodMax;

        return true;
    }

    return false;
};

userSchema.methods.backup = function (req) {
    req.backup = this.toObject();
};

userSchema.methods.delta = function (req) {
    if (!req.backup) return [];
    var current = this.toObject();
    return patcher.compare(req.backup, current);
};

var user = mongoose.model('user', userSchema);
module.exports = user;
