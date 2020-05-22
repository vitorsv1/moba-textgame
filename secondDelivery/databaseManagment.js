var db = null;

// --------user managment---------

const usersCollection = 'users';

function findUser(user,callback) {
    const collection = db.collection(usersCollection);
    collection.find({username:user}).toArray(function(err, users) {
        assert.equal(err, null);
        console.log("Found the following users with same username: '" + user + "'");
        console.log(users);
        callback(users);
    });
}

function insertUser(user, pass, callback) {
    const collection = db.collection(usersCollection);
    collection.insertOne({username: user, password: pass,  wins:0, losses:0, match: null, matchChar1: null}
    , function(err, response) {
        assert.equal(err, null);
        assert.equal(1, response.result.n);
        assert.equal(1, response.ops.length);
        console.log("Created new user");
        if(callback)callback(response);
    });
}

function increaseUserWins(user,callback){
    const collection = db.collection(usersCollection);
    collection.updateOne({ username: user }
        , { $inc: { wins : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("increased user wins");
            if(callback)callback(result);
        });
}

function increaseUserLosses(user,callback){
    const collection = db.collection(usersCollection);
    collection.updateOne({ username: user }
        , { $inc: { losses : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("increased user losses");
            if(callback)callback(result);
        });
}

function finnishGameUser(user,callback){
    const collection = db.collection(usersCollection);
    collection.updateOne({ username: user }
        , { $set: { match : null } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("removed match from user");
            if(callback)callback(result);
        });
}


function attachFight(user, fightId, matchfirst,callback){
    const collection = db.collection(usersCollection);
    collection.updateOne({ username: user }
        , { $set: { match: fightId, matchChar1:matchfirst } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("user match attached");
            if(callback) callback(result);
        });
}



//--------matches management------------

const matchesCollectionName = 'matches';

//new Matches
function insertMatch(fight, callback) {
    const collection = db.collection(matchesCollectionName);
    collection.insertOne({match: fight}
        , function(err, response) {
            assert.equal(err, null);
            assert.equal(1, response.result.n);
            assert.equal(1, response.ops.length);
            console.log("Created new match with id: " + response.insertedId);
            if(callback) callback(response);
        });
}

function removeMatch(user,callback) {
    const collection = db.collection(usersCollection);
    const matchColletcion  = db.collection(matchesCollectionName);
    collection.findOne({username:user}, { projection: {match:1} }, function(err, response) {
        assert.equal(err, null);
        assert.notEqual(response,  null);
        console.log("found a match id for the user: ");
        console.log(response);
        matchColletcion.deleteOne({ "_id" : Mongo.ObjectID(response.match)}, function (err) {
            assert.equal(err, null);
            console.log("match deleted");
            if(callback) callback(response);
        });
    });
}


function updateMatch(user,fight, callback){
    console.log("updating match for: " + user);
    const collection = db.collection(usersCollection);
    const matchColletcion  = db.collection(matchesCollectionName);
    collection.findOne({username:user}, { projection: {match:1} }, function(err, response) {
        assert.equal(err, null);
            assert.notEqual(response,  null);
            console.log("found a match id for the user: ");
            console.log(response);
            matchColletcion.updateOne({ "_id" : Mongo.ObjectID(response.match)}, { $set: {match: fight}}, function (err, response) {
                assert.equal(err, null);
                console.log("match by id updated, response:");
                console.log(response);
                assert.equal(1, response.result.n);
                if(callback) callback(response);
            });
        });
}

function getFight(user, callback) {
    const collection = db.collection(usersCollection);
    const matchColletcion  = db.collection(matchesCollectionName);
    //collection.find({username:user}, { projection: {match:1} }).toArray(function(err, response) {
    collection.findOne({username:user}, { projection: {match:1} }, function(err, response) {
        assert.equal(err, null);
        assert.notEqual(response,  null);
        console.log("found a match id for the user: ");
        console.log(response);
        matchColletcion.findOne({ "_id" : Mongo.ObjectID(response.match)}, function (err, response) {
            assert.equal(err, null);
            console.log("found a game :)");
            console.log(response);
            callback(response);
        });
    });

}






//-----------------------------------------
//-----Connect to database-----------------
//-----------------------------------------
const Mongo = require('mongodb');
const MongoClient =Mongo.MongoClient;
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

});

/*
function continueExec() {
    //here is the trick, wait until var callbackCount is set number of callback functions
    if (db == null) {
        setTimeout(continueExec, 1000);
        return;
    }
}
continueExec();

 */


//----MODULE EXPORTS-----
exports.findUser = findUser;
exports.insertUser = insertUser;
exports.increaseUserWins = increaseUserWins;
exports.increaseUserLosses = increaseUserLosses;
exports.finnishGameUser = finnishGameUser;
exports.insertMatch = insertMatch;
exports.attachFight = attachFight;
exports.updateMatch = updateMatch;
exports.removeMatch = removeMatch;
exports.getFight = getFight;



