const relayIp = "wss://domain.com:2223";

let PlayerIDs = [];
let PlayerImages = [];

try {
    const TAsock = new WebSocket(relayIp);

    TAsock.onopen = (event) => {
        console.log(`Connected to Relay-server: ${relayIp}`);
    };

    TAsock.onmessage = async (event) => {
        const jsonObj = JSON.parse(event.data);

        switch (jsonObj.Type) {
            case "5": {
                switch (jsonObj.command) {
                    case "createUsers": {
                        setOverlay(
                            jsonObj.PlayerIds[0],
                            jsonObj.PlayerNames[0],
                            jsonObj.PlayerIds[1],
                            jsonObj.PlayerNames[1]
                        );
                        break;
                    }
                    case "setPool": {

                        setPoolLoop(jsonObj.songHash, jsonObj.songDiff);
                        break;
                    }
                    case "PicksAndBans": {
                        switch (jsonObj.Action) {
                            case "Pick": {
                                setMapState(jsonObj.map, "Pick", jsonObj.PlayerId);
                                break;
                            }
                            case "Ban": {
                                setMapState(jsonObj.map, "Ban", jsonObj.PlayerId);
                                break;
                            }
                            case "Tiebreaker": {
                                setMapState(jsonObj.map, jsonObj.Action, "0");
                                break;
                            }
                        }
                        break;
                    }
                    case "resetOverlay": {
                        document.getElementById("Songs").style.opacity = "0";
                        document.getElementById("Player1Container").style.opacity = 0;
                        document.getElementById("Player2Container").style.opacity = 0;
                        setTimeout(() => {
                            $("#Songs").empty();
                        }, 1000);
                        break;
                    }
                }
                break;
            }
        }
    };
} catch (error) {
    console.log(error);
}