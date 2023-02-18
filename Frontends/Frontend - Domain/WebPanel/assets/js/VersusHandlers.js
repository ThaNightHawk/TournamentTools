function OneVOneHandler() {
    createSwal({
        title: 'Player 1 Info',
        input: 'textarea',
        inputPlaceholder: 'Username\nTwitch Name',
        footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
        ...swalConfig,
    }).then((result) => {
        if (result.value) {
            PlayerInfo.push(result.value.split('\n'));
            createSwal({
                title: 'Player 2 Info',
                input: 'textarea',
                inputPlaceholder: 'Username\nTwitch Name',
                footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
                ...swalConfig,
            }).then((result) => {
                if (result.value) {
                    PlayerInfo.push(result.value.split('\n'));
                    createSwal({
                        title: 'Round',
                        input: 'text',
                        inputPlaceholder: 'Round 1',
                        footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
                        ...swalConfig,
                    }).then((result) => {
                        if (result.value) {
                            [PlayerNames[0], PlayerNames[1]] = [PlayerInfo[0][0], PlayerInfo[1][0]];
                            PlayerInfo.push(result.value.split("\n"));
                            round = result.value;

                            document.getElementById("playerScore").removeAttribute("disabled");
                            document.getElementById("P1ScoreSlider").removeAttribute("disabled");
                            document.getElementById("P2ScoreSlider").removeAttribute("disabled");
                            document.getElementById("currentMap").removeAttribute("disabled");
                            document.getElementById("mapPlaying").removeAttribute("disabled");
                            document.getElementById("P1Name").innerHTML = `${PlayerNames[0]}'s score`;
                            document.getElementById("P2Name").innerHTML = `${PlayerNames[1]}'s score`;
                            inMatch = true;
                            ws.send(JSON.stringify({
                                Type: '5',
                                command: 'createUsers',
                                matchStyle: '1v1',
                                PlayerNames: [PlayerNames[0], PlayerNames[1]],
                                PlayerIds: [PlayerIDs[0], PlayerIDs[1]],
                                TwitchIds: [PlayerInfo[0][1], PlayerInfo[1][1]],
                                Round: round
                            }));
                            if (!local) {
                                BeatKhana();
                            }
                            if (local) {
                                localPools();
                            }
                        }
                    })
                }
            })
        }
    })
}

function TwoVTwoHandler() {
    createSwal({
        title: 'Team Images',
        input: 'textarea',
        inputPlaceholder: 'Team 1 Image URL\nTeam 2 Image URL',
        footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
        ...swalConfig,
    }).then((result) => {
        if (result.value) {
            TeamImages.push(result.value.split('\n'));
            createSwal({
                title: 'Team 1 Twitch-names\n(Only name)',
                input: 'textarea',
                inputPlaceholder: `${PlayerNames[0]}\n${PlayerNames[1]}`,
                footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
                ...swalConfig,
            }).then((result) => {
                if (result.value) {
                    PlayerInfo.push(result.value.split('\n'));
                    createSwal({
                        title: 'Team 2 Twitch-names\n(Only name)',
                        input: 'textarea',
                        inputPlaceholder: `${PlayerNames[2]}\n${PlayerNames[3]}`,
                        footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
                        ...swalConfig,
                    }).then((result) => {
                        if (result.value) {
                            PlayerInfo.push(result.value.split('\n'));
                            createSwal({
                                title: 'Round',
                                input: 'text',
                                inputPlaceholder: 'Round 1',
                                footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
                                ...swalConfig,
                            }).then((result) => {
                                if (result.value) {
                                    round = result.value;

                                    document.getElementById("playerScore").removeAttribute("disabled");
                                    document.getElementById("P1ScoreSlider").removeAttribute("disabled");
                                    document.getElementById("P2ScoreSlider").removeAttribute("disabled");
                                    document.getElementById("currentMap").removeAttribute("disabled");
                                    document.getElementById("mapPlaying").removeAttribute("disabled");
                                    document.getElementById("P1Name").innerHTML = `${TeamNamesIDs[0]}'s score`;
                                    document.getElementById("P2Name").innerHTML = `${TeamNamesIDs[2]}'s score`;
                                    inMatch = true;
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
                                    if (!local) {
                                        BeatKhana();
                                    }
                                    if (local) {
                                        localPools();
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}