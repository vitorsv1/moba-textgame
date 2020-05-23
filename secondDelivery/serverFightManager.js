const fight = require('./public/scripts/character');
const database = require('./databaseManagment');
const fs = require('fs');

function getCharfromJsonObj(char,stats) {
    switch (char) {
        case 'archer' || 'ranger': return stats.character1; break;
        case 'warrior' || 'fighter': return stats.character3; break;
        case 'mage': return stats.character2; break;
    }
}


function createFight(user1,user2, char1, char2, callback){
    charStats = JSON.parse(fs.readFileSync('./characterStats.json', 'utf8'));
    selectedChar = getCharfromJsonObj(char1,charStats);
    playerChar1 = fight.createCharacter_v2(selectedChar);
    selectedChar = getCharfromJsonObj(char2,charStats);
    playerChar2 = fight.createCharacter_v2(selectedChar);

    fightObj = new fight.Fight(playerChar1,playerChar2);
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

function updateFight(user, combat, command) {
    database.updateMatch(user,command,()=>{console.log("Fight update completed :)")});
    combat.progress(command);
}

function getFight(user, callback){
    database.getFight(user,(res) =>{
        tmpChar1 = fight.createCharacter_v2(res.match.char1);
        tmpChar2 = fight.createCharacter_v2(res.match.char2);
        tmpFight = new fight.Fight(tmpChar1,tmpChar2);
        res.history.forEach(command => {tmpFight.progress(command);});
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



exports.createFight = createFight;
exports.updateFight = updateFight
exports.getFight = getFight
exports.finishFight = finishFight;






/*function test(){
    tmpChar1 = new fight.Ranger('ranger', 100, 10,1,1,'things');
    tmpChar2 = new fight.Ranger('ranger', 100, 10,1,1,'things');

    tmpFight = createFight('Pau', 'Vitor',tmpChar1,tmpChar2);
    setTimeout(()=>{
        updateFight('Pau', tmpFight, 'Attack');
        updateFight('Vitor', tmpFight, 'Attack');
        updateFight('Pau', tmpFight, 'Attack');
        updateFight('Vitor', tmpFight, 'Attack');
        updateFight('Pau', tmpFight, 'Attack');
        setTimeout(()=>{getFight('Pau',(res)=>{console.log(res.getFightStats());});},1000);}, 1000);
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