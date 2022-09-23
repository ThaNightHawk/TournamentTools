//You can use ws:// instead, if you don't have a secured websocket
//though I recommend using wss:// to be able to use the twitch-function.
const relayIp = "wss://domain:port";

var diffText;
var diffTag;

function fancyTimeFormat(duration) {
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function setPool(hash, diff) {
    let SongBox = document.getElementById("SongBox").cloneNode(true);

    fetch('https://api.beatsaver.com/maps/hash/' + hash, {
        headers: {
            'Access-Control-Request-Headers': 'x-requested-with'
        }
    })
        .then(response => {
            return response.json()
        })
        .then(data => {

            SongBox.getElementsByClassName("SongCover")[0].style.background = "url('https://eu.cdn.beatsaver.com/" + hash.toLowerCase() + ".jpg') 0% 0% / cover";
            SongBox.getElementsByClassName("SongArtist")[0].innerText = data.metadata.levelAuthorName;
            SongBox.getElementsByClassName("SongTitle")[0].innerText = data.metadata.songName;
            SongBox.getElementsByClassName("SongMapper")[0].innerText = data.metadata.songAuthorName;
            SongBox.getElementsByClassName("SongKey")[0].innerText = data.id;
            SongBox.getElementsByClassName("SongLength")[0].innerText = fancyTimeFormat(data.metadata.duration);
        });

    SongBox.getElementsByClassName("SongCard")[0].classList.add("SongCard" + hash);
    SongBox.getElementsByClassName("SongCover")[0].classList.add("SongCover" + hash);
    SongBox.getElementsByClassName("SongInfo")[0].classList.add("SongInfo" + hash);
    SongBox.getElementsByClassName("SongPick")[0].classList.add("SongPick" + hash);

    switch (diff.toLowerCase()) {
        case "easy":
            var diffText = "Easy";
            var diffColor = "#008055";
            break;
        case "normal":
            var diffText = "Normal";
            var diffColor = "#1268A1";
            break;
        case "hard":
            var diffText = "Hard";
            var diffColor = "#BD5500";
            break;
        case "expert":
            var diffText = "Expert";
            var diffColor = "#B52A1C";
            break;
        case "expertplus":
            var diffText = "Expert+";
            var diffColor = "#900000";
            break;
        case "expert+":
            //Really would wish that BeatKhana API used the same naming convention as BeatSaver........
            var diffText = "Expert+";
            var diffColor = "#900000";
            break;
    }
    SongBox.getElementsByClassName("DiffTag")[0].style.background = diffColor;
    SongBox.getElementsByClassName("DiffText")[0].innerText = diffText;
    document.getElementById("Songs").appendChild(SongBox);
}

function setPoolLoop(hash, diff) {
    for (let i = 0; i < hash.length; i++) {
        setTimeout(function () {
            setPool(hash[i], diff[i]);
        }, 150 * i);
    }
    setTimeout(function () {
        document.getElementById("Songs").style.opacity = "1";
    }, 3000);
}

try {
    const TAsock = new WebSocket(relayIp);
    TAsock.onopen = function (event) {
        console.log("Connected to Relay-server: " + relayIp);
    }
    TAsock.onmessage = async function (event) {
        jsonObj = JSON.parse(event.data);
        if (jsonObj.Type == 9) { //If 1V1 type
            if (jsonObj.command == "setPool") {
                setPoolLoop(jsonObj.songHash, jsonObj.songDiff);
            } else if (jsonObj.command == "resetOverlay") {
                document.getElementById("Songs").style.opacity = 0;
                setTimeout(function () {
                    $('#Songs').empty();
                }, 1000);
            }
        }
    };
} catch (error) {
    console.log(error);
}