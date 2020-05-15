//Generic classes
// ==============
class Ability {
	constructor(cd, modifier,description, attackOrDefense) {
		this.cd = cd;
		this.currentCd = 0;
		this.modifier = modifier;
		this.description = description;
		this.attackOrDefense = attackOrDefense; //'1' targets the enemy, '0' targets himself
	}

	useAbility(target){
		if(this.currentCd != 0 ) throw "ability on cooldwon!!!"
		this.currentCd = this.cd;
		target.recieve(this.modifier.clone());
	}

	turnPass(){
		if(this.currentCd>0) --this.currentCd;
	}
}
//-----
class Modifier{
	constructor(duration, initialModification, overTimeModification, endModification) {
		this.duration = duration;
		this.initialModification = initialModification;
		this.overTimeModification = overTimeModification;
		this.endModification = endModification;
	}
	clone(){
		return new Modifier(this.duration, this.initialModification, this.overTimeModification, this.endModification);
	}
	applyInitial(target){this.initialModification(target);}
	applyOverTime(target){
		this.overTimeModification(target);
		--this.duration;
	}
	end(target){this.endModification(target);}
}
//-----
class Characther{
	constructor(name, hp, attack, ability1, ability2,description){
		this.name = name;
		this.hp = hp;
		this.attack = attack;
		this.ability1 = ability1;
		this.ability2 = ability2;
		this.modifiers = new Array();
		this.description = description;
	}

	recieve(modifier){
		modifier.applyInitial(this);
		if(modifier.duration>0)this.modifiers.push(modifier);
	}

	doAttack(target){
		target.recieve(new BasicAttack(this.attack));
	}

	doAbility1(target){
		if(this.ability1.attackOrDefense) this.ability1.useAbility(target);
		else this.ability1.useAbility(this);
	}

	doAbility2(target){
		if(this.ability1.attackOrDefense) this.ability2.useAbility(target);
		else this.ability2.useAbility(this);
	}

	turnPass(){
		this.ability1.turnPass();
		this.ability2.turnPass();
		for(let tmp of this.modifiers){
			tmp.applyOverTime(this);
			if(tmp.duration == 0){
				tmp.end(this);
				this.modifiers.splice(this.modifiers.indexOf(tmp));
			}
		}
	}

	getStats(){
		return "name: " + this.name + ", hp: " + this.hp + ", attack: " + this.attack + ", Ability1 Cooldown: " + this.ability1.currentCd + ", Ability2 Cooldown: " + this.ability2.currentCd;
	}

	isDead(){
		return this.hp <= 0;
	}

	describe(){
		return this.description + '\n Ability 1: ' + this.ability1.description + '\n Ability 2: ' + this.ability2.description;
	}

}
//----
//class extensions
//----
class BasicAttack extends Modifier{
	constructor(attack) {
		super(0, function (target){target.hp -= attack;}, null);
	}
}
//-----
//aux functions
//----------
function EMPTY() {}

function createCharacter(CharTypeConstructor, name, hp, attack, cd1,cd2, description){
	return new CharTypeConstructor(name,hp,attack,cd1,cd2, description);
}
//--------------------------------------------------------------
//-----------------------CHARACTERS-----------------------------
//--------------------------------------------------------------
//Mage character
//-----------
class Mage extends Characther{
	constructor(name, hp, attack, cd1, cd2, description) {
		super(name,hp,attack,null, null, description);
		this.ability1 = new Ability(cd1, new Modifier(0,function (target) {target.hp -= target.hp/4;},EMPTY,EMPTY),"Deal 25% on the enemy's current hp as dmg",1);
		this.ability2 = new Ability(cd2, new Modifier(10, EMPTY , function (target) {target.hp +=3;},EMPTY,EMPTY),"Heals 3 hp each turn for the next 10 turns (30 hp)",0);
	}
}
//Fighter character
//-----------
class Fighter extends Characther{
	constructor(name, hp, attack, cd1, cd2,description) {
		super(name,hp,attack,null, null,description);
		this.ability1 = new Ability(cd1, new Modifier(2,function (target) {target.hp += target.hp;},EMPTY, function (target) {target.hp -= target.hp/2;}),"Double your hp for the next 2 turns",0);
		this.ability2 = new Ability(cd2, new Modifier(5,function (target) {target.attack -= target.hp/2;},EMPTY, function (target) {target.attack += target.attack;}),"Half enemy's attack damage for the next 5 turns",1);
	}
}
//Ranger character
//-----------
class Ranger extends Characther{
	constructor(name, hp, attack, cd1, cd2,description) {
		super(name,hp,attack,null, null,description);
		this.ability1 = new Ability(cd1, new Modifier(5,function (target) {target.attack += target.hp/2;},EMPTY, function (target) {target.attack -= target.attack;}),"Double your hp for the next 2 turns",0);
		this.ability2 = new Ability(cd2, new Modifier(0,function (target) {target.hp += 7;},EMPTY, EMPTY),"Heal for 7 hp",0);
	}
}

//--------------------------------------------------------------
//-------------------------FIGHT--------------------------------
//--------------------------------------------------------------

class Fight{
	constructor(char1,char2){
		this.char1 = char1;
		this.char2 = char2;
		this.turn = 0;
	}

	progress(command){
		let attacker = this.turn?this.char1:this.char2;
		let defendant = !this.turn?this.char1:this.char2;
		switch (command) {
			case "Attack": attacker.doAttack(defendant);
			break;
			case "Ability 1": attacker.doAbility1(defendant);
			break;
			case "Ability 2" : attacker.doAbility2(defendant);
			break;
			default: throw "Not a valid comand :)";
		}
		this.turn = !this.turn;
		attacker.turnPass();
		if(this.char1.isDead()) throw "player 2 won";
		if(this.char2.isDead()) throw "player 1 won";
	}

	getFightStatus(){
		return this.char1.getStats() + "\n" + this.char2.getStats();
	}
}
//////MODULE EXPORTS/////////
exports.createCharacter = createCharacter;
// createCharacter(CharTypeConstructor, name, hp, attack, cd1,cd2)
//						¨^               ^
//	class constructor of its character//rest of stats from json file
//
exports.Fighter = Fighter;
exports.Mage = Mage;
exports.Ranger = Ranger;
exports.Fight = Fight;
//

///////////tests begin/////
/*
let rlSync = require('readline-sync');
console.log("--------begin test");


mage3 = new Mage("mageClass", 15, 2, 2,3);
fighter = new Fighter("fighter", 20,5, 2,3);
ranger = new Ranger("Ranger", 10, 10, 2,3);
game = new Fight(mage3,fighter);

while (true) {
	let command = rlSync.question("next turn: ");
	game.progress(command);
	console.log(game.getFightStatus());
}
console.log("WTF");
*/

//-----------------------------------------
/*function inital(target){
	target.hp -= 10;
};

function poison(target){
	target.hp -= 2;
}
modifier1 = new Modifier(0,inital);
modifieer2 = new Modifier(2, function (target) {}, poison);
ability1 = new Ability(4, modifier1,"", 1);
ability2 = new Ability(2, modifieer2, "",1);
mage = new Characther("mage",100,2,ability1,ability2);
mage2 = new Characther("mage2",100,2,ability1,ability2);
mage3 = new Mage("mageClass", 10, 2, 2,3);
mage3.doAbility1(mage);


printFightStatus(mage,mage2);
console.log("------begin fight");
mage.doAttack(mage2);
mage2.doAbility2(mage);
printFightStatus(mage,mage2);
mage.turnPass();
mage2.turnPass();
console.log("---next turn 1");
printFightStatus(mage,mage2);
mage.turnPass();
mage2.turnPass();
console.log("---next turn 2");
printFightStatus(mage,mage2);
mage.turnPass();
mage2.turnPass();
console.log("---next turn 3");
printFightStatus(mage,mage2);
*/
