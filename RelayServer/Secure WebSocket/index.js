"use strict";
exports.__esModule = true;
var taWSS = require("tournament-assistant-client");
var https_1 = require("https");
var fs_1 = require("fs");
var ws_1 = require("ws");
var server = (0, https_1.createServer)({
    cert: (0, fs_1.readFileSync)('./Keys/cert.pem'),
    key: (0, fs_1.readFileSync)('./Keys/privkey.pem')
});
var wss = new ws_1.WebSocketServer({ server: server });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.send(JSON.stringify({ 'Type': '0', 'message': 'You\'ve connected to the Dane Saber Tournament relay server.' }));
    ws.on('message', function message(data) {
        //Check if type is 69, if so close connection to TA server
        //Check if data starts with {, if so, parse it as JSON
        if (data.toString().startsWith("{")) {
            var jsonObj = JSON.parse(data.toString());
            if (jsonObj.Type == "69" && jsonObj.message == "Close") {
                console.log("Closed connection to TA server");
                taWS.close();
            }
            if (jsonObj.Type == "5" && jsonObj.command == "requestMatches") {
                console.log("Matches got requested");
                if (matchArray != null) {
                    sockets.send(JSON.stringify({ 'Type': '5', command: 'returnMatches', 'message': { matches: matchArray } }));
                }
                else {
                    sockets.send(JSON.stringify({ 'Type': '5', command: 'returnMatches', 'message': "No matches found" }));
                }
            }
        }
        else {
            console.log("Someone tried to pass a non-JSON message to the relay server");
        }
    });
});
server.listen(2223);
var ws = new ws_1.WebSocket("wss://api.danesaber.cc:2223", { rejectUnauthorized: false });
var sockets = ws;
//If the connection is opened successfully, we tell the user that.
sockets.onopen = function (_event) {
    console.log("Connected to Relay server");
};
var taWS = new taWSS.Client("DaneSaberOverlay", {
    url: "ws://danesaber.cc:2053"
});
var usersArray = [];
var users = [];
var matchArray = [];
var userIds = [];
var songData = ["", 0]; // array of song data
taWS.on("packet", function (p) {
    if (p.has_response && p.response.has_connect) {
        if (p.response.type === 1) {
            console.log(p.response.connect.message);
        }
        else {
            throw new Error("Connection was not successful");
        }
    }
});
taWS.on("matchCreated", function (m) {
    m.data.associated_users.push(taWS.Self.guid);
    taWS.updateMatch(m.data);
    var _loop_1 = function (i) {
        if (m.data.associated_users[i] != taWS.Self.guid) {
            var index = usersArray.findIndex(function (x) { return x.guid == m.data.associated_users[i]; });
            if (index != -1) {
                users.push(m.data.associated_users[i]);
            }
        }
    };
    for (var i = 0; i < m.data.associated_users.length; i++) {
        _loop_1(i);
    }
    var _loop_2 = function (i) {
        var index = usersArray.findIndex(function (x) { return x.guid == users[i]; });
        console.log("Found user " + usersArray[index].name + " | User Id " + usersArray[index].user_id + " in usersArray");
        //Push the user_id to userIds
        userIds.push(usersArray[index].user_id);
    };
    for (var i = 0; i < users.length; i++) {
        _loop_2(i);
    }
    sockets.send(JSON.stringify({ 'Type': '1', 'userid': userIds, 'order': 1 }));
});
taWS.on("matchDeleted", function (m) {
    sockets.send(JSON.stringify({ 'Type': '2' }));
    users = [];
    userIds = [];
    console.log("Match deleted");
    console.log(users);
});
taWS.on("userAdded", function (u) {
    if (u.data.client_type == 0) {
        usersArray.push({ "name": u.data.name, "type": u.data.client_type, "guid": u.data.guid, "user_id": u.data.user_id });
    }
});
taWS.on("userLeft", function (u) {
    if (u.data.client_type == 0) {
        var index = usersArray.findIndex(function (x) { return x.guid == u.data.guid; });
        usersArray.splice(index, 1);
    }
});
function Score(_id, _score, _acc, _combo, _notesMissed, _badCuts, _bombHits, _wallHits, _maxCombo, _lhAvg, _lhBad, _lhHit, _lhMiss, _rhAvg, _rhBad, _rhHit, _rhMiss) {
    this.id = _id;
    this.score = _score;
    this.acc = _acc;
    this.combo = _combo;
    this.notesMissed = _notesMissed;
    this.badCuts = _badCuts;
    this.bombHits = _bombHits;
    this.wallHits = _wallHits;
    this.maxCombo = _maxCombo;
    this.lhAvg = _lhAvg;
    this.lhBad = _lhBad;
    this.lhHit = _lhHit;
    this.lhMiss = _lhMiss;
    this.rhAvg = _rhAvg;
    this.rhBad = _rhBad;
    this.rhHit = _rhHit;
    this.rhMiss = _rhMiss;
    this.Misses = _notesMissed + _badCuts;
}
taWS.on("realtimeScore", function (s) {
    //Find the user_id in the usersArray from the guid 
    var index = usersArray.findIndex(function (x) { return x.guid == s.data.user_guid; });
    var user_id = usersArray[index].user_id;
    // console.log(user_id);
    var userScoring = new Score(user_id, s.data.score, s.data.accuracy, s.data.combo, s.data.scoreTracker.notesMissed, s.data.scoreTracker.badCuts, s.data.scoreTracker.bombHits, s.data.scoreTracker.wallHits, s.data.scoreTracker.maxCombo, s.data.scoreTracker.leftHand.avgCut, s.data.scoreTracker.leftHand.badCut, s.data.scoreTracker.leftHand.hit, s.data.scoreTracker.leftHand.miss, s.data.scoreTracker.rightHand.avgCut, s.data.scoreTracker.rightHand.badCut, s.data.scoreTracker.rightHand.hit, s.data.scoreTracker.rightHand.miss);
    // let userScoring = new Score(user_id,s.data.score,s.data.accuracy,s.data.combo,s.data.scoreTracker.notesMissed,s.data.scoreTracker.badCuts);
    // console.table(userScoring);
    sockets.send(JSON.stringify({ 'Type': '4', 'message': userScoring }));
});
taWS.on("matchUpdated", function (m) {
    if (typeof m.data.selected_level != "undefined") {
        if (songData[0] != m.data.selected_level.level_id || songData[1] != m.data.selected_difficulty) {
            // console.log(m.data.selected_level.level_id);
            sockets.send(JSON.stringify({ 'Type': '3', 'LevelId': m.data.selected_level.level_id, 'Diff': m.data.selected_difficulty }));
            songData[0] = m.data.selected_level.level_id;
            songData[1] = m.data.selected_difficulty;
        }
    }
});
taWS.on("error", function (e) {
    throw e;
});
