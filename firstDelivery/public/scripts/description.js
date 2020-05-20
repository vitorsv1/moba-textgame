console.log('Description');

$.getJSON('./characterStats.json', function (data) {
    // ranger = new createCharacter(Ranger, data.character1.name, data.character1.hp,data.character1.attack, data.character1.ability1CD, data.character1.ability2CD,data.character1.description);
    // mage = new createCharacter(Mage, data.character2.name, data.character2.hp,data.character2.attack, data.character2.ability1CD, data.character2.ability2CD,data.character2.description);
    // fighter = new createCharacter(Fighter, data.character3.name, data.character3.hp,data.character3.attack, data.character3.ability1CD, data.character3.ability2CD,data.character3.description);
    
    console.log(document.getElementById('archer-desc'));

    document.getElementById('archer-desc').innerHTML = `<blockquote class="blockquote text-left">
                                                            <p class="mb-0">Description: ${data.character1.description}.</h3>
                                                            <p class="mb-0">HP: ${data.character1.hp}</h3>
                                                            <p class="mb-0">Attack: ${data.character1.attack}</h3>
                                                            <p class="mb-0">Ability 1 Couldown: ${data.character1.ability1CD} turns</h3>   
                                                            <p class="mb-0">Ability 2 Couldown: ${data.character1.ability2CD} turns</h3>
                                                        </blockquote>`;
    
    document.getElementById('mage-desc').innerHTML = `<blockquote class="blockquote text-left">
                                                        <p class="mb-0">Description: ${data.character2.description}.</h3>
                                                        <p class="mb-0">HP: ${data.character2.hp}</h3>
                                                        <p class="mb-0">Attack: ${data.character2.attack}</h3>
                                                        <p class="mb-0">Ability 1 Couldown: ${data.character2.ability1CD} turns</h3>   
                                                        <p class="mb-0">Ability 2 Couldown: ${data.character2.ability2CD} turns</h3>
                                                      </blockquote>`;

    document.getElementById('warrior-desc').innerHTML = `<blockquote class="blockquote text-left">
                                                             <p class="mb-0">Description: ${data.character3.description}.</h3>
                                                             <p class="mb-0">HP: ${data.character3.hp}</h3>
                                                             <p class="mb-0">Attack: ${data.character3.attack}</h3>
                                                             <p class="mb-0">Ability 1 Couldown: ${data.character3.ability1CD} turns</h3>   
                                                             <p class="mb-0">Ability 2 Couldown: ${data.character3.ability2CD} turns</h3>
                                                         </blockquote>`;
});



