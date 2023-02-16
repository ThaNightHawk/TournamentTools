async function setOverlay(playerIDs, playerNames, teamNames, teamImages, Round) {
	console.log(teamImages);
	document.getElementById("Team1Name").innerText = teamNames[0];
	document.getElementById("Team2Name").innerText = teamNames[1];
	document.getElementById("Team1Image").src = teamImages[0];
	document.getElementById("Team2Image").src = teamImages[1];
	document.getElementById("RoundText").innerText = Round;

	for (let i = 0; i < playerIDs.length; i++) {
		const response = await fetch('https://new.scoresaber.com/api/player/' + playerIDs[i] + '/basic', {
			headers: {
				'Access-Control-Request-Headers': 'x-requested-with'
			}
		})
		const data = await response.json();
		document.getElementById("Player" + [i + 1] + "Image").src = data.playerInfo.avatar === '/images/oculus.png'
			? 'https://new.scoresaber.com/api/static/avatars/oculus.png'
			: 'https://new.scoresaber.com/api/static/avatars/' + playerIDs[i] + '.jpg';
		document.getElementById("Player" + [i + 1] + "Name").innerText = playerNames[i];
		document.getElementById("Player" + [i + 1] + "Name").style.opacity = '1';
	}
	setTimeout(function () {
		document.getElementById("RoundText").style.opacity = "1";
		document.getElementById("Teams").style.opacity = "1";
		document.getElementById("TeamsTopBar").style.opacity = "1";
	}, 1000);
}