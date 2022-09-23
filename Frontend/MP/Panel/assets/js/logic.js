// Language: javascript
// Path: init.js
const debug = false;

//You can use ws:// instead, if you don't have a secured websocket
//though I recommend using wss:// to be able to use the twitch-function.
const relayIp = "wss://domain:port";

let local;
let poolId = [];
let songOptions = [];
let poolData = [];

const ws = new WebSocket(relayIp);

ws.onopen = function () {
    localPools();
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

function setPool(hash, diff, songName) {
    for (var i = 0; i < hash.length; i++) {
        var clone = document.getElementById("SongCircle").cloneNode(true);

        clone.classList.add("SongCircle" + hash[i]);
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
        footer: '<a href="../../WebPanel/upload.php" target="blank"_>Upload.</a>'
    }).then(function (result) {
        if (result.value) {
            console.log("Checking for files pool-files.");
            $.ajax({
                url: "../../WebPanel/pools/",
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
    $.getJSON("../../WebPanel/pools/" + playlist, function (data) {
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
            'Type': '9',
            'command': 'setPool',
            'songHash': songHashes,
            'songDiff': diffNames
        }));
        setPool(songHashes, diffNames, songNames);
    });
};
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

function reset() {
    ws.send(JSON.stringify({
        'Type': '9',
        'command': 'resetOverlay'
    }));
    location.reload();
}