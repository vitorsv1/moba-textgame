let aaaa = require('./character');

let rlSync = require('readline-sync'); //npm install readline-sync to use this test
console.log("--------begin test");


mage = aaaa.createCharacter(aaaa.Mage, "veigar :)", 15, 2, 2,3,"test desc");
fighter = new aaaa.createCharacter(aaaa.Fighter, "sett :)", 20,5, 2,3, "test descript");
ranger = new aaaa.createCharacter(aaaa.Ranger, "ashe :)", 10, 10, 2,3, "test descri");
game = new aaaa.Fight(mage,fighter);

console.log(mage.describe());

while (true) {
    let command = rlSync.question("next turn: ");
    game.progress(command);
    console.log(game.getFightStatus());
}
console.log("WTF");