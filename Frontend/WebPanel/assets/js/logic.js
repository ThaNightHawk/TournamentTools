// Language: javascript
// Path: init.js
const debug = false;

//You can use ws:// instead, if you don't have a secured websocket
//though I recommend using wss:// to be able to use the twitch-function.
const relayIp = "wss://domain:port";

let usernames;
let P1;
let P2;
let P1Name;
let P2Name;
let userids;
let twitchnames;
let inMatch = false;
let tmconfig = 3;
let round;
let PlayerInfo = [];
let local;
let poolId = [];
let songOptions = [];
let poolData = [];

const ws = new WebSocket(relayIp);

ws.onopen = function () {
    configPop();
    if (debug) {
        console.log("Connected to Relay-server: " + relayIp);
    }
};

ws.onerror = function (event) {
    Swal.fire({
        title: 'WebSocket <b>timed out</b>!',
        html: 'Contact Hawk on Discord.'
    })
};

function PB(hash) {
    Swal.fire({
        title: 'Who\'s picking/banning?',
        showDenyButton: true,
        showDenyButton: true,
        confirmButtonText: P1Name,
        denyButtonText: P2Name,
        cancelButtonText: `Tiebreaker`,
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        if (result.isConfirmed) {
            let data = [hash, P1];
            Swal.fire({
                title: 'Pick or Ban?',
                showDenyButton: true,
                showDenyButton: true,
                confirmButtonText: `Pick`,
                denyButtonText: `Ban`,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    if (debug) {
                        console.log(P1Name + "(" + P1 + ") picked " + hash);
                    }
                    ws.send(JSON.stringify({
                        "Type": "5",
                        "command": "PicksAndBans",
                        "Action": "Pick",
                        "map": hash,
                        "PlayerId": P1
                    }));

                } else if (result.isDenied) {
                    if (debug) {
                        console.log(P1Name + "(" + P1 + ") banned " + hash);
                    }
                    ws.send(JSON.stringify({
                        "Type": "5",
                        "command": "PicksAndBans",
                        "Action": "Ban",
                        "map": hash,
                        "PlayerId": P1
                    }));
                }
            });
        } else if (result.isDenied) {
            let data = [hash, P2];
            Swal.fire({
                title: 'Pick or Ban?',
                showDenyButton: true,
                showDenyButton: true,
                confirmButtonText: `Pick`,
                denyButtonText: `Ban`,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    if (debug) {
                        console.log(P2Name + "(" + P2 + ") picked " + hash);
                    }
                    ws.send(JSON.stringify({
                        "Type": "5",
                        "command": "PicksAndBans",
                        "Action": "Pick",
                        "map": hash,
                        "PlayerId": P2
                    }));
                } else if (result.isDenied) {
                    if (debug) {
                        console.log(P2Name + "(" + P2 + ") banned " + hash);
                    }
                    ws.send(JSON.stringify({
                        "Type": "5",
                        "command": "PicksAndBans",
                        "Action": "Ban",
                        "map": hash,
                        "PlayerId": P2
                    }));
                }
            });
        } else if (result.isDismissed) {
            let data = [hash, "Tiebreaker"];
            if (debug) {
                console.log("Tiebreaker is " + hash);
            }
            ws.send(JSON.stringify({
                "Type": "5",
                "command": "PicksAndBans",
                "Action": "Tiebreaker",
                "map": hash,
                "PlayerId": "0"
            }));
        }
    });
};

function setPool(hash, diff, songName) {

    if (debug) {
        console.log("SetPool reached");
        console.log(hash);
        console.log(diff);
        console.log(songName);
    }

    for (var i = 0; i < hash.length; i++) {
        var clone = document.getElementById("SongCircle").cloneNode(true);

        clone.classList.add("SongCircle" + hash[i]);
        clone.setAttribute("onclick", "PB('" + hash[i] + "')");
        clone.setAttribute("src", "https://eu.cdn.beatsaver.com/" + hash[i].toLowerCase() + ".jpg");

        switch (diff[i].toLowerCase()) {
            case "easy":
                var diffColor = "#008055";
                var diffLabel = "Easy";
                break;
            case "normal":
                var diffColor = "#1268A1";
                var diffLabel = "Normal";
                break;
            case "hard":
                var diffColor = "#BD5500";
                var diffLabel = "Hard";
                break;
            case "expert":
                var diffColor = "#B52A1C";
                var diffLabel = "Expert";
                break;
            case "expertplus":
                var diffColor = "#900000";
                var diffLabel = "Expert+";
                break;
            case "expert+":
                //Really would wish that BeatKhana API used the same naming convention as BeatSaver........
                var diffColor = "#900000";
                var diffLabel = "Expert+";
                break;
            default:
                var diffColor = "#000000";
                break;
        }

        clone.setAttribute("title", songName[i] + " | " + diffLabel);
        clone.style.boxShadow = "0px 0px 10px 0px " + diffColor;
        clone.style.background = diffColor;

        clone.style.display = "block";

        document.getElementById("SongDivs").appendChild(clone);
    }
};

function localPools() {
    Swal.fire({
        title: 'Upload your local pools',
        html: 'Please click on "Upload", upload your pools, and then confirm.',
        heightAuto: true,
        confirmButtonText: 'Confirm',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: '<a href="./upload.php" target="blank"_>Upload.</a>'
    }).then(function (result) {
        if (result.value) {
            console.log("Checking for files pool-files.");
            $.ajax({
                url: "./pools/",
                success: function (data) {
                    $(data).find("a").attr("href", function (i, val) {
                        if (val.match(/\.bplist$/) || val.match(/\.json$/)) {
                            songOptions[val] = decodeURI(val).replace(/\.[^/.]+$/, "");
                            selectLocalMapPool();
                        }
                    });
                }
            });
        }
    });
};

function selectLocalMapPool() {
    Swal.fire({
        title: 'Select a map pool',
        input: 'select',
        inputOptions: songOptions,
        inputPlaceholder: 'Select a map pool',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                    resolve()
                } else {
                    resolve('You need to select something!');
                }
            })
        }
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'Map pool selected!',
                html: 'You selected map pool<b>: ' + decodeURI(result.value).replace(/\.[^/.]+$/, "</b>"),
            });
            setSongJSON(result.value);
            document.getElementById("VERSUSDIV").style.display = "inline-block";
            setTimeout(function () {
                document.getElementById("VERSUSDIV").style.opacity = "1";
            }, 1000);
        }
    })
};

function setSongJSON(playlist) {
    $.getJSON("./pools/" + playlist, function (data) {
        var songList = data.songs;
        var songHashes = [];
        for (var i = 0; i < songList.length; i++) {
            songHashes.push(songList[i].hash);
        }
        var diffNames = [];
        for (var i = 0; i < songList.length; i++) {
            diffNames.push(songList[i].difficulties[0].name);
        }
        var songNames = [];
        for (var i = 0; i < songList.length; i++) {
            songNames.push(songList[i].songName);
        }
        if (debug) {
            console.log(songHashes + " | " + diffNames);
        }
        ws.send(JSON.stringify({
            'Type': '5',
            'command': 'setPool',
            'songHash': songHashes,
            'songDiff': diffNames
        }));
        setPool(songHashes, diffNames, songNames);
    });
};

const inputOptions = new Promise((resolve) => {
    resolve({
        '1': '1V1',
        '2': 'Battle Royale'
    })
});

function configPop() {
    const {
        value: tmstyle
    } = Swal.fire({
        title: 'Select tournament style.',
        input: 'radio',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputOptions: inputOptions,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to choose something!'
            } else {
                tmconfig = value;
                switch (value) {
                    case "1":
                        tmconfig = 1;
                        title = "1V1";
                        break;
                    case "2":
                        tmconfig = 2;
                        title = "Battle Royale";
                        break;
                }
                if (debug) {
                    console.log(value);
                }
                if (value) {
                    return new Promise((resolve) => {
						if (tmconfig == 1) {
                        Swal.fire({
                            title: 'Do you use BeatKhana?',
                            html: 'If you do, make sure your tournament is public, and map-pools can be seen.',
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: 'Yes',
                            denyButtonText: 'No',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                local = false;
                                alert(title, "Yes");
                            } else if (result.isDenied) {
                                local = true;
                                alert(title, "No");
                            }
                        });
						}
						if (tmconfig == 2) {
							alert(title, "No");
						}
                    });
                }
            }
        }
    });
};

function alert(title, local) {
	if (tmconfig == 1) {
    let timerInterval
    Swal.fire({
        title: 'You\'re connected!',
        html: 'Tournament style: <b>' + title + '</b>.<br/>BeatKhana: <b>' + local + '</b>.<br/>Press the "<b>Configure</b>"-button to setup the overlay.',
        timer: 5000,
        timerProgressBar: true,
        willClose: () => {
            clearInterval(timerInterval)
        }
    });
	}
	if (tmconfig == 2) {
	let timerInterval
    Swal.fire({
        title: 'You\'re connected!',
        html: 'Tournament style: ' + title + '.<br/>Press the "<b>Configure</b>"-button to setup the overlay.',
        timer: 5000,
        timerProgressBar: true,
        willClose: () => {
            clearInterval(timerInterval)
        }
    });
	}
}

function BeatKhana() {
    Swal.fire({
        title: 'BeatKhana ID',
        input: 'number',
        inputPlaceholder: '2147484260',
        heightAuto: true,
        confirmButtonText: 'Confirm',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: '<a  href="https://i.imgur.com/jDPd8WN.png" target="blank"_>How to find id?</a>',
		inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!'); } }) }
    }).then(function (result) {
        if (result.value) {
            checkForFiles(result.value);
        }
    });
}
function checkForFiles(id) {
    if (debug) {
        console.log("Checking for files pool-files.");
    }
    //Try to get pool-files.json else show error
    $.ajax({
        url: "https://beatkhana.com/api/tournament/" + id + "/map-pools",
        type: "GET",
        success: function (data) {
            var key = Object.keys(data);
            for (var i = 0; i < key.length; i++) {
                songOptions[data[key[i]].id] = data[key[i]].poolName;
                poolData.push(data[key[i]]);
                selectMapPool();
            }
        },
    });
}
function selectMapPool() {
    Swal.fire({
        title: 'Select a map pool',
        input: 'select',
        inputOptions: songOptions,
        inputPlaceholder: 'Select a map pool',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                    resolve();
                } else {
                    resolve('You need to select something!');
                }
            })
        }
    }).then((result) => {
        if (result.value) {
            //Select the array where id = result.value
            var pool = poolData.find(x => x.id == result.value);

            if (debug) {
                console.log(pool);
            }

            //Insert the hashes and diff from that array into the songHashes and diffNames array
            var songHashes = [];
            for (var i = 0; i < pool.songs.length; i++) {
                songHashes.push(pool.songs[i].hash);
            }
            var diffNames = [];
            for (var i = 0; i < pool.songs.length; i++) {
                diffNames.push(pool.songs[i].diff);
            }
            var songNames = [];
            for (var i = 0; i < pool.songs.length; i++) {
                songNames.push(pool.songs[i].name);
            }
            if (debug) {
                console.log(songHashes + " | " + diffNames);
            }

            ws.send(JSON.stringify({
                'Type': '5',
                'command': 'setPool',
                'songHash': songHashes,
                'songDiff': diffNames
            }));
            setPool(songHashes, diffNames, songNames);
        }
        Swal.fire({
            title: 'Map pool selected!',
            html: 'You selected map pool<b>: ' + pool.poolName + '<br/>',
        });
        setSongJSON(result.value);
        document.getElementById("VERSUSDIV").style.display = "inline-block";
        setTimeout(function () {
            document.getElementById("VERSUSDIV").style.opacity = "1";
        }, 1000);
    });
};

function addUsernames(usernames, userids, twitchnames) {
    var select1 = document.getElementById("playerScreenNames");
    var select2 = document.getElementById("playerSpectatingNames");
    for (var i = 0; i < usernames.length; i++) {
        var opt = usernames[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = userids[i];
        select1.appendChild(el);
        var ell = document.createElement("option");
        ell.textContent = opt;
        ell.value = twitchnames[i];
        select2.appendChild(ell);
    }
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

function sendToOverlay(type) {
    if (type == "playerScreen") {
        if (document.getElementById("playerScreenNames").value != "") {
            if (document.getElementById("alive").value != "") {
                var username = document.getElementById("playerScreenNames").options[document.getElementById("playerScreenNames").selectedIndex].text;
                var userid = document.getElementById("playerScreenNames").value;
                var score = document.getElementById("score").value;
                var alive = document.getElementById("alive").value;
                ws.send(JSON.stringify({
                    'Type': '6',
                    'command': 'updateScore',
                    'PlayerId': userid,
                    'score': score,
                    'alive': alive
                }));
                if (alive == "false") {
                    var select = document.getElementById("playerSpectatingNames");
                    for (var i = 0; i < select.options.length; i++) {
                        if (select.options[i].text == username) {
                            select.remove(i);
                        }
                    }
                    document.getElementById("score").value = "";
                    document.getElementById("playerScreenNames").selectedIndex = 0;
                    document.getElementById("alive").selectedIndex = 0;
                    $("#playerScreenNames option[value='" + userid + "']").remove();
                    $("#playerSpectatingNames option[value='" + username + "']").remove();
                }
            }
        }
        if (debug) {
            console.log(JSON.stringify({
                'Type': '6',
                'command': 'updateScore',
                'PlayerId': userid,
                'score': score,
                'alive': alive
            }));
        }
    } else if (type == "playerSpec") {
        var username = document.getElementById("playerSpectatingNames").options[document.getElementById("playerSpectatingNames").selectedIndex].text;
        var twitchname = document.getElementById("playerSpectatingNames").value;
        ws.send(JSON.stringify({
            'Type': '6',
            'command': 'updateSpectator',
            'Player': username,
            'Twitch': twitchname
        }));
    } else if (type == "resetSpec") {
        ws.send(JSON.stringify({
            'Type': '6',
            'command': 'resetSpectator'
        }));
    } else if (type == "sendScore") {
        var p1Score = document.getElementById("P1ScoreSlider").value;
        var p2Score = document.getElementById("P2ScoreSlider").value;
        if (debug) {
            console.log(PlayerInfo[0][0] + " | Score: " + p1Score + " - " + PlayerInfo[1][0] + " | Score: " + p2Score);
        }
        ws.send(JSON.stringify({
            'Type': '5',
            'command': 'updateScore',
            'PlayerIds': [PlayerInfo[0][1], PlayerInfo[1][1]],
            'Score': [p1Score, p2Score]
        }));
    }
}

function configure() {
    if (!inMatch) {
        if (tmconfig == 3) {
            Swal.fire({
                title: 'No tournament style selected!',
                html: 'Please select a tournament style, before configuring the overlay.',
                confirmButtonText: 'Setup'
            }).then(function (result) {
                if (result.isConfirmed) {
                    configPop();
                }
            })
        } else if (tmconfig == 1) {
            Swal.fire({
                title: 'Player 1 Info',
                input: 'textarea',
                inputPlaceholder: 'Username\nUser ID\nTwitch Name',
                heightAuto: true,
                confirmButtonText: 'Confirm',
                allowOutsideClick: false,
                allowEscapeKey: false,
                footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
				inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
            }).then(function (result) {
                if (result.value) {
                    PlayerInfo.push(result.value.split("\n"));
                    Swal.fire({
                        title: 'Player 2 Info',
                        input: 'textarea',
                        inputPlaceholder: 'Username\nUser ID\nTwitch Name',
                        heightAuto: true,
                        confirmButtonText: 'Confirm',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        footer: '<a  href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
						inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                    }).then(function (result) {
                        if (result.value) {
                            PlayerInfo.push(result.value.split("\n"));
                            Swal.fire({
                                title: 'Round',
                                input: 'text',
                                inputPlaceholder: 'Round 1',
                                heightAuto: true,
                                confirmButtonText: 'Confirm',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                footer: '<a  href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
								inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                            }).then(function (result) {
                                if (result.value) {
                                    PlayerInfo.push(result.value.split("\n"));
                                    round = result.value;
                                    if (debug) {
                                        console.log("Player 1 | Name: " + PlayerInfo[0][0] + " | ScoresaberID: " + PlayerInfo[0][1] + " | Twitch ID: " + PlayerInfo[0][2]);
                                        console.log("Player 2 | Name: " + PlayerInfo[1][0] + " | ScoresaberID: " + PlayerInfo[1][1] + " | Twitch ID: " + PlayerInfo[1][2]);
                                    }

                                    P1 = PlayerInfo[0][1];
                                    P2 = PlayerInfo[1][1];
                                    P1Name = PlayerInfo[0][0];
                                    P2Name = PlayerInfo[1][0];

                                    document.getElementById("configurebutton").setAttribute("disabled", "");
                                    document.getElementById("playerScore").removeAttribute("disabled");
                                    document.getElementById("P1ScoreSlider").removeAttribute("disabled");
                                    document.getElementById("P2ScoreSlider").removeAttribute("disabled");
                                    document.getElementById("P1Name").innerHTML = PlayerInfo[0][0] + "'s score";
                                    document.getElementById("P2Name").innerHTML = PlayerInfo[1][0] + "'s score";
                                    inMatch = true;
                                    ws.send(JSON.stringify({
                                        'Type': '5',
                                        'command': 'createUsers',
                                        'PlayerNames': [PlayerInfo[0][0], PlayerInfo[1][0]],
                                        'PlayerIds': [PlayerInfo[0][1], PlayerInfo[1][1]],
                                        'TwitchIds': [PlayerInfo[0][2], PlayerInfo[1][2]],
                                        'Round': round
                                    }));
                                    if (!local) {
                                        BeatKhana();
                                    } if (local) {
                                        localPools();
                                    }
                                }
                            })
                        }
                    })
                }
            })
        } else if (tmconfig == 2) {
            Swal.fire({
                title: 'Complete list of usernames',
                input: 'textarea',
                heightAuto: true,
                confirmButtonText: 'Confirm',
                allowOutsideClick: false,
                allowEscapeKey: false,
                footer: '<a  href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
				inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
            }).then(function (result) {
                if (result.value) {
                    usernames = result.value.split("\n");

                    Swal.fire({
                        title: 'Complete list of userids',
                        input: 'textarea',
                        heightAuto: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Confirm',
                        footer: '<a  href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
						inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                    }).then(function (result) {
                        if (result.value) {
                            userids = result.value.split("\n");

                            Swal.fire({
                                title: 'Complete list of Twitchnames',
                                input: 'textarea',
                                heightAuto: true,
                                confirmButtonText: 'Confirm',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                footer: '<a  href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
								inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                            }).then(function (result) {
                                if (result.value) {
                                    twitchnames = result.value.split("\n");

                                    addUsernames(usernames, userids, twitchnames);

                                    document.getElementById("configurebutton").setAttribute("disabled", "");
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