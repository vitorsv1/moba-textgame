var score = window.localStorage.getItem('wins');
var losses = window.localStorage.getItem('losses');

if(score === null || losses === null){
    window.localStorage.setItem('wins', '0');
    window.localStorage.setItem('losses', '0');
    score = 0;
    losses = 0;
}

document.getElementById('score').innerHTML = `<h1 class="display-4 text-center">Winnings: ${score}</h1>
                                              <h1 class="display-4 text-center">Losses: ${losses}</h1>`;


