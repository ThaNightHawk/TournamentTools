// Simple application file that initialized the web page (NOT TO BE USED WITH OBS AS A OVERLAY)
import { TAWebsocket, Packets } from "tournament-assistant-client";
import { WebSocket, WebSocketServer } from "ws";
let InMatch = false;
let matchData = [];
let songData = ["",0];
let score = [0,0];
let coordinator;
// This is your relay-server port
var port = 2223;
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
  	ws.on('message', function message(data) {
  	  //Check if type is 69, if so close connection to TA server
  	  let jsonObj = JSON.parse(data);
  	  if (jsonObj.Type == "69" && jsonObj.message == "Close") {
  	    console.log("Closed connection to TA server");
  	    taWebsocket.close();
  	  }
  	});
});

const taWebsocket = new TAWebsocket({
    url: "ws://TAServerIP:OverlayPort",
    name: "TAOverlay",
    id: "TAOverlay",
});
//Connect to the relay server we created above. - Make sure your frontend is connecting to THIS ip.
let sockets = new WebSocket("ws://localhost:2223");
//If the connection is opened successfully, we tell the user that.
sockets.onopen = function (event) {
    console.log("Connected to Relay server");
};
taWebsocket.taClient.on('matchCreated', async (e) => {
	let self = taWebsocket.taClient;
	let taPackets = Packets;
	if (!InMatch) {

		e.data.associated_users.push(self.Self);

		taWebsocket.sendEvent(new taPackets.Event({
			match_updated_event: new taPackets.Event.MatchUpdatedEvent({ match: e.data })
		}));

		coordinator = e.data.leader.name;
		for (var i = 0; i < e.data.associated_users.length; i++) {
			if (e.data.associated_users[i].user_id != 0 && e.data.associated_users[i].user_id != "TAOverlay") {
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
	if (coordinator == e.data.leader.name) {
		sockets.send(JSON.stringify({ 'Type': '2' }));
		matchData.length = 0;
		InMatch = false;
		console.log("Match deleted, backend unlocked by "+e.data.leader.name);
	}
});

taWebsocket.taClient.on('matchUpdated', (e) => {
	if (coordinator == e.data.leader.name) {
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
