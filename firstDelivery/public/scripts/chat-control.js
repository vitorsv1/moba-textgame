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

//SOME NICE FAST SEND KEYS AND EXIT
function box_key_pressing() {
    // control + enter was pressed
    if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
        send_msg();
    }
    // esc was pressed
    if (event.keyCode === 27) {
        input_box.blur();
    }
}

//send_button.on('click', send_msg.bind());
input_box.on('keyup', box_key_pressing.bind());


console.log("FIGHT TEST");

mage = new createCharacter(Mage, "Mage", 15, 2, 2,3,"Magic are powerfull in this char");
fighter = new createCharacter(Fighter, "Fighter", 20,5, 2,3, "Basic attacks it's his strong ability");
ranger = new createCharacter(Ranger, "Ranger", 10, 10, 2,3, "Attacks and magics can be great");

game = new Fight(mage,fighter);

console.log(mage.describe());

var chat = new chat_control();
chat.receive_msg('FIGHT', 'Fight Starts');

var input = document.getElementById("send-btn");
console.log(input);


input.addEventListener('click', function(){

    if (input_box.val() != ''){
        let command = handle_msg(input_box.val());
        chat.send_msg(game.getUserCharName(), command);
        game.progress(command);
        chat.send_msg(game.getUserCharName(), game.getUserStats());
        chat.receive_msg(game.getEnemyCharName(),game.getEnemyStats());
        console.log(game.getFightStats());
}}, false);

console.log("WTF");