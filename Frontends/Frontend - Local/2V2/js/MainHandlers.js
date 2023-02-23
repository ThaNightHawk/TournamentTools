const relayIp = "ws://localhost:2223";

//Player data
let playerNames = ["","","",""];
let playerIDs = ["","","",""];
let playerScore = [0, 0, 0, 0];
let playerAcc = [0, 0, 0, 0];
let playerCombo = [0, 0, 0, 0];
let playerMisses = [0, 0, 0, 0];
let playerFC = [true,true,true,true];

//Team data
let teamNames = ["",""];
let teamIDs = ["",""];
let teamScores = [0, 0];
let teamAcc = [0, 0];
let teamCombo = [0, 0];
let teamMisses = [0, 0];
let teamFC = [true,true];
let teamAccDiff = [0, 0];
let teamScoreDiff = [0, 0];

//Current song data
let songData = ["",0];

const ws = new WebSocket(relayIp);
ws.onopen = function () {
	console.log("Msg sent, connected");
};
ws.onmessage = async function (event) {
	jsonObj = JSON.parse(event.data);
	if (jsonObj.Type == 3) // LevelChanged
	{
		if (jsonObj.command == "updateMap") {
			
			//getMap is sent off to mapHandler.js
			getMap(jsonObj.LevelId, jsonObj.Diff, jsonObj.Player);

			//The scoreUpdate it sent off to userScoringHandler.js, to reset the overlay-data for both players.
			scoreUpdate(0, 0, 0, 0, 0, 1);
		}
	}
	if (jsonObj.Type == 4) // Score Update
	{
		//This is sent off to the userScoringHandler.js
		const data = jsonObj.message;
		scoreUpdate(data.user_id, data.score, data.combo, data.accuracy * 100, data.totalMisses, 0);
	}
	if (jsonObj.Type == 5) { //Match Created
		if (jsonObj.command == "createUsers" && jsonObj.matchStyle == "2v2") {
			// Set the data for the 4 players
			playerIDs = [jsonObj.PlayerIds[0], jsonObj.PlayerIds[1], jsonObj.PlayerIds[2], jsonObj.PlayerIds[3]];
			playerNames = [jsonObj.PlayerNames[0], jsonObj.PlayerNames[1], jsonObj.PlayerNames[2], jsonObj.PlayerNames[3]];
			// Set the data for the 2 teams
			teamNames = [jsonObj.TeamNames[0], jsonObj.TeamNames[1]];
			teamImages = [jsonObj.TeamImages[0], jsonObj.TeamImages[1]];
			teamIDs = [jsonObj.TeamIDs[0], jsonObj.TeamIDs[1]];

			setOverlay(playerIDs, playerNames, teamNames, teamImages, jsonObj.Round);
		}
		if (jsonObj.command == "updateScore") {
			//Sends the data off to be handled by the userScoringHandler.js
			changeScoreline(jsonObj.TeamIds, jsonObj.Score);
		}
		if (jsonObj.command == "resetOverlay") {

			document.getElementById("SongBox").style.opacity = "0";
			document.getElementById("RoundText").style.opacity = '0';
			document.getElementById("Teams").style.opacity = "0";
			document.getElementById("TeamsTopBar").style.opacity = "0";

			setTimeout(function () {
				scoreUpdate(0, 0, 0, 0, 0, 1);

				document.getElementById("Team1Name").innerText = "";
				document.getElementById("Team2Name").innerText = "";
				document.getElementById("Team1Image").src = "./images/TeamPlacerholder.png";
				document.getElementById("Team2Image").src = "./images/TeamPlacerholder.png";
				document.getElementById("RoundText").innerText = 'No round set';
				for (i = 1; i < 8; i++) {
					document.getElementById("l" + i).style.opacity = "0";
					document.getElementById("r" + i).style.opacity = "0";
				}
			}, 1000);
		}
	}
};
