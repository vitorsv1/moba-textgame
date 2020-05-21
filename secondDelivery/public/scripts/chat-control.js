class chat_control {
    constructor() {
        this.msg_list = $('.msg-group');
    }

    //MESSAGES FROM USER ARE IN RIGHT SIDE
    send_msg(name, msg) {
        this.msg_list.append(this.get_msg_html(name, msg, 'right'));
        this.scroll_to_bottom(); 
    }

    //MESSAGES FROM SERVER ARE IN LEFT SIDE
    receive_msg(name, msg) {
        this.msg_list.append(this.get_msg_html(name, msg, 'left'));
        this.scroll_to_bottom(); 
    }

    //HTML FOR MESSAGES
    get_msg_html(name, msg, side) {
        var msg_temple = `
            <div class="card">
                 <div class="card-body">
                     <h6 class="card-subtitle mb-2 text-muted text-${side}">${name}</h6>
                     <p class="card-text float-${side}">${msg}</p>
                 </div>
            </div>
            `;
        return msg_temple;
    }

    //SCROLL
    scroll_to_bottom() {
        this.msg_list.scrollTop(this.msg_list[0].scrollHeight);
    }
}



send_button = $('button') // get jquery element from html table name
input_box = $('#input-box') // get jquery element from div id
// also you could get it by $('.form-control') or $('textarea')

//REGEX HANDLE FUCTION
function handle_msg(msg) {
    msg = msg.trim()
    msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br>')
    return msg
}

function send_msg() {
    msg = handle_msg(input_box.val());
    if (msg != '') {
        chat.send_msg('USER', msg);
        input_box.val('');
        return msg
    }
}



console.log("FIGHT TEST");

//load charachters' stats from json file
$.getJSON('./characterStats.json', function (data) {
    if(window.localStorage.getItem('trophy')==null) window.localStorage.setItem('trophy', '0');
    trophy = parseInt(window.localStorage.getItem('trophy'));
    ranger = new createCharacter(Ranger, data.character1.name, data.character1.hp + trophy*3,data.character1.attack + trophy*2, data.character1.ability1CD, data.character1.ability2CD,data.character1.description);
    mage = new createCharacter(Mage, data.character2.name, data.character2.hp + trophy*3,data.character2.attack + trophy*2, data.character2.ability1CD, data.character2.ability2CD,data.character2.description);
    fighter = new createCharacter(Fighter, data.character3.name, data.character3.hp + trophy*3,data.character3.attack + trophy*2, data.character3.ability1CD, data.character3.ability2CD,data.character3.description);
    const urlParams = new URLSearchParams(window.location.search);
    let char1;
    switch (urlParams.get('char1')) {
        case 'archer': char1 = ranger; break;
        case 'warrior': char1 = fighter; break;
        case 'mage': char1 = mage; break;
        default: throw "wrong char1 parameter: "+ urlParams;
    }
    game = new Fight(char1,fighter);

    console.log(char1.describe());
});

var chat = new chat_control();
chat.receive_msg('FIGHT', 'The Fight has been started!! Good luck my friend');

var input = document.getElementById("send-btn");

var audio = document.getElementById("audio");
audio.volume = 0.1;


function chatEventHandler(){

    if (input_box.val() != ''){
        let command = handle_msg(input_box.val());
        chat.send_msg(game.getUserCharName(), command);
        try{
            game.progress(command);

        }catch (e) {
            if(window.localStorage.getItem('wins')==null) window.localStorage.setItem('wins', '0');
            if(window.localStorage.getItem('losses')==null) window.localStorage.setItem('losses', '0');
            if(window.localStorage.getItem('trophy')==null) window.localStorage.setItem('trophy', '0');
            if(e == 'player 1 won') {
                alert('You win!!!');
                window.localStorage.setItem('wins', (parseInt(window.localStorage.getItem('wins'))+1).toString());
                window.localStorage.setItem('trophy', (parseInt(window.localStorage.getItem('trophy'))+1).toString());
            }
            else  if (e =='player 2 won') {
                alert('You lost :(');
                window.localStorage.setItem('losses', (parseInt(window.localStorage.getItem('losses'))+1).toString());
                
                let trophy = parseInt(window.localStorage.getItem('trophy'))-1;
                if(trophy <= 0) trophy=0;

                window.localStorage.setItem('trophy', trophy.toString());
            }
            else alert(e);
        }
        chat.send_msg(game.getUserCharName(), game.getUserStats());
        chat.receive_msg(game.getEnemyCharName(),game.getEnemyStats());
        console.log(game.getFightStats());
    }}

input.addEventListener('click', chatEventHandler, false);

//send_button.on('click', send_msg.bind());
input_box.on('keyup', box_key_pressing.bind());

//SOME NICE FAST SEND KEYS AND EXIT
function box_key_pressing() {
    // control + enter was pressed
    if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
        chatEventHandler();
    }
    // esc was pressed
    if (event.keyCode === 27) {
        input_box.blur();
    }
}


console.log("DONE LOADING");

 /**/