var socket = io('http://localhost:3000');

var audio = document.getElementById("audio");
audio.volume = 0.1;

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                    .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}
var turn = false;
var charName = $.urlParam('char1');
var user_name = window.localStorage.getItem('username');


function renderMessage(messageObject, side){
    
    $('.messages').append(`<div class="card">
    <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted text-${side}">${messageObject.charname}</h6>
    <p class="card-text float-${side}">${messageObject.message}</p>
    </div>
    </div>`);
    
    $('.msg-group').scrollTop($('.msg-group')[0].scrollHeight);
}

//--------------- SOCKET PART ---------------//
socket.emit('joinRoom', JSON.stringify({username : user_name, char: charName}));

socket.on('start game', ()=>{
    var messageObject = {
            id: socket.id,
            charname: "Server",
            message: "The game has been started"
        };
    renderMessage(messageObject,'left');
});

socket.on('your turn', ()=>{
    turn = true;
    var messageObject = {
            id: socket.id,
            charname: "Server",
            message: "You start the fight"
        };
    renderMessage(messageObject,'left');
});

socket.on('send command', (messageObject)=>{
    turn = !turn;
    var messageObject = JSON.parse(messageObject);
    console.log(messageObject);
    if(messageObject.id == socket.id){
        renderMessage(messageObject, 'right');
    }
    else{
        renderMessage(messageObject, 'left');
    }
});

socket.on('game finished', (message)=>{
    var message = "The game finished, " + message + "won!!";
    var msg = {
            id: socket.id,
            charname: "Server",
            message: message
        };
    renderMessage(msg,'left');
});

$('#send-btn').click(function(event){
    event.preventDefault();

    let message = $('#input-box').val();
    let commands = ["Attack", "Ability 1", "Ability 2"];
    
    if (message.length){
        var messageObject = {
            id: socket.id,
            username: user_name,
            charname: charName,
            message: message
        };

        renderMessage(messageObject, 'right');

        if(commands.includes(message)){
            if(turn) socket.emit('new command', JSON.stringify(messageObject));
            else alert('Wait for your turn');
        }
        else{
            socket.emit('new message', JSON.stringify(messageObject));
        }
    }
});

$('#logout-btn').click(function(event){
    $.get("/logout", function(data, status){
        alert("You've logged out");
        window.location.replace("http://localhost:3000");
    });
});