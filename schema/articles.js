/**
 * Created by lixiaodong on 15/12/2.
 */

var articleSchema = mongoose.Schema({
    name: String,
    //Also creating index on field isbn
    isbn: {type: String, index: true},
    author: String,
    pages: Number
});



var article = mongoose.model('articles', articleSchema, "mongoose_demo");

//
//var queryarticlesByOpt = function(opt){
//    //Now querying those articles which have less than 100 pages
//    //Find API takes in a query condition, attributes in the document to be projected,
//    //callback to be executed when the data is available.
//    article.find({pages : {$lt:100,$gt:90}}, "name isbn author pages", function(err, result){
//        if ( err ) throw err;
//        console.log("Find Operations: " + result);
//    });
//}
//
//var queryarticles = function(){
//    //Now querying those articles which have less than 100 pages
//    //Find API takes in a query condition, attributes in the document to be projected,
//    //callback to be executed when the data is available.
//    article.find({pages : {$lt:100}}, "name isbn author pages", function(err, result){
//        if ( err ) throw err;
//        console.log("Find Operations: " + result);
//    });
//}
//
//var updatearticle = function(){
//    /*
//     Find the article to be updated using the condition and then execute the update
//     passed to the API as the second argument
//     */
//    article.update({isbn : {$eq: 'MNG125'}}, {$set: {name: "Mongoose Demo 3.1"}}, function(err, result){
//        console.log("Updated successfully");
//        console.log(result);
//    });
//}
//
//var deletearticle = function(){
//    /*
//     When callback is not passed, the action is not invoked on the collection
//     until the exec() method is called.
//     In this case I am not passing the callback and instead executing the action
//     by invoking the exec() method.
//     */
//    article.remove({isbn:{$eq: 'MNG124'}}).exec();
//}
