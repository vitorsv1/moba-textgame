const usersCollection = 'users';
var db = null;
// --------user managment---------
export const findUser = function(user,callback) {
    const collection = db.collection(usersCollection);
    collection.find({username:user}).toArray(function(err, users) {
        assert.equal(err, null);
        console.log("Found the following users with same username: '" + user + "'");
        console.log(users);
        callback(users);
    });
}

export const insertUser = function(user, pass, callback) {
    const collection = db.collection(usersCollection);
    collection.insertOne({username: user, password: pass,  wins:0, losses:0, match: null}
    , function(err, response) {
        assert.equal(err, null);
        assert.equal(1, response.result.n);
        assert.equal(1, response.ops.length);
        console.log("Created new user");
        callback(response);
    });
}

export const increaseUserWins(user,callback){
    const collection = db.collection(usersCollection);
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ username: user }
        , { $inc: { wins : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("increased user wins");
            callback(result);
        });
}

export const increaseUserlosses(user,callback){
    const collection = db.collection(usersCollection);
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ username: user }
        , { $inc: { losses : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("increased user losses");
            callback(result);
        });
}

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'moba-textgame';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    /*
    findUser('Vitor', function () {});
    insertUser('Vitor', '123', function () {findUser(db,'Pau', console.log);});
     */
});

/*
console.log("hey there");
function continueExec() {
    //here is the trick, wait until var callbackCount is set number of callback functions
    if (db == null) {
        setTimeout(continueExec, 1000);
        return;
    }
    else findUser('Vitor', function () {});
}
continueExec();
*/


