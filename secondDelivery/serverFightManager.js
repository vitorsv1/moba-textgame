const fight = require('./public/scripts/character');
const database = require('./databaseManagment');
//const io = require('socket.io')



function createFight(user1,user2, char1, char2, callback){
    fightObj = new fight.Fight(char1,char2);
    database.insertMatch(fightObj, (res) =>{
        console.log('created new "fight" with id: ' + res.insertedId);
        database.attachFight(user1,res.insertedId,true,()=>{
            database.attachFight(user2,res.insertedId,false,()=>{
                console.log("users matches attatched");
                if(callback)callback();
            });
        });
    });
    return fightObj;
}

function updateFight(user, fight) {
    database.updateMatch(user,fight,()=>{console.log("Fight update completed :)")});
}

function getFight(user, callback){
    database.getFight(user,(res) =>{
        tmpChar1 = fight.createCharacter_v2(res.match.char1);
        tmpChar2 = fight.createCharacter_v2(res.match.char2);
        tmpFight = new fight.Fight(tmpChar1,tmpChar2,res.match.turn);
        callback(tmpFight);
    });
}

function finishFight(winner, losser) {
    database.increaseUserWins(winner);
    database.increaseUserLosses(losser);
    database.finnishGameUser(winner);
    database.finnishGameUser(losser);
    database.removeMatch(winner);

}










function test(){
    tmpChar1 = new fight.Ranger('ranger', 100, 10,1,1,'things');
    tmpChar2 = new fight.Ranger('ranger', 100, 10,1,1,'things');

    //tmpFight = createFight('Pau', 'Vitor',tmpChar1,tmpChar2);
    //tmpFight.progress('Attack');
    //setTimeout(()=>{updateFight('Pau', tmpFight)}, 1000);
    // updateFight('Pau', tmpFight);
    // ----------
    //getFight('Pau', (res)=>{
    //   console.log("get Finght done?");
    //   res.progress('Ability 1');
    //});
    finishFight('Pau', 'Vitor');
}
//timeout has to exist cause node is the worst crap a million donkeys could shit
setTimeout(test,1000);

/*

 */