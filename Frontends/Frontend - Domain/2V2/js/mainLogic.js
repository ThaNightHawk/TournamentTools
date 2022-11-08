const relayIp = "ws://localhost:2223";

//Data

//Teams = ["Name","GUID","Name","GUID"]
let teamsData = ["","","",""];
let playerNames = ["","","",""];
let playerIDs = [0,0,0,0];

let TeamScore = [0, 0];
let TeamScoreDiff = [0, 0];
let TeamACC = [0, 0];
let TeamACCDiff = [0, 0];
let TeamPoints = [0, 0];

let PlayerAcc = [0, 0, 0, 0];
let PlayerCombo = [0, 0, 0, 0];
let PlayerScore = [0, 0, 0, 0];
let PlayerMisses = [0, 0, 0, 0];
let PlayerFC = [true,true,true,true];

//songData = ["hash",DiffNumber]
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
			getMap(jsonObj.LevelId, jsonObj.Diff, jsonObj.Team);

			//The scoreUpdate it sent off to userScoringHandler.js, to reset the overlay-data for both players.
			scoreUpdate(0, 0, 0, 0, 0, 0, 0, 0, 0, 1);
		}
	}
	if (jsonObj.Type == 4) // Score Update
	{
		//This is sent off to the userScoringHandler.js
		scoreUpdate(jsonObj.message.user_id, jsonObj.message.team, jsonObj.message.score, jsonObj.message.combo, jsonObj.message.accuracy * 100, jsonObj.message.totalMisses, jsonObj.message.notesMissed, jsonObj.message.badCuts, jsonObj.message.bombHits, jsonObj.message.wallHits,0);
	}
	if (jsonObj.Type == 5) { //Match Created
		if (jsonObj.command == "createUsers") {
			teamNames = [jsonObj.TeamNames[0], jsonObj.TeamNames[1]];
			teamImages = [jsonObj.TeamImages[0], jsonObj.TeamImages[1]];
			playerIDs = [jsonObj.PlayerIds[0], jsonObj.PlayerIds[1], jsonObj.PlayerIds[2], jsonObj.PlayerIds[3]];
			playerNames = [jsonObj.PlayerNames[0], jsonObj.PlayerNames[1], jsonObj.PlayerNames[2], jsonObj.PlayerNames[3]];
			//This it sent off to overlayHandler.js
			setOverlay(teamNames, teamImages, playerIDs, playerNames, jsonObj.Round);
		}
		if (jsonObj.command == "updateScore") {
			//Look in ScoreLogic.js for this behemoth... :fearful:
			changeScoreline(jsonObj.Teams, jsonObj.Score);
		}
		if (jsonObj.command == "resetOverlay") {
			//This is sent off to overlayHandler.js
			resetOverlay();
		}
	}
};
