//Sets the overlay data for Player 1, Player 2 and the round.
async function setOverlay(playerIDs,playerNames, Round) {
	document.getElementById("roundTextP").innerText = Round;
	fetch('https://new.scoresaber.com/api/player/' + playerIDs[0] + '/basic', {
		headers: {
			'Access-Control-Request-Headers': 'x-requested-with'
		}
	})
		.then(response => response.json())
		.then(data => {
			let playerCountry = data.playerInfo.country;
			if (data.playerInfo.avatar == "/images/oculus.png") {
				document.getElementById("Player1Image").src = "https://new.scoresaber.com/api/static/avatars/oculus.png";
			} else {
				document.getElementById("Player1Image").src = "https://new.scoresaber.com/api/static/avatars/" + playerIDs[0] + ".jpg";
			}
			document.getElementById("Player1Name").innerText = playerNames[0];
			document.getElementById("Player1Rank").innerText = '#' + data.playerInfo.rank + ' Global | #' + data.playerInfo.countryRank + ' ' + playerCountry;
			document.getElementById("Player1Flag").src = "https://flagicons.lipis.dev/flags/4x3/" + playerCountry.toLowerCase() + ".svg";
			document.getElementById("Player1Name").style.opacity = '1';
			document.getElementById("Player1Rank").style.opacity = '0.6';
		});
	fetch('https://new.scoresaber.com/api/player/' + playerIDs[1] + '/basic', {
		headers: {
			'Access-Control-Request-Headers': 'x-requested-with'
		}
	})
		.then(response => response.json())
		.then(data => {
			let playerCountry = data.playerInfo.country;
			if (data.playerInfo.avatar == "/images/oculus.png") {
				document.getElementById("Player2Image").src = "https://new.scoresaber.com/api/static/avatars/oculus.png";
			} else {
				document.getElementById("Player2Image").src = "https://new.scoresaber.com/api/static/avatars/" + playerIDs[1] + ".jpg";
			}
			document.getElementById("Player2Name").innerText = playerNames[1];
			document.getElementById("Player2Rank").innerText = '#' + data.playerInfo.rank + ' Global | #' + data.playerInfo.countryRank + ' ' + playerCountry;
			document.getElementById("Player2Flag").src = "https://flagicons.lipis.dev/flags/4x3/" + playerCountry.toLowerCase() + ".svg";
			document.getElementById("Player2Name").style.opacity = '1';
			document.getElementById("Player2Rank").style.opacity = '0.6';
		});

	setTimeout(function () {
		document.getElementById("PlayerBounds").style.opacity = '1';
		document.getElementById("PlayerContainers").style.opacity = '1';
		document.getElementById("leftPoints").style.opacity = '1';
		document.getElementById("rightPoints").style.opacity = '1';
		document.getElementById("roundTextP").style.opacity = '1';
	}, 1000);
}