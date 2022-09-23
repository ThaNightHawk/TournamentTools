import { TAWebsocket, Packets } from "tournament-assistant-client";
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocket, WebSocketServer } from 'ws';

const server = createServer({
	//Place your SSL certificate and key in `Keys`
  cert: readFileSync('./Keys/cert.pem'),
  key: readFileSync('./Keys/privkey.pem')
});

let InMatch = false;
let matchData = [];
let songData = ["",0];
let score = [0,0];

const taWebsocket = new TAWebsocket({
    url: "ws://TAServerIP:OverlayPort",
    name: "TAOverlay",
    id: "TAOverlay",
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
  ws.send(JSON.stringify({'Type': '0','message': 'You\'ve connected to the relay server.'}));
  ws.on('message', function message(data) {
    //Check if type is 69, if so close connection to TA server
    let jsonObj = JSON.parse(data);
    if (jsonObj.Type == "69" && jsonObj.message == "Close") {
      console.log("Closed connection to TA server");
      taWebsocket.close();
    }
  });
});
server.listen(2223);

const ws = new WebSocket(`wss://domain.com:2223`, {rejectUnauthorized: false});
let sockets = ws;

taWebsocket.taClient.on('matchCreated', async (e) => {
	let self = taWebsocket.taClient;
	let taPackets = Packets;
	let coordinator;
	if (!InMatch) {

		e.data.associated_users.push(self.Self);

		taWebsocket.sendEvent(new taPackets.Event({
			match_updated_event: new taPackets.Event.MatchUpdatedEvent({ match: e.data })
		}));

		for (var i = 0; i < e.data.associated_users.length; i++) {
			coordinator = e.data.leader.name;
			if (e.data.associated_users[i].user_id != 0 && e.data.associated_users[i].user_id != "DaneSaberOverlay") {
				matchData.push(e.data.associated_users[i].user_id);
				console.log("Player " + [i + 1] + ": " + matchData[i] + " | " + e.data.associated_users[i].name);
			}
		}
		sockets.send(JSON.stringify({ 'Type': '1', 'userid': matchData, 'coordinator': coordinator, 'order': i - 2 }));
		InMatch = true;
		console.log("Match created, backend locked by coordinator " + coordinator);
	}
});

taWebsocket.taClient.on('matchDeleted', async (e) => {
	if (matchData[0] == e.data.associated_users[0].user_id) {
		sockets.send(JSON.stringify({ 'Type': '2' }));
		matchData.length = 0;
		InMatch = false;
		console.log("Match deleted, backend unlocked.");
	}
});

taWebsocket.taClient.on('matchUpdated', (e) => {
	if (matchData[0] == e.data.associated_users[0].user_id) {
		if (typeof e.data.selected_level != "undefined") {
			if (songData[0] != e.data.selected_level.level_id || songData[1] != e.data.selected_difficulty) {
				sockets.send(JSON.stringify({ 'Type': '3', 'LevelId': e.data.selected_level.level_id, 'Diff': e.data.selected_difficulty }));
				songData = [e.data.selected_level.level_id, e.data.selected_difficulty];
			}
		}
	}
});

taWebsocket.taClient.on('userUpdated', async (e) => {
	if (matchData.includes(e.data.user_id)) {
		setTimeout(function () {
			sockets.send(JSON.stringify({ 'Type': '4', 'playerId': e.data.user_id, 'score': e.data.score, 'combo': e.data.combo, 'acc': e.data.accuracy }));
		}, e.data.stream_delay_ms);
	}
});
