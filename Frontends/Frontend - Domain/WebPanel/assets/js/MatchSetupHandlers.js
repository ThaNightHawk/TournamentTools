function addUsernames(usernames, userids, twitchnames) {
    const select1 = document.getElementById("playerScreenNames");
    const select2 = document.getElementById("playerSpectatingNames");

    for (let i = 0; i < usernames.length; i++) {
        const opt = usernames[i];
        const userid = userids[i];
        const twitchname = twitchnames[i];

        const option1 = document.createElement("option");
        option1.textContent = opt;
        option1.value = userid;
        select1.appendChild(option1);

        const option2 = document.createElement("option");
        option2.textContent = opt;
        option2.value = twitchname;
        select2.appendChild(option2);
    }
};

function configure() {
    if (!inMatch) {
        if (tmconfig === 0) {
            createSwal({
                title: 'No tournament style selected!',
                html: 'Please select a tournament style, before configuring the overlay.',
                confirmButtonText: 'Setup',
            }).then((result) => {
                if (result.isConfirmed) {
                    configPop();
                }
            });
        }
        if (tmconfig == 1) {
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
        /*
        Will be finished soonTM
        if (tmconfig == 2) {
            createSwal({
                title: 'Team 1 Info',
                input: 'textarea',
                inputPlaceholder: 'Username\nTwitch Name',
                footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
                ...swalConfig,
            }).then((result) => {
                if (result.value) {
                    PlayerInfo.push(result.value.split('\n'));
                    createSwal({
                        title: 'Team 2 Info',
                        input: 'textarea',
                        inputPlaceholder: 'Team Name\nImgur Image URL',
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
        }*/
        if (tmconfig == 3) {
            Swal.fire({
                title: 'Complete list of usernames',
                input: 'textarea',
                inputPlaceholder: 'Username1\nUsername2\nUsername3',
                footer: '<a href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
                ...swalConfig,
            }).then((result) => {
                if (result.value) {
                    usernames = result.value.split("\n");

                    Swal.fire({
                        title: 'Complete list of userids',
                        input: 'textarea',
                        inputPlaceholder: 'ScoreSaberID1\nScoreSaberID2\nScoreSaberID3',
                        footer: '<a href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
                        ...swalConfig,
                    }).then((result) => {
                        if (result.value) {
                            userids = result.value.split("\n");

                            Swal.fire({
                                title: 'Complete list of Twitchnames',
                                input: 'textarea',
                                inputPlaceholder: 'TwitchName1\nTwitchName2\nTwitchName3',
                                footer: '<a href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
                                ...swalConfig,
                            }).then((result) => {
                                if (result.value) {
                                    twitchnames = result.value.split("\n");

                                    addUsernames(usernames, userids, twitchnames);

                                    document.getElementById("playerScreenNames").removeAttribute("disabled");
                                    document.getElementById("playerSpectatingNames").removeAttribute("disabled");
                                    document.getElementById("score").removeAttribute("disabled");
                                    document.getElementById("alive").removeAttribute("disabled");
                                    document.getElementById("playerScreen").removeAttribute("disabled");
                                    document.getElementById("playerSpec").removeAttribute("disabled");
                                    document.getElementById("playerResetSpec").removeAttribute("disabled");
                                    document.getElementById("BRDIV").style.display = "inline-block";

                                    setTimeout(function () {
                                        document.getElementById("BRDIV").style.opacity = "1";
                                    }, 1000);
                                    inMatch = true;
                                    ws.send(JSON.stringify({
                                        'Type': '6',
                                        'command': 'createUsers',
                                        'PlayerNames': usernames,
                                        'PlayerIds': userids,
                                        'order': usernames.length
                                    }));
                                }
                            });
                        }
                    });
                }
            })
        }
    }
}