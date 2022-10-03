import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocket, WebSocketServer } from 'ws';

const server = createServer({
	cert: readFileSync('./Keys/cert.pem'),
	key: readFileSync('./Keys/privkey.pem')
});

const wss = new WebSocketServer({ server });
wss.on('connection', function connection(ws) {
	ws.on('message', function message(data, isBinary) {
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data, { binary: isBinary });
			}
		});
	});
	ws.send(JSON.stringify({ 'Type': '0', 'message': 'You\'ve connected to the Tournament relay server.' }));
});
server.listen(2223); //Change your WSS port here