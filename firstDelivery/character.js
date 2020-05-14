//Generic classes
// ==============
class Ability {
	constructor(cd, modifier,description) {
		this.cd = cd;
		this.currentCd = 0;
		this.modifier = modifier;
		this.description = description;
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
	constructor(duration, initialModification, overTimeModification) {
		this.duration = duration;
		this.initialModification = initialModification;
		this.overTimeModification = overTimeModification;
	}
	clone(){
		return new Modifier(this.duration, this.initialModification, this.overTimeModification);
	}
	applyInitial(target){this.initialModification(target);}
	applyOverTime(target){
		this.overTimeModification(target);
		--this.duration;
	}
	end(target){}
}
//-----
class Characther{
	constructor(name, hp, attack, ability1, ability2){
		this.name = name;
		this.hp = hp;
		this.attack = attack;
		this.ability1 = ability1;
		this.ability2 = ability2;
		this.currentHp = hp;
		this.modifiers = new Array();
	}

	recieve(modifier){
		modifier.applyInitial(this);
		if(modifier.duration>0)this.modifiers.push(modifier);
	}

	doAttack(target){
		target.recieve(new BasicAttack(this.attack));
	}
	doAbility1(target){
		this.ability1.useAbility(target);
	}

	doAbility2(target){
		this.ability2.useAbility(target);
	}

	turnPass(){
		this.ability1.turnPass;
		this.ability2.turnPass;
		for(let tmp of this.modifiers){
			tmp.applyOverTime(this);
			if(tmp.duration == 0){
				tmp.end();
				this.modifiers.splice(this.modifiers.indexOf(tmp));
			}
		}
	}

	isDead(){
		return this.hp <= 0;
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
function printFightStatus(char1,char2){
	console.log(char1.name + " hp: " + char1.hp);
	console.log(char2.name + " hp: " + char2.hp);
}

function createCharacter(){} 
//--------------------------------------------------------------
//-----------------------CHARACTERS-----------------------------
//--------------------------------------------------------------
//Mage character
//-----------


///////////test begin/////

console.log("--------begin test");

function inital(target){
	target.hp -= 10;
};

function poison(target){
	target.hp -= 2;
}
modifier1 = new Modifier(0,inital);
modifieer2 = new Modifier(2, function (target) {}, poison);
ability1 = new Ability(4, modifier1);
ability2 = new Ability(2, modifieer2);
mage = new Characther("mage",100,2,ability1,ability2);
mage2 = new Characther("mage2",100,2,ability1,ability2);



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

