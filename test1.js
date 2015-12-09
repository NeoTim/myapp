var curr = new Date();

var year = curr.getFullYear();
var month = curr.getMonth() + 1;
month = month < 10 ? '0'+month : month;
var day = curr.getDate();
day = day < 10 ? '0'+day : day;

var morning = new Date(year + '-' + month + '-' + day + ' 00:00:00').getTime();
var night = morning + 24 * 60 * 60 * 1000;


console.log(morning,night);


