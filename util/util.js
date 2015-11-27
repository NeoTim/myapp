/**
 * Created by lixiaodong on 15/11/27.
 */

var crypto = require('crypto');

function hashAlgorithm(key){
    var shasum = crypto.createHash('md5');
    shasum.update(key);
    var d = shasum.digest('hex');
    return d;
}



exports.hashAlgorithm = hashAlgorithm;