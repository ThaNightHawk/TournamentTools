import { Client } from "tournament-assistant-client";
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocket, WebSocketServer } from "ws";

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
    ws.send(JSON.stringify({ 'Type': '0', 'message': 'You\'ve connected to the Dane Saber Tournament relay server.' }));
    ws.on('message', function message(data) {
        if (data.toString().startsWith("{")) {
            let jsonObj = JSON.parse(data.toString());
            if (jsonObj.Type == "69" && jsonObj.message == "Close") {
                console.log("Closed connection to TA server");
                taWS.close();
            }
            if (jsonObj.Type == "5" && jsonObj.command == "requestMatches") {
                console.log("Matches got requested");
                if (matchArray != null) {
                    ws.send(JSON.stringify({ 'Type': '5', command: 'returnMatches', 'message': { matches: matchArray } }));
                } else {
                    ws.send(JSON.stringify({ 'Type': '5', command: 'returnMatches', 'message': "No matches found" }));
                }
            }
            if (jsonObj.Type == "5" && jsonObj.command == "requestUsers") {
                console.log("Users got requested");
                if (usersArray != null) {
                    ws.send(JSON.stringify({ 'Type': '5', command: 'returnUsers', 'message': { users: usersArray } }));
                } else {
                    ws.send(JSON.stringify({ 'Type': '5', command: 'returnUsers', 'message': "No users found" }));
                }
            }
        } else {
            console.log("Someone tried to pass a non-JSON message to the relay server");
        }
    });
});
server.listen(2223);
const ws = new WebSocket(`wss://domain:2223`, { rejectUnauthorized: false });

setInterval(function () {
    ws.send(JSON.stringify({ 'Type': '1', 'message': 'heartbeat'}));
}, 20000);

const taWS = new Client("TAOverlay", {
    url: "ws://taserver:2053",
    options: { autoReconnect: true, autoReconnectInterval: 1000 }
});


const debug: boolean = false;
let usersArray: Array<any> = [];
let users: Array<any> = [];
let matchArray: Array<any> = [];
let matchusers: Array<any> = [];
let userIds: Array<string> = [""];
let songData: [string, number] = ["", 0];


//New interface
interface MatchArray {
    matchData: Array<any>;
    matchId: Array<any>;
    coordinator: Coordinator[];
}

//Create typescript interface for coordinator
interface Coordinator {
    name: string;
    id: string;
}
interface Player {
    name: string;
    type: number;
    user_id: string;
    guid: string;
    stream_delay_ms: number;
    stream_sync_start_ms: number;
}

taWS.on("packet", p => {
    if (p.has_response && p.response.has_connect) {
        if (p.response.type === 1) {
            console.log(p.response.connect.message);

            //For every user found with taWS.Players map them and push them to the users array
            for (let i = 0; i < taWS.Players.length; i++) {
                const Player = taWS.Players.map((p: any) => {
                    return {
                        name: p.name,
                        type: p.client_type,
                        user_id: p.user_id,
                        guid: p.guid,
                        stream_delay_ms: p.stream_delay_ms,
                        stream_sync_start_ms: p.stream_sync_start_ms
                    }
                });
                usersArray.push(Player[i]);
            }
        } else {
            throw new Error("Connection was not successful");
        }
    }
});

taWS.on("matchCreated", m => {
    m.data.associated_users.push(taWS.Self.guid);
    taWS.updateMatch(m.data);
    let coordinatorID: string = m.data.leader;
    let coordinatorName: string = "";

    for (let i = 0; i < m.data.associated_users.length; i++) {
        if (m.data.associated_users[i] != taWS.Self.guid) {
            let index = usersArray.findIndex((x: any) => x.guid == m.data.associated_users[i]);
            if (index != -1) {
                users.push(m.data.associated_users[i]);
            }
        }
    }

    if (users.length > 3 || debug) {
        try {
            for (let i = 0; i < users.length; i++) {
                let index = usersArray.findIndex((x: any) => x.guid == users[i]);
                console.log("Found user " + usersArray[index].name + " | User Id " + usersArray[index].user_id + " in usersArray");
                userIds.push(usersArray[index].user_id);
            }
            ws.send(JSON.stringify({ 'Type': '1', 'overlay': 'BattleRoyale', 'userid': userIds, 'order': 1 }));
            taWS.ServerSettings.score_update_frequency = 175;
            userIds = [];
        } catch (error) {
            console.error("Error: No user found in UsersArray | Error: " + error);
        }
    }
    if (users.length < 3 || debug) {
        try {
            coordinatorName = usersArray.find((u: { guid: string; }) => u.guid === coordinatorID).name || "Unknown";
        } catch (error) {
            coordinatorName = "Unknown";
            coordinatorID = "00000000-0000-0000-0000-000000000000";
        }
        try {
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < usersArray.length; j++) {
                    if (users[i] == usersArray[j].guid) {
                        matchusers.push({ name: usersArray[j].name, user_id: usersArray[j].user_id, guid: usersArray[j].guid });
                    }
                }
            }
        } catch (error) {
            console.error("Error: No user found in UsersArray | Error: " + error);
        }

        //Push to matchArray
        matchArray.push({ matchData: { matchId: m.data.guid, coordinator: { name: coordinatorName, id: coordinatorID }, players: matchusers } });
        ws.send(JSON.stringify({ 'Type': '1', 'overlay': '1V1', 'message': { matchData: { matchId: m.data.guid, coordinator: { name: coordinatorName, id: coordinatorID }, players: matchusers } } }));
        users = [];
        matchusers = [];
    }
});

taWS.on("userAdded", u => {
    if (u.data.client_type == 0) {
        const user: Player = {name:u.data.name, type:u.data.client_type,user_id:u.data.user_id, guid:u.data.guid, stream_delay_ms:u.data.stream_delay_ms, stream_sync_start_ms:u.data.stream_sync_start_ms}
        usersArray.push(user);
    }
});

taWS.on("userUpdated", u => {
    if (u.data.client_type <= 1) {
        try {
            let index = usersArray.findIndex((x: any) => x.guid == u.data.guid);
            usersArray[index].stream_delay_ms = u.data.stream_delay_ms;
            usersArray[index].stream_sync_start_ms = u.data.stream_sync_start_ms;
        } catch (error) {
            console.log("Error: User doesn't exist in UsersArray");
        }
    }
});

taWS.on("userLeft", u => {
    if (u.data.client_type <= 1) {
        let index = usersArray.findIndex((x: any) => x.guid == u.data.guid);
        usersArray.splice(index, 1);
    }
});

interface Score {
    user_id: string;
    score: number;
    accuracy: number;
    combo: number;
    notesMissed: number;
    badCuts: number;
    bombHits: number;
    wallHits: number;
    maxCombo: number;
    lhAvg: number[];
    lhBadCut: number;
    lhHits: number;
    lhMiss: number;
    rhAvg: number[];
    rhBadCut: number;
    rhHits: number;
    rhMiss: number;
    totalMisses: number;
}

taWS.on("realtimeScore", s => {
    let index = usersArray.findIndex((x: any) => x.guid == s.data.user_guid);
    let user_id = usersArray[index].user_id;
    let sync_delay = usersArray[index].stream_delay_ms;
    const userScoring: Score = {
        user_id: user_id,
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
        ws.send(JSON.stringify({ 'Type': '4', 'message': userScoring }));
    }, (sync_delay+1));
});

taWS.on("matchUpdated", m => {
    if (typeof m.data.selected_level != "undefined") {
        if (songData[0] != m.data.selected_level.level_id || songData[1] != m.data.selected_difficulty) {
            ws.send(JSON.stringify({ 'Type': '3', 'overlay': 'BattleRoyale', 'LevelId': m.data.selected_level.level_id, 'Diff': m.data.selected_difficulty }));
            songData[0] = m.data.selected_level.level_id;
            songData[1] = m.data.selected_difficulty;
        }
    }
});

taWS.on('matchDeleted', d => {
    let index = matchArray.findIndex((x: { matchData: { matchId: string; }; }) => x.matchData.matchId === d.data.guid);
    ws.send(JSON.stringify({ 'Type': '2', 'message': matchArray[index] }));
    matchArray.splice(index, 1);
});

taWS.on("error", e => {
    throw e;
});
