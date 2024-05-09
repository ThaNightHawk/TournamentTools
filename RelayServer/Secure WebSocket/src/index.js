"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("./settings");
var functions_1 = require("./includes/functions");
var tournament_assistant_client_1 = require("tournament-assistant-client");
var https_1 = require("https");
var fs_1 = require("fs");
var ws_1 = require("ws");
var relay_ip = settings_1.default.Server.ip || "wss://localhost";
var port = settings_1.default.Server.port || 2223;
var server = (0, https_1.createServer)({
    cert: (0, fs_1.readFileSync)('./Keys/cert.pem'),
    key: (0, fs_1.readFileSync)('./Keys/privkey.pem')
}).listen(port);
var wss = new ws_1.WebSocketServer({ server: server });
var ws = new ws_1.WebSocket(relay_ip + ":" + port, { rejectUnauthorized: false });
console.info("Relay server is running on port " + port + " (" + relay_ip + ":" + port + ") - Mode: " + settings_1.default.Gamemode);
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
                        message: { users: usersArray, coordinators: coordinatorArray },
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
        message: "You've connected to the Tournament relay server.",
    }));
});
var taWS = new tournament_assistant_client_1.Client("TAOverlay", {
    url: settings_1.default.TA.ip + ":" + settings_1.default.TA.port,
    options: { autoReconnect: true, autoReconnectInterval: 1000 },
    password: settings_1.default.TA.password,
});
var mode = settings_1.default.Gamemode;
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
    if (settings_1.default.Modals) {
        if (p.has_response && p.response.modal) {
            if (p.response.modal.modal_id) {
                var modal_id = p.response.modal.modal_id;
                if (modal_id.startsWith("team_modal_for_")) {
                    var modal_user = modal_id.replace("team_modal_for_", "");
                    if (p.response.modal.value == 'deny') {
                        (0, functions_1.sendModal)(taWS, "user_denied_team_", modal_user, "You denied", "Please rejoin the server, and pick the correct team.", false);
                    }
                    if (p.response.modal.value == 'confirm') {
                        (0, functions_1.sendModal)(taWS, "ready_modal_for_", modal_user, "Team selected!", "You've confirmed that you're\n on the correct team.\n\nWhenever you're ready to play\nclick the \"Ready\"-button!", false, "Ready", "ready");
                    }
                }
            }
        }
    }
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
            stream_sync_start_ms: u.data.stream_sync_start_ms,
        };
        usersArray.push(user);
        if (settings_1.default.Modals) {
            if (!taWS.ServerSettings.enable_teams) {
                (0, functions_1.sendModal)(taWS, "welcome_modal_for_", user.guid, "Welcome", "You've joined the " + taWS.ServerSettings.server_name + " server!\n\n Please be aware, that this server is mainly for " + taWS.ServerSettings.server_name + "-use.\n\n", true);
            }
        }
    }
    if (u.data.client_type === 1) {
        var coordinator = {
            name: u.data.name,
            type: u.data.client_type,
            user_id: u.data.user_id,
            guid: u.data.guid,
        };
        coordinatorArray.push(coordinator);
    }
});
taWS.on("userUpdated", function (u) {
    var _a, _b, _c, _d;
    if (u.data.client_type === 0) {
        try {
            var index = usersArray.findIndex(function (x) { return x.guid === u.data.guid; });
            // if (settings.Modals) {
            //     if (taWS.ServerSettings.enable_teams) {
            //         if (usersArray[index].team[1] !== u.data.team.id) {
            //             sendModal(
            //                 taWS,
            //                 "team_modal_for_",
            //                 usersArray[index].guid,
            //                 "Team selected!",
            //                 "You've selected team:\n\n " + u.data.team.name + "\n\n If you selected a wrong team\n please reconnect and select the right one.\n\nIf your team is correct, please click ready when you are ready to play.",
            //                 true,
            //                 "Confirm",
            //                 "confirm",
            //                 "Deny",
            //                 "deny"
            //             );
            //         }
            //     }
            // }
            usersArray[index].team = [(_b = (_a = u.data.team) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", (_d = (_c = u.data.team) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 0];
            usersArray[index].stream_delay_ms = u.data.stream_delay_ms;
            usersArray[index].stream_sync_start_ms = u.data.stream_sync_start_ms;
        }
        catch (error) {
            console.log("Error occured while updating user: " + error);
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
        notesMissed: s.data.notesMissed,
        badCuts: s.data.badCuts,
        bombHits: s.data.bombHits,
        wallHits: s.data.wallHits,
        maxCombo: s.data.maxCombo,
        lhAvg: s.data.leftHand.avgCut,
        lhBadCut: s.data.leftHand.badCut,
        lhHits: s.data.leftHand.hit,
        lhMiss: s.data.leftHand.miss,
        rhAvg: s.data.rightHand.avgCut,
        rhBadCut: s.data.rightHand.badCut,
        rhHits: s.data.rightHand.hit,
        rhMiss: s.data.rightHand.miss,
        totalMisses: (s.data.notesMissed + s.data.badCuts)
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
