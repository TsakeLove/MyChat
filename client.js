const socket = io.connect("https://tsake-chat.herokuapp.com");
let user = '';

window.onload = function () {
    let users = new Set();
    let users_container = document.getElementById('userlist');
    let message_container = document.getElementById('messages');

    message_container.style.height = window.innerHeight - 200 + 'px';

    let btn = document.getElementById('btn');

    let message_input = document.getElementById('inp');


    // загрузить имена пользователей, которые online
    socket.emit('load users');
    socket.on('users loaded', function (data) {

        let display_users = data.users.map((username) => {

             return `<li>${username}</li>`;
        });

        users_container.innerHTML = display_users.join(' ');
    });

    // загрузить сообщения других пользователей (при загрузке страницы)
    socket.emit('load messages');
    socket.on('messages loaded', function (data) {

        let display_messages = data.messages.map((msg) => {

            return (`<div class ="panel well">
                         <h4>${msg.author}</h4>
                         <h5>${msg.text}</h5>
                    </div>`)
        });

        message_container.innerHTML = display_messages.join(' ');
    });

    // загрузить текущее сообщение
    socket.on('chat message', function (message) {
        console.log(message)
        let display_message = `<div class ="panel well">
                                   <h4>${message.author}</h4>
                                   <h5>${message.text}</h5>
                               </div>`
        message_container.innerHTML += display_message;

    });

    // получить имя пользователя 
    socket.on('new user', function (data) {

        user = data.name;
    })

    window.addEventListener ("keypress", function (e) {
        if (e.keyCode !== 13) return;
        if (message_input.value!="") {
            socket.emit('send message', {text: message_input.value, author: user});
            document.getElementById("inp").value = "";
        }
    });

    btn.onclick = function () {
        // сгенерировать событие отправки сообщения

        if (message_input.value!="") {
            socket.emit('send message', {text: message_input.value, author: user});
            document.getElementById("inp").value = "";
        }

    }
}
