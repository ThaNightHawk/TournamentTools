function scoreUpdate(player, score, combo, acc, misses, reset) {
	if (playerIDs[0] === player) {
		updatePlayerData(0, score, combo, acc, misses);
	}
	if (playerIDs[1] === player) {
		updatePlayerData(1, score, combo, acc, misses);
	}
	if (playerIDs[2] === player) {
		updatePlayerData(2, score, combo, acc, misses);
	}
	if (playerIDs[3] === player) {
		updatePlayerData(3, score, combo, acc, misses);
	}
	if (player === 0 && reset === 1) {
		resetAllPlayers();
	}
}

function updatePlayerData(index, score, combo, acc, misses) {
	playerCombo[index] = combo;
	playerScore[index] = score;
	playerMisses[index] = misses;
	playerAcc[index] = (acc * 100).toFixed(2);

	teamScores = [playerScore[0] + playerScore[1], playerScore[2] + playerScore[3]];
	teamAcc = [((playerAcc[0] / 100) + (playerAcc[1] / 100)) / 2, ((playerAcc[2] / 100) + (playerAcc[3] / 100)) / 2];
	teamCombo = [playerCombo[0] + playerCombo[1], playerCombo[2] + playerCombo[3]];
	teamMisses = [playerMisses[0] + playerMisses[1], playerMisses[2] + playerMisses[3]];
	teamAccDiff = [teamAcc[0] - teamAcc[1], teamAcc[1] - teamAcc[0]];
	teamScoreDiff = [teamScores[0] - teamScores[1], teamScores[1] - teamScores[0]];

	document.getElementById(`Team1ACC`).innerHTML = `${teamAcc[0].toFixed(2)}%`;
	document.getElementById(`Team2ACC`).innerHTML = `${teamAcc[1].toFixed(2)}%`;
	document.getElementById(`Team1Score`).innerHTML = teamScores[0];
	document.getElementById(`Team2Score`).innerHTML = teamScores[1];

	document.getElementById(`Team1ACCDifference`).innerHTML = `${teamAccDiff[0].toFixed(2)}%`;
	document.getElementById(`Team2ACCDifference`).innerHTML = `${teamAccDiff[1].toFixed(2)}%`;
	document.getElementById(`Team1ScoreDifference`).innerHTML = teamScoreDiff[0];
	document.getElementById(`Team2ScoreDifference`).innerHTML = teamScoreDiff[1];

	updateColor(`Team1ACCDifference`, teamAccDiff[0]);
	updateColor(`Team2ACCDifference`, teamAccDiff[1]);
	updateColor(`Team1ScoreDifference`, teamScoreDiff[0]);
	updateColor(`Team2ScoreDifference`, teamScoreDiff[1]);

	document.getElementById(`Player${index + 1}Combo`).innerHTML = `${playerCombo[index]}x`;
	document.getElementById(`Player${index + 1}ACC`).innerHTML = `${(playerAcc[index]/100).toFixed(2)}%`;

	updateFullComboData(index, misses);
}

function updateColor(elementId, value) {
	const element = document.getElementById(elementId);
	element.style.color = value > 0 ? "#00ff00" : value < 0 ? "#ff0000" : "";
}

function updateFullComboData(index, misses) {
	playerFC[index] = misses < 1;
	document.getElementById(`Player${index + 1}FC`).style.color = playerFC[index] ? "#ffffff" : "#d15252";
	document.getElementById(`Player${index + 1}FC`).innerHTML = playerFC[index] ? "FC" : `${misses}x`;

	teamFC[0] = playerFC[0] && playerFC[1];
	teamFC[1] = playerFC[2] && playerFC[3];
	document.getElementById(`Team1FC`).style.color = teamFC[0] ? "#ffffff" : "#d15252";
	document.getElementById(`Team2FC`).style.color = teamFC[1] ? "#ffffff" : "#d15252";
	if (teamFC[0]) {
		document.getElementById(`Team1FC`).innerHTML = "FC";
	} else {
		document.getElementById(`Team1FC`).innerHTML = `${teamMisses[0]}x`;
	}

	if (teamFC[1]) {
		document.getElementById(`Team2FC`).innerHTML = "FC";
	} else {
		document.getElementById(`Team2FC`).innerHTML = `${teamMisses[1]}x`;
	}

}

function resetAllPlayers() {
	playerFC = [true, true, true, true];
	playerScore = [0, 0, 0, 0];
	playerAcc = [0, 0, 0, 0];
	playerCombo = [0, 0, 0, 0];
	playerMisses = [0, 0, 0, 0];
	teamFC = [true, true];
	teamScores = [0, 0];
	teamAcc = [0, 0];
	teamCombo = [0, 0];
	teamMisses = [0, 0];

	for (let i = 0; i < 4; i++) {
		document.getElementById(`Player${i + 1}FC`).style.color = "#ffffff";
		document.getElementById(`Player${i + 1}FC`).innerHTML = "FC";
		document.getElementById(`Player${i + 1}Combo`).innerHTML = "0x";
		document.getElementById(`Player${i + 1}ACC`).innerHTML = "0.00%";
	}

	for (let i = 0; i < 2; i++) {
		document.getElementById(`Team${i + 1}FC`).style.color = "#ffffff";
		document.getElementById(`Team${i + 1}FC`).innerHTML = "FC";
		document.getElementById(`Team${i + 1}Score`).innerHTML = "0";
		document.getElementById(`Team${i + 1}ScoreDifference`).innerHTML = "0";
		document.getElementById(`Team${i + 1}ACC`).innerHTML = "0.00%";
		document.getElementById(`Team${i + 1}ACCDifference`).innerHTML = "0.00%";
	}
}