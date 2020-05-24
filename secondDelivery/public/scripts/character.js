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
		if(this.currentCd != 0 ) throw "ability on cooldown!!!"
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
		return "HP: " + this.hp + ", Attack: " + this.attack + ", Ability1 Cooldown: " + this.ability1.currentCd + ", Ability2 Cooldown: " + this.ability2.currentCd;
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


function createCharacter_v2(attributes){
	let tmp;
	switch (attributes.name) {
		case "ranger" :
			tmp = new Ranger();
			break;
		case "mage" :
			tmp = new Mage();
			break;
		case "fighter":
			tmp = new Fighter();
			break;
		case "a":
			tmp = new Fighter();
			break;
		default: console.log("couldn't find charachter type" + attributes.name);
	}
	tmp.name = attributes.name;
	tmp.hp = attributes.hp;
	tmp.attack = attributes.attack;
	tmp.description = attributes.description;
	return  tmp;
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
		this.ability2 = new Ability(cd2, new Modifier(5,function (target) {target.attack -= target.attack/2;},EMPTY, function (target) {target.attack += target.attack;}),"Half enemy's attack damage for the next 5 turns",1);
	}
}
//Ranger character
//-----------
class Ranger extends Characther{
	constructor(name, hp, attack, cd1, cd2,description) {
		super(name,hp,attack,null, null,description);
		this.ability1 = new Ability(cd1, new Modifier(5,function (target) {target.attack += target.attack/2;},EMPTY, function (target) {target.attack -= target.attack/3;}),"Increase your attack by 50%",0);
		this.ability2 = new Ability(cd2, new Modifier(0,function (target) {target.hp += 7;},EMPTY, EMPTY),"Heal for 7 hp",0);
	}
}

//--------------------------------------------------------------
//-------------------------FIGHT--------------------------------
//--------------------------------------------------------------

class Fight{
	constructor(char1,char2,turn, finnished){
		this.char1 = char1;
		this.char2 = char2;
		if(turn == undefined)this.turn = 1;
		else this.turn = turn;
		if(finnished == undefined)this.finnished = 0;
		else this.finnished = finnished;
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

	getFightStats(){
		return "player 1: " + this.char1.getStats() + "<br> player 2: " + this.char2.getStats();
	}

	getUserCharName(){
		return this.char1.name;
	}

	getEnemyCharName(){
		return this.char2.name;
	}

	getUserStats(){
		return this.char1.getStats();
	}

	getEnemyStats(){
		return this.char2.getStats();
	}

}
//////MODULE EXPORTS/////////
try {
	exports.Fighter = Fighter;
	exports.Mage = Mage;
	exports.Ranger = Ranger;
	exports.Fight = Fight;
	exports.createCharacter = createCharacter;
	exports.createCharacter_v2 = createCharacter_v2;
}catch (e) {}// so clients dont complain

