const wsserver = Bun.serve({
    port: 8080,
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response("Upgrade failed :(", { status: 500 });
    }, // upgrade logic
    websocket: {
        async message(ws, msg) {
            console.log("Message was received from server:", msg)
            var message;
            try {
                message = JSON.parse(msg.toString());

            } catch (e) {
                console.log('Wrong format');
                return;
            }

            if (message.type === 'BROADCAST') {
                // Broadcast the message to all connected clients
                var newmessage = {
                    "type": "BROADCAST",
                    "payload": {
                        "author": "Server",
                        "message": message.payload.message
                    }
                }
                ws.publish("chat",JSON.stringify(newmessage))
            }
            if (message.type === 'SENDTOSERVER') {
                var respond = {
                    "type": "SERVER_MESSAGE",
                    "payload": {
                        "author": "Server",
                        "message": "I received your message:<<" + message.payload.message + ">>"
                    }
                }
                ws.send(JSON.stringify(respond));
            }




        }, // a message is received
        async open(ws) {
            ws.subscribe("chat")
            console.log("Connection opened and you subscribed on chat")
        }, // a socket is opened
        async close(ws, code, message) {
            console.log("Connection closed")
        }, // a socket is closed
        async drain(ws) { }, // the socket is ready to receive more data
    },
});

console.log(`Listening on ${wsserver.hostname}:${wsserver.port}`);