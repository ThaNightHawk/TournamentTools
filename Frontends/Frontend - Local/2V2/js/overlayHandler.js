//Sets the overlay data for the teams and players + round.
async function setOverlay(teamNames, teamImages, playerIDs, playerNames, Round) {
	document.getElementById("RoundText").innerText = Round;
	document.getElementById("Team1Name").innerText = teamNames[0];
	document.getElementById("Team1Image").src = teamImages[0];
	document.getElementById("Team2Name").innerText = teamNames[1];
	document.getElementById("Team2Image").src = teamImages[1];

	for (i = 0; i < playerIDs.length; i++) {
		fetch('https://new.scoresaber.com/api/player/' + playerIDs[i] + '/basic', {
			headers: {
				'Access-Control-Request-Headers': 'x-requested-with'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.playerInfo.avatar == "/images/oculus.png") {
					document.getElementById("Player" + (i + 1) + "PFP").src = "https://new.scoresaber.com/api/static/avatars/oculus.png";
				} else {
					document.getElementById("Player" + (i + 1) + "PFP").src = "https://new.scoresaber.com/api/static/avatars/" + playerIDs[i] + ".jpg";
				}
				document.getElementById("Player" + (i + 1) + "Name").innerText = playerNames[i];
			});
	}

	setTimeout(function () {
		//Set the overlay to visible here, at some point
	}, 1000);
}

async function resetOverlay() {
	document.getElementById("SongBox").style.opacity = "0";
	document.getElementById("Teams").style.opacity = "0";
	document.getElementById("TeamsTopBar").style.opacity = "0";
	document.getElementById("RoundText").style.opacity = "0";

	setTimeout(function () {
		scoreUpdate(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1);
		songData["", 0];
		teams = ["", "", "", ""];
		playerNames = ["", "", "", ""];
		playerIDs = [0, 0, 0, 0];
		TeamScore = [0, 0];
		TeamScoreDiff = [0, 0];
		TeamACC = [0, 0];
		TeamACCDiff = [0, 0];
		TeamPoints = [0, 0];
		PlayerAcc = [0, 0, 0, 0];
		PlayerCombo = [0, 0, 0, 0];
		PlayerScore = [0, 0, 0, 0];
		PlayerMisses = [0, 0, 0, 0];

		var accs = document.getElementsByClassName("acc");
		for (var i = 0; i < accs.length; i++) {
			accs[i].innerHTML = "0.00%";
		}
		var combos = document.getElementsByClassName("combo");
		for (var i = 0; i < combos.length; i++) {
			combos[i].innerHTML = "0x";
		}
		var fc = document.getElementsByClassName("fc");
		for (var i = 0; i < fc.length; i++) {
			fc[i].innerHTML = "FC";
		}
		var scores = document.getElementsByClassName("score");
		for (var i = 0; i < scores.length; i++) {
			scores[i].innerHTML = "0";
		}
		var scorediff = document.getElementsByClassName("scorediff");
		for (var i = 0; i < scorediff.length; i++) {
			scorediff[i].innerHTML = "0";
			scorediff[i].style.color = "white";
		}
		var accdiff = document.getElementsByClassName("accdiff");
		for (var i = 0; i < accdiff.length; i++) {
			accdiff[i].innerHTML = "0.00%";
			accdiff[i].style.color = "white";
		}
		var usernames = document.getElementsByClassName("username");
		for (var i = 0; i < usernames.length; i++) {
			usernames[i].innerHTML = "";
		}
		var pfp = document.getElementsByClassName("pfp");
		for (var i = 0; i < pfp.length; i++) {
			pfp[i].src = "";
		}

		document.getElementById("RoundText").innerText = 'No Round';
		for (i = 1; i < 8; i++) {
			document.getElementById("l" + i).style.opacity = "0";
			document.getElementById("r" + i).style.opacity = "0";
		}
	}, 1000);
}