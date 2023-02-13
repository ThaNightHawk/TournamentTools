const relayIp = "wss://domain.com:2223";

/*
Versus Variables
*/
let PlayerIDs = []; /* [P1, P2, P3, P4] */
let PlayerNames = []; /* [P1, P2, P3, P4] */
let PlayerInfo = []; /* Used for storing data to be sent, if you press "Reload Stream-overlay" */

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
        '1': '1V1',
        // '2': '2V2',
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
        if (Type == 1 && overlay == "VERSUS") {
            const { matchId, coordinator, players } = message.matchData;

            const player1 = players[0] || { name: "Placeholder 1", user_id: "76561198086326146", guid: "0" };
            const player2 = players[1] || { name: "Placeholder 2", user_id: "76561198086326146", guid: "0" };

            $('#currentMatch').append(`
            <option 
            data-match-id="${matchId}"
            data-coordinator-name="${coordinator.name}"
            data-coordinator-id="${coordinator.id}"
            data-player1-name="${player1.name}"
            data-player1-id="${player1.user_id}"
            data-player1-guid="${player1.guid}"
            data-player2-name="${player2.name}"
            data-player2-id="${player2.user_id}"
            data-player2-guid="${player2.guid}"
            >${player1.name} vs ${player2.name}</option>
            `);
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
                    const { matchId, coordinator, players } = match.matchData;
                    if (!$(`#currentMatch option[data-match-id="${matchId}"]`).length) {
                        const player1 = players[0] || { name: "Placeholder 1", user_id: "76561198086326146", guid: "0" };
                        const player2 = players[1] || { name: "Placeholder 2", user_id: "76561198086326146", guid: "0" };

                        $('#currentMatch').append(`
                        <option 
                        data-match-id="${matchId}"
                        data-coordinator-name="${coordinator.name}"
                        data-coordinator-id="${coordinator.id}"
                        data-player1-name="${player1.name}"
                        data-player1-id="${player1.user_id}"
                        data-player1-guid="${player1.guid}"
                        data-player2-name="${player2.name}"
                        data-player2-id="${player2.user_id}"
                        data-player2-guid="${player2.guid}"
                        >${player1.name} vs ${player2.name}</option>
                        `);
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
                    title = '1V1';
                    break;
                // case '2':
                //     tmconfig = 2;
                //     title = '2V2';
                //     break;
                case '3':
                    tmconfig = 3;
                    title = 'Battle Royale';
                    break;
            }

            return new Promise(resolve => {
                if (tmconfig === 1 || tmconfig === 2) {
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
    if (!inMatch) {
        return;
    }
    const command = tmconfig === 1 ? 'resetOverlay' : 'resetUsers';
    ws.send(JSON.stringify({ Type: '5', command }));
    if (tmconfig === 2) {
        ws.send(JSON.stringify({ Type: '6', command: 'resetSpectator' }));
    }
    inMatch = false;
    location.reload();
}
function reload() {
    if (inMatch) {
        ws.send(JSON.stringify({ 'Type': '5', 'command': 'createUsers', 'PlayerNames': [PlayerInfo[0][0], PlayerInfo[1][0]], 'PlayerIds': [PlayerIDs[0], PlayerIDs[1]], 'TwitchIds': [PlayerInfo[0][1], PlayerInfo[1][1]], 'Round': round }));
    }
};

Connect();