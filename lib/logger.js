/**
 * Created by lixiaodong on 15/12/7.
 */
var log4js = require("log4js");
var log4json = require('../config/log4js.json');

log4js.configure(log4json);

exports.connectLogger = function(format) {
    var logger = log4js.getLogger('http');
    logger.setLevel("INFO");
    return log4js.connectLogger(logger, {level:log4js.levels.INFO, format:format});
};

exports.logger = function(name) {
    var logger = log4js.getLogger(name);
    logger.setLevel("INFO");
    return logger;
};