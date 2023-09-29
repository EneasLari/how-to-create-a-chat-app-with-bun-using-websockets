// Creating a new WebSocket instance
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', (event) => {
    var sayhi = {
        "type": "SENDTOSERVER",
        "payload": {
            "message": "Hello server, How are you?"
        }
    }
    socket.send(JSON.stringify(sayhi));
    document.getElementById("logging").innerText += "\n" + "You sent this mesage to the server: " + sayhi.payload.message

    document.getElementById("sendmessagebutton").addEventListener("click", () => {
        var newmessage = {
            "type": "BROADCAST",
            "payload": {
                "author": "A USER",
                "message": "Hi everyone!"
            }
        }
        socket.send(JSON.stringify(newmessage))
        document.getElementById("logging").innerText += "\n" + "You sent this mesage for broadcasting to the server: " + newmessage.payload.message
    })
    document.getElementById("sendtoserver").addEventListener("click", () => {
        var newmessage = {
            "type": "SENDTOSERVER",
            "payload": {
                "author": "A USER",
                "message": "This message is for server only"
            }
        }
        socket.send(JSON.stringify(newmessage))
    })
});

// Listen for messages
socket.addEventListener('message', (event) => {
    try {
        var message = JSON.parse(event.data);
        if (message.type === 'BROADCAST') {
            document.getElementById("logging").innerText += "\n" + "A client broadcasted: " + message.payload.message
        } else {
            document.getElementById("logging").innerText += "\n" + "You received this message: " + message.payload.message
        }

    } catch (e) {
        console.log('Wrong format');
        return;
    }
});

// Connection closed
socket.addEventListener('close', (event) => {
    console.log('Server connection closed:', event.data);
});