function PB(hashdiff) {
    let hash = hashdiff.split("_")[0];
    let diff = hashdiff.split("_")[1];

    let title = document.querySelector(`img[data-hash="${hash}"]`).getAttribute("data-title");

    Swal.fire({
        title: 'Who\'s picking?',
        showDenyButton: true,
        showDenyButton: true,
        confirmButtonText: PlayerNames[0],
        denyButtonText: PlayerNames[1],
        cancelButtonText: `Tiebreaker`,
        confirmButtonColor: '#ff5252',
        denyButtonColor: '#a768eb',
        cancelButtonColor: '#464646',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                ...swalPBConfig
            }).then((result) => {
                if (result.isConfirmed) {
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Pick", "map": hash, "PlayerId": PlayerIDs[0] }));
                    appendSongs(hash, diff, title, PlayerNames[0]);
                } else if (result.isDenied) {
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Ban", "map": hash, "PlayerId": PlayerIDs[0] }));
                } else if (result.isDismissed) {
                    PB(hashdiff);
                }
            });
        } else if (result.isDenied) {
            Swal.fire({
                ...swalPBConfig
            }).then((result) => {
                if (result.isConfirmed) {
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Pick", "map": hash, "PlayerId": PlayerIDs[1] }));
                    appendSongs(hash, diff, title, PlayerNames[1]);
                } else if (result.isDenied) {
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Ban", "map": hash, "PlayerId": PlayerIDs[1] }));
                } else if (result.isDismissed) {
                    PB(hashdiff);
                }
            });
        } else if (result.isDismissed) {
            ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Tiebreaker", "map": hash, "PlayerId": "0" }));
            appendSongs(hash, diff, title, "Tiebreaker");
        }
    });
}

function sendToOverlay(type) {
    if (type === 'requestMatches') {
        ws.send(JSON.stringify({
            Type: '5',
            command: 'requestMatches'
        }));
    } else if (type === 'selectMatch') {
        const selectedMatch = $('#currentMatch').find(':selected');
        if (selectedMatch.index() === 0) {
            alert('Please select a match');
            return;
        }

        PlayerIDs[0] = selectedMatch.data('player1-id');
        PlayerIDs[1] = selectedMatch.data('player2-id');
        matchId = selectedMatch.data('match-id');
        configure();
    }
    if (type == "playerScreen") {
        const playerScreenNames = document.getElementById("playerScreenNames");
        const alive = document.getElementById("alive");
        if (playerScreenNames.value === "") return;
        if (alive.value === "") return;

        const username = playerScreenNames.options[playerScreenNames.selectedIndex].text;
        const userid = playerScreenNames.value;
        const score = document.getElementById("score").value;
        ws.send(
            JSON.stringify({
                Type: '6',
                command: 'updateScore',
                PlayerId: userid,
                score: score,
                alive: alive.value
            })
        );

        if (alive.value === "false") {
            const select = document.getElementById("playerSpectatingNames");
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text === username) {
                    select.remove(i);
                }
            }
            document.getElementById("score").value = "";
            playerScreenNames.selectedIndex = 0;
            alive.selectedIndex = 0;
            select.selectedIndex = 0;
            $(`#playerScreenNames option[value='${userid}']`).remove();
            $(`#playerSpectatingNames option[value='${username}']`).remove();
        }
    }
    if (type === "playerSpec") {
        const username = document.getElementById("playerSpectatingNames").options[document.getElementById("playerSpectatingNames").selectedIndex].text;
        const twitchname = document.getElementById("playerSpectatingNames").value;
        ws.send(
            JSON.stringify({
                Type: 6,
                command: "updateSpectator",
                Player: username,
                Twitch: twitchname,
            })
        );
    }

    if (type == "resetSpec") {
        ws.send(
            JSON.stringify({
                Type: 6,
                command: 'resetSpectator'
            })
        );
    }
    if (type === "currentMap") {
        const selectElement = document.getElementById("currentMap");
        const hash = selectElement.value;
        const diffOption = selectElement.options[selectElement.selectedIndex];
        const diff = diffOption.getAttribute("data-hash").toLowerCase();
        const player = diffOption.getAttribute("data-player");
        const diffValue = diff === "easy" ? 0 :
            diff === "normal" ? 1 :
                diff === "hard" ? 2 :
                    diff === "expert" ? 3 :
                        diff === "expertplus" ? 4 : 0;
        ws.send(JSON.stringify({
            Type: 3,
            command: 'updateMap',
            LevelId: hash,
            Diff: diffValue,
            MatchId: matchId,
            Player: player
        }));
    }
    if (type == "sendScore") {
        var p1Score = document.getElementById("P1ScoreSlider").value;
        var p2Score = document.getElementById("P2ScoreSlider").value;
        ws.send(JSON.stringify({ 'Type': '5', 'command': 'updateScore', 'PlayerIds': [PlayerIDs[0], PlayerIDs[1]], 'Score': [p1Score, p2Score] }));
    }
};