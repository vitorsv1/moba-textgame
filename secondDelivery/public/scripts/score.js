var audio = document.getElementById("audio");
audio.volume = 0.1;


$.getJSON('/userStats',(data) => {

    window.localStorage.setItem('wins', data.wins);
    window.localStorage.setItem('losses', data.losses);
    window.localStorage.setItem('trophy', data.trophy);

    var score = window.localStorage.getItem('wins');
    var losses = window.localStorage.getItem('losses');
    var trophy = window.localStorage.getItem('trophy');

    document.getElementById('score').innerHTML = `<h1 class="display-4 text-center">Winnings: ${score}</h1>
                                              <h1 class="display-4 text-center">Losses: ${losses}</h1>
                                              <h1 class="display-4 text-center">Number of Trophies: ${trophy}</h1>
                                              <h4 class="mark text-center">Each trophy makes your HP and Attack status higher</h4>`;


});

$('#logout-btn').click(function(event){
    $.get("/logout", function(data, status){
        alert("You've logged out");
        window.location.replace("http://localhost:3000");
    });
});

/*
if(window.localStorage.getItem('wins') == null) window.localStorage.setItem('wins', '0');
if(window.localStorage.getItem('losses') == null) window.localStorage.setItem('losses', '0');
if(window.localStorage.getItem('trophy') == null) window.localStorage.setItem('trophy', '0');

var score = window.localStorage.getItem('wins');
var losses = window.localStorage.getItem('losses');
var trophy = window.localStorage.getItem('trophy');



document.getElementById('score').innerHTML = `<h1 class="display-4 text-center">Winnings: ${score}</h1>
                                              <h1 class="display-4 text-center">Losses: ${losses}</h1>
                                              <h1 class="display-4 text-center">Number of Trophies: ${trophy}</h1>
                                              <h4 class="mark text-center">Each trophy makes your HP and Attack status higher</h4>`;

 */

