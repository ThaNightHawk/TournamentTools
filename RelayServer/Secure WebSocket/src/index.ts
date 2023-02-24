import settings from './settings';
import { Coordinator, Player, Score } from "./includes/types";
import { getUsers, HJS, sendModal } from "./includes/functions";
import { Client, Models, Packets  } from "tournament-assistant-client";
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocket, WebSocketServer } from "ws";

const relay_ip = settings.Server.ip || "wss://localhost"
const port = settings.Server.port || 2223;

const server = createServer({
    cert: readFileSync('./Keys/cert.pem'),
    key: readFileSync('./Keys/privkey.pem')
}).listen(port);

const wss = new WebSocketServer({ server });
const ws = new WebSocket(relay_ip + ":" + port, { rejectUnauthorized: false });

console.info("Relay server is running on port " + port + " (" +relay_ip +":"+ port + ") - Mode: " + settings.Gamemode);

wss.on("connection", (ws) => {
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.on("message", (data) => {
        if (HJS(data.toString())) {
            const jsonObj = JSON.parse(data.toString());
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
                    ws.send(
                        JSON.stringify({
                            Type: 5,
                            command: "returnMatches",
                            message: { matches: matchArray }
                        })
                    );
                }
                if (jsonObj.command === "requestUsers") {
                    ws.send(
                        JSON.stringify({
                            Type: 5,
                            command: "returnUsers",
                            message: { users: usersArray, coordinators: coordinatorArray },
                        })
                    );
                }
            }
        } else {
            console.log("Someone tried to pass a non-JSON message to the relay server");
            ws.send(JSON.stringify({ Type: 0, message: "You've sent a non-JSON message to the relay server." }));
        }
    });
    ws.on("ping", () => {
        ws.pong();
    });
    ws.send(
        JSON.stringify({
            Type: 0,
            message: "You've connected to the Tournament relay server.",
        })
    );
});

const taWS = new Client("TAOverlay", {
    url: settings.TA.ip + ":" + settings.TA.port,
    options: { autoReconnect: true, autoReconnectInterval: 1000 },
    password: settings.TA.password,
});

const mode: string = settings.Gamemode;
const debug: boolean = false;
let usersArray: Array<any> = [];
let coordinatorArray: Array<any> = [];
let matchArray: Array<any> = [];
let songData: [string, number] = ["", 0];

taWS.on("packet", (p: any) => {
    if (p.has_response && p.response.has_connect) {
        if (p.response.type === 1) {
            console.log(p.response.connect.message + " | TA Version: 0." + String(p.response.connect.server_version).slice(0, 1) + "." + String(p.response.connect.server_version).slice(1));
            getUsers(taWS, usersArray, coordinatorArray, matchArray);
        } else {
            throw new Error("Connection was not successful");
        }
    }
    if (settings.Modals) {
        if (p.has_response && p.response.modal) {
            if (p.response.modal.modal_id) {
                const modal_id = p.response.modal.modal_id;
                if (modal_id.startsWith("team_modal_for_")) {
                    let modal_user = modal_id.replace("team_modal_for_", "");
                    if (p.response.modal.value == 'deny') {
                        sendModal(
                            taWS,
                            "user_denied_team_",
                            modal_user,
                            "You denied",
                            "Please rejoin the server, and pick the correct team.",
                            false
                        );
                    }
                    if (p.response.modal.value == 'confirm') {
                        sendModal(
                            taWS,
                            "ready_modal_for_",
                            modal_user,
                            "Team selected!",
                            "You've confirmed that you're\n on the correct team.\n\nWhenever you're ready to play\nclick the \"Ready\"-button!",
                            false,
                            "Ready",
                            "ready"
                        );
                    }
                }
            }
        }
    }
});

taWS.on("matchCreated", (m) => {
    m.data.associated_users.push(taWS.Self.guid);
    taWS.updateMatch(m.data);

    const coordinatorID = m.data.leader;
    const coordinatorName = coordinatorArray.find(u => u.guid === coordinatorID)?.name || "Unknown";

    const users = m.data.associated_users.filter(guid => {
        const index = usersArray.findIndex(x => x.guid == guid);
        return index !== -1 && guid !== taWS.Self.guid;
    });

    if (mode == "BR" || debug) {
        let userIds = users.map(guid => usersArray.find(x => x.guid == guid).user_id);
        ws.send(JSON.stringify({ Type: '1', overlay: 'BattleRoyale', userid: userIds, order: 1 }));
    }
    if (mode == "VERSUS" || debug) {
        const matchusers = users.map(guid => {
            const user = usersArray.find(x => x.guid == guid);
            return { name: user.name, user_id: user.user_id, team: user.team, guid: user.guid };
        });
        const matchData = { matchId: m.data.guid, coordinator: { name: coordinatorName, id: coordinatorID }, players: matchusers };
        matchArray.push({ matchData });
        ws.send(JSON.stringify({ Type: '1', overlay: 'VERSUS', message: { matchData } }));
    }
});

taWS.on("userAdded", (u) => {
    if (u.data.client_type === 0) {
        const user: Player = {
            name: u.data.name,
            type: u.data.client_type,
            user_id: u.data.user_id,
            guid: u.data.guid,
            team: [],
            stream_delay_ms: u.data.stream_delay_ms,
            stream_sync_start_ms: u.data.stream_sync_start_ms,
        };
        usersArray.push(user);

        if (settings.Modals) {
            if (!taWS.ServerSettings.enable_teams) {
                sendModal(
                    taWS,
                    "welcome_modal_for_",
                    user.guid,
                    "Welcome",
                    "You've joined the " + taWS.ServerSettings.server_name + " server!\n\n Please be aware, that this server is mainly for " + taWS.ServerSettings.server_name + "-use.\n\n",
                    true
                );
            }
        }
    }
    if (u.data.client_type === 1) {
        const coordinator: Coordinator = {
            name: u.data.name,
            type: u.data.client_type,
            user_id: u.data.user_id,
            guid: u.data.guid,
        };
        coordinatorArray.push(coordinator);
    }
});

taWS.on("userUpdated", (u) => {
    if (u.data.client_type === 0) {
        try {
            const index = usersArray.findIndex((x) => x.guid === u.data.guid);

            if (settings.Modals) {
                if (taWS.ServerSettings.enable_teams) {
                    if (usersArray[index].team[1] !== u.data.team.id) {
                        sendModal(
                            taWS,
                            "team_modal_for_",
                            usersArray[index].guid,
                            "Team selected!",
                            "You've selected team:\n\n " + u.data.team.name + "\n\n If you selected a wrong team\n please reconnect and select the right one.\n\nIf your team is correct, please click ready when you are ready to play.",
                            true,
                            "Confirm",
                            "confirm",
                            "Deny",
                            "deny"
                        );

                    }
                }
            }

            usersArray[index].team = [u.data.team?.name ?? "", u.data.team?.id ?? 0];
            usersArray[index].stream_delay_ms = u.data.stream_delay_ms;
            usersArray[index].stream_sync_start_ms = u.data.stream_sync_start_ms;
        } catch (error) {
            console.log("Error occured while updating user: " + error);
        }
    }
});

taWS.on("userLeft", (u) => {
    if (u.data.client_type === 0) {
        const index = usersArray.findIndex((x) => x.guid === u.data.guid);
        usersArray.splice(index, 1);
    }
    if (u.data.client_type === 1) {
        const index = coordinatorArray.findIndex((x) => x.guid === u.data.guid);
        coordinatorArray.splice(index, 1);
    }
});

taWS.on("realtimeScore", (s) => {
    const user = taWS.Players.find(x => x.guid === s.data.user_guid);
    const userId = user?.user_id;
    const syncDelay = usersArray.find(x => x.guid === s.data.user_guid)?.stream_delay_ms || 1;
    const team = usersArray.find(x => x.guid === s.data.user_guid)?.team || ["", 0];

    const userScoring: Score = {
        user_id: userId,
        team,
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
    setTimeout(() => {
        ws.send(JSON.stringify({ Type: "4", message: userScoring }));
    }, syncDelay);
});

taWS.on("matchUpdated", (m) => {
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

taWS.on("matchDeleted", (d) => {
    const index = matchArray.findIndex(x => x.matchData.matchId === d.data.guid);
    ws.send(JSON.stringify({ Type: "2", message: matchArray[index] }));
    matchArray.splice(index, 1);
});

taWS.on("error", (e) => {
    throw e;
});

process.on("SIGINT", function () {
    taWS.close();
    ws.close();
    console.log("Closing relay-server");
    process.exit(1);
});