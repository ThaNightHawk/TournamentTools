//Update the combo-counter, unless combo is 0
function scoreUpdate(player, score, combo, acc, misses, combined, badCuts, bombHits, wallHits, reset) {
	if (player === 0 && reset === 1) {
		playerFC = [true,true];
		playerScore = [0, 0];
		playerAcc = [0, 0];
		playerCombo = [0, 0];
		playerMisses = [0, 0];

		document.getElementById("Player1FC").style.color = "#ffffff";
		document.getElementById("Player1FC").innerHTML = "FC";
		document.getElementById("Player1Combo").innerHTML = "0x";
		document.getElementById("Player1ACC").innerHTML = "0.00%";

		document.getElementById("Player2FC").style.color = "#ffffff";
		document.getElementById("Player2FC").innerHTML = "FC";
		document.getElementById("Player2Combo").innerHTML = "0x";"x";
		document.getElementById("Player2ACC").innerHTML = "0.00%";
	}

	if (playerIDs[0] == player) {
		playerAcc[0] = acc.toFixed(2);
		playerCombo[0] = combo;
		playerScore[0] = score;
		playerMisses[0] = misses;
		document.getElementById("Player1Combo").innerHTML = playerCombo[0] + "x";
		document.getElementById("Player1ACC").innerHTML = playerAcc[0] + "%";
		if (playerMisses[0] >= 1) {

			document.getElementById("Player1FC").style.color = "#d15252";
			document.getElementById("Player1FC").innerHTML = playerMisses[0] + "x";
			if (playerFC[0]) {
				playerFC[0] = false;
			}
		}
		if (playerMisses[0] == 0) {
			playerFC[0] = true;
			document.getElementById("Player1FC").style.color = "#ffffff";
			document.getElementById("Player1FC").innerHTML = "FC";
		}
	}
	if (playerIDs[1] == player) {
		playerAcc[1] = acc.toFixed(2);
		playerCombo[1] = combo;
		playerScore[1] = score;
		playerMisses[1] = misses;
		document.getElementById("Player2Combo").innerHTML = playerCombo[1] + "x";
		document.getElementById("Player2ACC").innerHTML = playerAcc[1] + "%";
		if (misses >= 1) {
			document.getElementById("Player2FC").style.color = "#d15252";
			document.getElementById("Player2FC").innerHTML = playerMisses[1] + "x";
			if (playerFC[1]) {
				playerFC[1] = false;
			}
		}
		if (playerMisses[1] == 0) {
			playerFC[1] = true;
			document.getElementById("Player2FC").style.color = "#ffffff";
			document.getElementById("Player2FC").innerHTML = "FC";
		}
	}
}