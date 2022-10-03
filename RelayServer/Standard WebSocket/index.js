import { WebSocket, WebSocketServer } from "ws";

// This is your relay-server port
var port = 2003;
const wss = new WebSocketServer({ "port": port });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
	ws.send(JSON.stringify({'Type': '0','message': 'You\'ve connected to the relay server.'}));
});

let sockets = new WebSocket("ws://localhost:2003");
sockets.onopen = function (event) {
    console.log("Connected to Relay server");
};