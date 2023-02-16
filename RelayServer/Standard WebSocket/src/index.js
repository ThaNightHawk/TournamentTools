"use strict";
exports.__esModule = true;
var settings_1 = require("./settings");
var functions_1 = require("./includes/functions");
var tournament_assistant_client_1 = require("tournament-assistant-client");
var ws_1 = require("ws");
var relay_ip = settings_1["default"].Server.ip || "ws://localhost";
var port = settings_1["default"].Server.port || 2223;
var wss = new ws_1.WebSocketServer({ port: port });
var ws = new ws_1.WebSocket(relay_ip + ":" + port);
console.info("Relay server is running on port " + port + " (" + relay_ip + ":" + port + ") - Mode: " + settings_1["default"].Gamemode);
wss.on("connection", function (ws) {
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.on("message", function (data) {
        if ((0, functions_1.HJS)(data.toString())) {
            var jsonObj = JSON.parse(data.toString());
            if (jsonObj.message == "ping") {
                ws.send(JSON.stringify({ message: "pong" }));
            }
            if (jsonObj.Type === "69") {
                if (jsonObj.message === "Close") {
                    taWS.close();
                }
            }
            if (jsonObj.Type === "5") {
                if (jsonObj.command === "requestMatches") {
                    ws.send(JSON.stringify({
                        Type: 5,
                        command: "returnMatches",
                        message: { matches: matchArray }
                    }));
                }
                if (jsonObj.command === "requestUsers") {
                    ws.send(JSON.stringify({
                        Type: 5,
                        command: "returnUsers",
                        message: { users: usersArray, coordinators: coordinatorArray }
                    }));
                }
            }
        }
        else {
            console.log("Someone tried to pass a non-JSON message to the relay server");
            ws.send(JSON.stringify({ Type: 0, message: "You've sent a non-JSON message to the relay server." }));
        }
    });
    ws.on("ping", function () {
        ws.pong();
    });
    ws.send(JSON.stringify({
        Type: 0,
        message: "You've connected to the Tournament relay server."
    }));
});
var taWS = new tournament_assistant_client_1.Client("TAOverlay", {
    url: settings_1["default"].TA.ip + ":" + settings_1["default"].TA.port,
    options: { autoReconnect: true, autoReconnectInterval: 1000 },
    password: settings_1["default"].TA.password
});
var mode = settings_1["default"].Gamemode;
var debug = false;
var usersArray = [];
var coordinatorArray = [];
var matchArray = [];
var songData = ["", 0];
taWS.on("packet", function (p) {
    if (p.has_response && p.response.has_connect) {
        if (p.response.type === 1) {
            console.log(p.response.connect.message + " | TA Version: 0." + String(p.response.connect.server_version).slice(0, 1) + "." + String(p.response.connect.server_version).slice(1));
            (0, functions_1.getUsers)(taWS, usersArray, coordinatorArray, matchArray);
        }
        else {
            throw new Error("Connection was not successful");
        }
    }
});
taWS.on("showModal" || "modalResponse", function (m) {
    console.log(m);
});
taWS.on("matchCreated", function (m) {
    var _a;
    m.data.associated_users.push(taWS.Self.guid);
    taWS.updateMatch(m.data);
    var coordinatorID = m.data.leader;
    var coordinatorName = ((_a = coordinatorArray.find(function (u) { return u.guid === coordinatorID; })) === null || _a === void 0 ? void 0 : _a.name) || "Unknown";
    var users = m.data.associated_users.filter(function (guid) {
        var index = usersArray.findIndex(function (x) { return x.guid == guid; });
        return index !== -1 && guid !== taWS.Self.guid;
    });
    if (mode == "BR" || debug) {
        var userIds = users.map(function (guid) { return usersArray.find(function (x) { return x.guid == guid; }).user_id; });
        ws.send(JSON.stringify({ Type: '1', overlay: 'BattleRoyale', userid: userIds, order: 1 }));
    }
    if (mode == "VERSUS" || debug) {
        var matchusers = users.map(function (guid) {
            var user = usersArray.find(function (x) { return x.guid == guid; });
            return { name: user.name, user_id: user.user_id, team: user.team, guid: user.guid };
        });
        var matchData = { matchId: m.data.guid, coordinator: { name: coordinatorName, id: coordinatorID }, players: matchusers };
        matchArray.push({ matchData: matchData });
        ws.send(JSON.stringify({ Type: '1', overlay: 'VERSUS', message: { matchData: matchData } }));
    }
});
taWS.on("userAdded", function (u) {
    if (u.data.client_type === 0) {
        var user = {
            name: u.data.name,
            type: u.data.client_type,
            user_id: u.data.user_id,
            guid: u.data.guid,
            team: [],
            stream_delay_ms: u.data.stream_delay_ms,
            stream_sync_start_ms: u.data.stream_sync_start_ms
        };
        usersArray.push(user);
        if (!taWS.ServerSettings.enable_teams) {
            var modalMessage = new tournament_assistant_client_1.Packets.Command.ShowModal({
                modal_id: "welcome_modal_for" + user.guid,
                message_title: "Welcome",
                message_text: "You've joined the " + taWS.ServerSettings.server_name + " server!\n\n Please be aware, that this server is mainly for " + taWS.ServerSettings.server_name + "-use.\n\n",
                can_close: true
            });
            taWS.sendMessage([user.guid], modalMessage);
        }
    }
    if (u.data.client_type === 1) {
        var coordinator = {
            name: u.data.name,
            type: u.data.client_type,
            user_id: u.data.user_id,
            guid: u.data.guid
        };
        coordinatorArray.push(coordinator);
    }
});
taWS.on("userUpdated", function (u) {
    if (u.data.client_type === 0) {
        try {
            var index = usersArray.findIndex(function (x) { return x.guid === u.data.guid; });
            if (taWS.ServerSettings.enable_teams) {
                if (usersArray[index].team[1] !== u.data.team.id) {
                    var modalMessage = new tournament_assistant_client_1.Packets.Command.ShowModal({
                        modal_id: "team_modal_for" + usersArray[index].guid,
                        message_title: "Team selected!",
                        message_text: "You've selected team:\n " + u.data.team.name + "\n If you selected a wrong team\n please reconnect and select the right one.\n\nIf your team is correct, please click ready when you are ready to play.",
                        can_close: true
                    });
                    taWS.sendMessage([u.data.guid], modalMessage);
                }
            }
            usersArray[index].team = [u.data.team.name, u.data.team.id];
            usersArray[index].stream_delay_ms = u.data.stream_delay_ms;
            usersArray[index].stream_sync_start_ms = u.data.stream_sync_start_ms;
        }
        catch (error) {
            console.log("Error: User doesn't exist in UsersArray");
        }
    }
});
taWS.on("userLeft", function (u) {
    if (u.data.client_type === 0) {
        var index = usersArray.findIndex(function (x) { return x.guid === u.data.guid; });
        usersArray.splice(index, 1);
    }
    if (u.data.client_type === 1) {
        var index = coordinatorArray.findIndex(function (x) { return x.guid === u.data.guid; });
        coordinatorArray.splice(index, 1);
    }
});
taWS.on("realtimeScore", function (s) {
    var _a, _b;
    var user = taWS.Players.find(function (x) { return x.guid === s.data.user_guid; });
    var userId = user === null || user === void 0 ? void 0 : user.user_id;
    var syncDelay = ((_a = usersArray.find(function (x) { return x.guid === s.data.user_guid; })) === null || _a === void 0 ? void 0 : _a.stream_delay_ms) || 1;
    var team = ((_b = usersArray.find(function (x) { return x.guid === s.data.user_guid; })) === null || _b === void 0 ? void 0 : _b.team) || ["", 0];
    var userScoring = {
        user_id: userId,
        team: team,
        score: s.data.score,
        accuracy: s.data.accuracy,
        combo: s.data.combo,
        notesMissed: s.data.scoreTracker.notesMissed,
        badCuts: s.data.scoreTracker.badCuts,
        bombHits: s.data.scoreTracker.bombHits,
        wallHits: s.data.scoreTracker.wallHits,
        maxCombo: s.data.scoreTracker.maxCombo,
        lhAvg: s.data.scoreTracker.leftHand.avgCut,
        lhBadCut: s.data.scoreTracker.leftHand.badCut,
        lhHits: s.data.scoreTracker.leftHand.hit,
        lhMiss: s.data.scoreTracker.leftHand.miss,
        rhAvg: s.data.scoreTracker.rightHand.avgCut,
        rhBadCut: s.data.scoreTracker.rightHand.badCut,
        rhHits: s.data.scoreTracker.rightHand.hit,
        rhMiss: s.data.scoreTracker.rightHand.miss,
        totalMisses: (s.data.scoreTracker.notesMissed + s.data.scoreTracker.badCuts)
    };
    setTimeout(function () {
        ws.send(JSON.stringify({ Type: "4", message: userScoring }));
    }, syncDelay);
});
taWS.on("matchUpdated", function (m) {
    if (mode === "BR") {
        if (typeof m.data.selected_level !== "undefined") {
            if (songData[0] !== m.data.selected_level.level_id || songData[1] !== m.data.selected_difficulty) {
                ws.send(JSON.stringify({ Type: "3", overlay: "BattleRoyale", LevelId: m.data.selected_level.level_id, Diff: m.data.selected_difficulty }));
                songData[0] = m.data.selected_level.level_id;
                songData[1] = m.data.selected_difficulty;
            }
        }
    }
});
taWS.on("matchDeleted", function (d) {
    var index = matchArray.findIndex(function (x) { return x.matchData.matchId === d.data.guid; });
    ws.send(JSON.stringify({ Type: "2", message: matchArray[index] }));
    matchArray.splice(index, 1);
});
taWS.on("error", function (e) {
    throw e;
});
process.on("SIGINT", function () {
    taWS.close();
    ws.close();
    console.log("Closing relay-server");
    process.exit(1);
});
