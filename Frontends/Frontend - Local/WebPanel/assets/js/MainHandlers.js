const relayIp = "ws://localhost:2223";

/*
Versus Variables
*/
let PlayerIDs = []; /* [P1, P2, P3, P4] */
let PlayerNames = []; /* [P1, P2, P3, P4] */
let PlayerInfo = []; /* Used for storing data to be sent, if you press "Reload Stream-overlay" */
let TeamNamesIDs = []; /* Team Names and IDs */
let TeamImages = []; /* Team Images */
/*
BR Variables
*/
let usernames;
let userids;
let twitchnames;

/*
General Variables
*/
let inMatch = false;
let tmconfig = 0;
let round;
let local;
let poolId = [];
let songOptions = [];
let poolData = [];
let ws;
let closed = false;

const inputOptions = new Promise((resolve) => {
    resolve({
        '1': '1V1 / 2V2',
        '3': 'Battle Royale'
    })
});

function Connect() {
    ws = new WebSocket(relayIp);

    ws.onopen = function () {

        document.getElementById("reconnect").style.display = "none";

        if (closed) { return; }
        checkForFiles();
        configPop();
    }

    ws.onclose = function () {
        closed = true;
        Swal.close();
        Swal.fire({
            title: 'WebSocket was <b>closed</b>. If this was unexpected, verify your WS server is running.',
            html: 'If not, please restart it. If it keeps happening, contact Hawk on Discord.'
        });
        document.getElementById("reconnect").style.display = "revert";
    }

    ws.onerror = function (event) {
        closed = true;
        Swal.close();
        Swal.fire({
            title: 'WebSocket <b>timed out</b>!',
            html: 'Contact Hawk on Discord.'
        })
        document.getElementById("reconnect").style.display = "revert";
    }

    ws.onmessage = async function (event) {
        const parsedData = JSON.parse(event.data);
        const { Type, overlay, command, message } = parsedData;
        if (Type == 1 && overlay === "VERSUS") {
            const { matchId, coordinator, players } = message.matchData;
            const teams = groupPlayersByTeam(players);
            const [team1, team2] = sortTeamsByName(Object.values(teams));
            const [player1, player2, player3, player4] = getPlayerNames(team1, team2, players);

            const optionHtml = getOptionHtml(matchId, coordinator, message.teams, player1, player2, player3, player4, players);
            $('#currentMatch').append(optionHtml);
        }

        if (Type == 2) {
            $('#currentMatch option[data-match-id="' + message.matchData.matchId + '"]').remove();
            document.getElementById("currentMatch").selectedIndex = 0;
        }

        if (Type == 5 && command == "returnMatches") {
            if (message.matches.length === 0) {
                Notiflix.Notify.failure("No matches was found", {
                    ...matchNotifConf
                });
            } else {
                Notiflix.Notify.success("Updated matchlist", {
                    ...matchNotifConf
                });

                message.matches.forEach(match => {
                    const { guid, leader, associatedUsers } = match;
                    const players = message.players.filter(x => associatedUsers.includes(x.guid));
                    const coordinator = message.coordinators.find(x => x.guid === leader);

                    if (!$(`#currentMatch option[data-match-id="${guid}"]`).length) {
                        const teams = groupPlayersByTeam(players);
                        const [team1, team2] = sortTeamsByName(Object.values(teams));
                        const [player1, player2, player3, player4] = getPlayerNames(team1, team2, players);

                        const optionHtml = getOptionHtml(guid, coordinator, message.teams, player1, player2, player3, player4, players);
                        $('#currentMatch').append(optionHtml);
                    }
                });
            }
        }
    }

    //Send a ping every 5 seconds to keep the connection alive
    setInterval(function () {
        if (ws.readyState == 1) {
            ws.send(JSON.stringify({ message: "ping" }));
        }
    }, 30000);

};
function configPop() {
    Swal.fire({
        title: 'Select tournament style',
        input: 'radio',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputOptions: inputOptions,
        inputValidator: value => {
            if (!value) return 'You need to choose something!';
            tmconfig = value;

            switch (value) {
                case '1':
                    tmconfig = 1;
                    title = '1V1 - 2V2';
                    break;
                case '3':
                    tmconfig = 3;
                    title = 'Battle Royale';
                    break;
            }

            return new Promise(resolve => {
                if (tmconfig === 1) {
                    Swal.fire({
                        title: 'Do you use BeatKhana?',
                        html: 'If you do, make sure your tournament is public, and map-pools can be seen.',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Yes',
                        denyButtonText: 'No',
                    }).then(result => {
                        if (result.isConfirmed) {
                            local = false;
                            showConnectedMessage('Yes', title);
                        } else if (result.isDenied) {
                            local = true;
                            showConnectedMessage('No', title);
                        }
                    });
                }
                if (tmconfig === 3) {
                    let timerInterval
                    Swal.fire({
                        title: 'You\'re connected!',
                        html: 'Tournament style: ' + title + '.<br/>',
                        timer: 5000,
                        timerProgressBar: true,
                        willClose: () => {
                            clearInterval(timerInterval)
                            configure();
                        }
                    });
                }
            });
        },
    });
}
function showConnectedMessage(beatKhana, title) {
    let timerInterval;
    Swal.fire({
        title: 'You\'re connected!',
        html: `Tournament style: <b>${title}</b>.<br>BeatKhana: <b>${beatKhana}</b>.<br>Press the "<b>Configure</b>"-button to setup the overlay.`,
        timer: 5000,
        timerProgressBar: true,
        willClose: () => {
            clearInterval(timerInterval);
        },
    });
    document.getElementById('MATCHDIV').style.display = 'inline-block';
    setTimeout(() => {
        document.getElementById('MATCHDIV').style.opacity = '1';
    }, 1);
}
function reset() {
    if (inMatch) {
        if (tmconfig == 1) {
            ws.send(JSON.stringify({
                'Type': '5',
                'command': 'resetOverlay'
            }));
            inMatch = false;
            location.reload();
        } else if (tmconfig == 2) {
            ws.send(JSON.stringify({
                'Type': '6',
                'command': 'resetUsers'
            }));
            ws.send(JSON.stringify({
                'Type': '6',
                'command': 'resetSpectator'
            }));
            inMatch = false;
            location.reload();
        }
    }
}
function reload() {
    if (inMatch) {

        if (!PlayerIDs[3]) {
            ws.send(JSON.stringify({
                Type: '5',
                command: 'createUsers',
                matchStyle: '1v1',
                PlayerNames: [PlayerNames[0], PlayerNames[1]],
                PlayerIds: [PlayerIDs[0], PlayerIDs[1]],
                TwitchIds: [PlayerInfo[0][1], PlayerInfo[1][1]],
                Round: round
            }));
        } else {
            ws.send(JSON.stringify({
                Type: '5',
                command: 'createUsers',
                matchStyle: '2v2',
                PlayerNames: [PlayerNames[0], PlayerNames[1], PlayerNames[2], PlayerNames[3]],
                PlayerIds: [PlayerIDs[0], PlayerIDs[1], PlayerIDs[2], PlayerIDs[3]],
                TwitchIds: [PlayerInfo[0][0], PlayerInfo[0][1], PlayerInfo[1][0], PlayerInfo[1][1]],
                TeamNames: [TeamNamesIDs[0], TeamNamesIDs[2]],
                TeamIDs: [TeamNamesIDs[1], TeamNamesIDs[3]],
                TeamImages: [TeamImages[0][0], TeamImages[0][1]],
                Round: round
            }));
        }
    }
};

Connect();