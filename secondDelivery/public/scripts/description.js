console.log('Description');

var audio = document.getElementById("audio");
audio.volume = 0.1;

$.getJSON('./characterStats.json', function (data) {
    
    console.log(document.getElementById('archer-desc'));

    document.getElementById('archer-desc').innerHTML = `<blockquote class="blockquote text-left">
                                                            <p class="mb-0">Description: ${data.character1.description}.</h3>
                                                            <p class="mb-0">HP: ${data.character1.hp}</h3>
                                                            <p class="mb-0">Attack: ${data.character1.attack}</h3>
                                                            <p class="mb-0">Ability 1 Cooldown: ${data.character1.ability1CD} turns</h3>   
                                                            <p class="mb-0">Ability 2 Cooldown: ${data.character1.ability2CD} turns</h3>
                                                        </blockquote>`;
    
    document.getElementById('mage-desc').innerHTML = `<blockquote class="blockquote text-left">
                                                        <p class="mb-0">Description: ${data.character2.description}.</h3>
                                                        <p class="mb-0">HP: ${data.character2.hp}</h3>
                                                        <p class="mb-0">Attack: ${data.character2.attack}</h3>
                                                        <p class="mb-0">Ability 1 Cooldown: ${data.character2.ability1CD} turns</h3>   
                                                        <p class="mb-0">Ability 2 Cooldown: ${data.character2.ability2CD} turns</h3>
                                                      </blockquote>`;

    document.getElementById('warrior-desc').innerHTML = `<blockquote class="blockquote text-left">
                                                             <p class="mb-0">Description: ${data.character3.description}.</h3>
                                                             <p class="mb-0">HP: ${data.character3.hp}</h3>
                                                             <p class="mb-0">Attack: ${data.character3.attack}</h3>
                                                             <p class="mb-0">Ability 1 Cooldown: ${data.character3.ability1CD} turns</h3>   
                                                             <p class="mb-0">Ability 2 Cooldown: ${data.character3.ability2CD} turns</h3>
                                                         </blockquote>`;
});

$('#logout-btn').click(function(event){
    $.get("/logout", function(data, status){
        alert("You've logged out");
        window.location.replace("http://localhost:3000");
    });
});


