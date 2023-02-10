function scoreUpdate(player, score, combo, acc, misses, reset) {
	if (playerIDs[0] === player) {
		updatePlayerData(0, score, combo, acc, misses, reset);
	} else if (playerIDs[1] === player) {
		updatePlayerData(1, score, combo, acc, misses, reset);
	}

	if (player === 0 && reset === 1) {
		resetAllPlayers();
	}
}

function updatePlayerData(index, score, combo, acc, misses, reset) {
	const playerAcc = acc.toFixed(2);
	playerCombo[index] = combo;
	playerScore[index] = score;
	playerMisses[index] = misses;

	document.getElementById(`Player${index + 1}Combo`).innerHTML = playerCombo[index] + "x";
	document.getElementById(`Player${index + 1}ACC`).innerHTML = playerAcc + "%";

	if (misses >= 1) {
		document.getElementById(`Player${index + 1}FC`).style.color = "#d15252";
		document.getElementById(`Player${index + 1}FC`).innerHTML = playerMisses[index] + "x";
		playerFC[index] = false;
	} else {
		playerFC[index] = true;
		document.getElementById(`Player${index + 1}FC`).style.color = "#ffffff";
		document.getElementById(`Player${index + 1}FC`).innerHTML = "FC";
	}
}

function resetAllPlayers() {
	playerFC = [true, true];
	playerScore = [0, 0];
	playerAcc = [0, 0];
	playerCombo = [0, 0];
	playerMisses = [0, 0];

	for (let i = 0; i < 2; i++) {
		document.getElementById(`Player${i + 1}FC`).style.color = "#ffffff";
		document.getElementById(`Player${i + 1}FC`).innerHTML = "FC";
		document.getElementById(`Player${i + 1}Combo`).innerHTML = "0x";
		document.getElementById(`Player${i + 1}ACC`).innerHTML = "0.00%";
	}
}