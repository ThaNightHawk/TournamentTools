import settings from './settings.js';
import { HJS } from "./includes/functions.js";
import { Response_ResponseType, TAClient, User_ClientTypes } from "moons-ta-client";
import { WebSocket, WebSocketServer } from "ws";
const relay_ip = settings.Server.ip || "ws://localhost";
const port = settings.Server.port || 2223;
const wss = new WebSocketServer({ port });
const ws = new WebSocket(relay_ip + ":" + port);
const taWS = new TAClient();
console.info("Relay server is running on port " + port + " (" + relay_ip + ":" + port + ") - Mode: " + settings.Gamemode);
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
                    // taWS.close(); // Yeah this doesn't exist right now, oops
                }
            }
            if (jsonObj.Type === "5") {
                const tournament = taWS.stateManager.getTournaments().find(x => x.settings?.tournamentName === settings.TA.tourneyName);
                const involvedMatches = taWS.stateManager.getMatches(tournament.guid).filter(x => x.associatedUsers.includes(taWS.stateManager.getSelfGuid()));
                const tourneyUsers = taWS.stateManager.getUsers(tournament.guid);
                const players = tourneyUsers.filter(x => x.clientType === User_ClientTypes.Player);
                const coordinators = tourneyUsers.filter(x => x.clientType === User_ClientTypes.WebsocketConnection);
                if (jsonObj.command === "requestMatches") {
                    ws.send(JSON.stringify({
                        Type: 5,
                        command: "returnMatches",
                        message: { players: players, coordinators: coordinators, matches: involvedMatches, teams: tournament.settings.teams }
                    }, (_, value) => typeof value === 'bigint'
                        ? value.toString()
                        : value // return everything else unchanged
                    ));
                }
                if (jsonObj.command === "requestUsers") {
                    ws.send(JSON.stringify({
                        Type: 5,
                        command: "returnUsers",
                        message: { users: players, coordinators: coordinators },
                    }, (_, value) => typeof value === 'bigint'
                        ? value.toString()
                        : value // return everything else unchanged
                    ));
                }
            }
        }
        else {
            console.log("Someone tried to pass a non-JSON message to the relay server");
            ws.send(JSON.stringify({ Type: 0, message: "You've sent a non-JSON message to the relay server." }));
        }
    });
    ws.on("ping", () => {
        ws.pong();
    });
    ws.send(JSON.stringify({
        Type: 0,
        message: "You've connected to the Tournament relay server.",
    }));
});
const mode = settings.Gamemode;
const debug = false;
let songData = ["", 0];
taWS.setAuthToken(settings.TA.token);
const connectResponse = await taWS.connect(settings.TA.ip, settings.TA.port);
if (connectResponse.details.oneofKind === "connect") {
    if (connectResponse.type !== Response_ResponseType.Success) {
        // throw new Error("Connection was not successful"); // This was the old TT error message, but I'm leaving the more specific one below
        throw new Error(connectResponse.details.connect.message);
    }
    console.log(connectResponse.details.connect.message + " | TA Version: " + connectResponse.details.connect.serverVersion);
}
// --- Join tourney by name --- //
const tourneys = taWS.stateManager.getTournaments();
const targetTourney = tourneys.find(x => x.settings?.tournamentName === settings.TA.tourneyName);
if (!targetTourney) {
    throw new Error(`No tourney named ${settings.TA.tourneyName} found!`);
}
const joinResponse = await taWS.joinTournament(targetTourney.guid);
if (joinResponse.type !== Response_ResponseType.Success && joinResponse.details.oneofKind === "join") {
    throw new Error(joinResponse.details.join.message);
}
taWS.stateManager.on("matchCreated", async ([match, tournament]) => {
    // If there's two tourneys named the same thing, god have mercy on all of us
    if (tournament.settings?.tournamentName !== settings.TA.tourneyName) {
        return;
    }
    await taWS.addUserToMatch(tournament.guid, match.guid, taWS.stateManager.getSelfGuid());
    const coordinatorID = match.leader;
    const coordinatorName = tournament.users.find(user => user.guid === coordinatorID)?.name || "Unknown";
    // We need to figure out which associated users are actually players
    const tourneyPlayers = taWS.stateManager.getUsers(tournament.guid);
    const matchPlayers = tourneyPlayers.filter(x => x.clientType === User_ClientTypes.Player && match.associatedUsers.includes(x.guid));
    if (mode == "BR" || debug) {
        const userIds = matchPlayers.map(player => player.platformId);
        ws.send(JSON.stringify({ Type: '1', overlay: 'BattleRoyale', userid: userIds, order: 1 }));
    }
    if (mode == "VERSUS" || debug) {
        const matchData = { matchId: match.guid, coordinator: { name: coordinatorName, guid: coordinatorID }, players: matchPlayers };
        ws.send(JSON.stringify({ Type: '1', overlay: 'VERSUS', message: { matchData, teams: tournament.settings.teams } }, (_, value) => typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
        ));
    }
});
taWS.stateManager.on("userConnected", ([user, _]) => {
    if (user.clientType === User_ClientTypes.Player) {
        // Oops no modals yet
        // if (settings.Modals) {
        //     if (!taWS.ServerSettings.enable_teams) {
        //         sendModal(
        //             taWS,
        //             "welcome_modal_for_",
        //             user.guid,
        //             "Welcome",
        //             "You've joined the " + taWS.ServerSettings.server_name + " server!\n\n Please be aware, that this server is mainly for " + taWS.ServerSettings.server_name + "-use.\n\n",
        //             true
        //         );
        //     }
        // }
    }
});
taWS.stateManager.on("userUpdated", ([user, _]) => {
    if (user.clientType === User_ClientTypes.Player) {
        // Oops still no modals
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
    }
});
taWS.on("realtimeScore", (score) => {
    const tournament = taWS.stateManager.getTournaments().find(x => x.settings?.tournamentName === settings.TA.tourneyName);
    const tourneyUsers = taWS.stateManager.getUsers(tournament.guid);
    const players = tourneyUsers.filter(x => x.clientType === User_ClientTypes.Player);
    const user = players.find(x => x.guid === score.userGuid);
    // If we don't find the user in this tournament, something has gone horribly wrong
    if (!user) {
        return;
    }
    const team = tournament.settings.teams.find(x => x.guid === user?.teamId);
    const userScoring = {
        user_id: user?.platformId,
        team: { name: team?.name ?? "", id: team?.guid ?? "0" },
        score: score.score,
        accuracy: score.accuracy,
        combo: score.combo,
        notesMissed: score.notesMissed,
        badCuts: score.badCuts,
        bombHits: score.bombHits,
        wallHits: score.wallHits,
        maxCombo: score.maxCombo,
        lhAvg: score.leftHand.avgCut,
        lhBadCut: score.leftHand.badCut,
        lhHits: score.leftHand.hit,
        lhMiss: score.leftHand.miss,
        rhAvg: score.rightHand.avgCut,
        rhBadCut: score.rightHand.badCut,
        rhHits: score.rightHand.hit,
        rhMiss: score.rightHand.miss,
        totalMisses: (score.notesMissed + score.badCuts)
    };
    setTimeout(() => {
        ws.send(JSON.stringify({ Type: "4", message: userScoring }));
    }, Number(user?.streamDelayMs) || 1);
});
taWS.stateManager.on("matchUpdated", ([match, _]) => {
    if (mode === "BR") {
        if (match.selectedMap) {
            if (songData[0] !== match.selectedMap.gameplayParameters.beatmap.levelId || songData[1] !== match.selectedMap.gameplayParameters.beatmap.difficulty) {
                ws.send(JSON.stringify({ Type: "3", overlay: "BattleRoyale", LevelId: match.selectedMap.gameplayParameters.beatmap.levelId, Diff: match.selectedMap.gameplayParameters.beatmap.difficulty }));
                songData[0] = match.selectedMap.gameplayParameters.beatmap.levelId;
                songData[1] = match.selectedMap.gameplayParameters.beatmap.difficulty;
            }
        }
    }
});
taWS.stateManager.on("matchDeleted", ([match, _]) => {
    ws.send(JSON.stringify({ Type: "2", message: match }, (_, value) => typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    ));
});
process.on("SIGINT", function () {
    ws.close();
    console.log("Closing relay-server");
    process.exit(1);
});
//# sourceMappingURL=index.js.map