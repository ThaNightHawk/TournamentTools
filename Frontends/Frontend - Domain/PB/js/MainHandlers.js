const relayIp = "wss://batthew.co.uk:2223";

let PlayerIDs = [];
let PlayerImages = [];
let TeamImages = [];
let TeamIDs = [];

try {
    const TAsock = new WebSocket(relayIp);

    TAsock.onopen = (event) => {
        console.log(`Connected to Relay-server: ${relayIp}`);
    };

    TAsock.onmessage = async (event) => {
        const jsonObj = JSON.parse(event.data);

        if (jsonObj.Type === "5") {
            if (jsonObj.command === "createUsers") {
                if (jsonObj.matchStyle == "1v1") {
                    setOverlay(1, jsonObj.PlayerIds[0], jsonObj.PlayerNames[0], "", jsonObj.PlayerIds[1], jsonObj.PlayerNames[1], "");
                    return;
                }
                if (jsonObj.matchStyle == "2v2") {
                    setOverlay(2, jsonObj.TeamIDs[0], jsonObj.TeamNames[0], jsonObj.TeamImages[0], jsonObj.TeamIDs[1], jsonObj.TeamNames[1], jsonObj.TeamImages[1]);
                    return;
                }
                console.log("CreateUsers reached the end, but no action was taken.");
                return;
            }
            if (jsonObj.command === "setPool") {
                setPoolLoop(jsonObj.songHash, jsonObj.songDiff);
                return;
            }
            if (jsonObj.command === "PicksAndBans") {
                if (jsonObj.Action === "Pick") {
                    setMapState(jsonObj.map, "Pick", jsonObj.Actor);
                    return;
                }
                if (jsonObj.Action === "Ban") {
                    setMapState(jsonObj.map, "Ban", jsonObj.Actor);
                    return;
                }
                if (jsonObj.Action === "Tiebreaker") {
                    setMapState(jsonObj.map, jsonObj.Action, "0");
                    return;
                }
                console.log("PicksAndBans reached the end, but no action was taken.");
                return;
            }
            if (jsonObj.command === "resetOverlay") {
                document.getElementById("Songs").style.opacity = "0";
                document.getElementById("Player1Container").style.opacity = 0;
                document.getElementById("Player2Container").style.opacity = 0;
                setTimeout(() => {
                    document.getElementById("Player1Rank").innerText = "";
                    document.getElementById("Player2Rank").innerText = "";
                    $("#Songs").empty();
                }, 1000);
            }
        }

    };
} catch (error) {
    console.log(error);
}