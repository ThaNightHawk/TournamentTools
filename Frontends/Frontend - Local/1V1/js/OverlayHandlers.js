//Sets the overlay data for Player 1, Player 2 and the round.
async function setOverlay(playerIDs, playerNames, Round) {
	document.getElementById("roundTextP").innerText = Round;
	fetch('https://skillsaber.vercel.app/api/player?id=' + playerIDs[0])
		.then(response => response.json())
		.then(data => {
			let playerCountry = data.country;
			document.getElementById("Player1Image").src = data.profilePicture;
			document.getElementById("Player1Name").innerText = playerNames[0];
			document.getElementById("Player1Rank").innerText = '#' + data.rank + ' Global | #' + data.countryRank + ' ' + playerCountry;
			document.getElementById("Player1Flag").src = "https://flagicons.lipis.dev/flags/4x3/" + playerCountry.toLowerCase() + ".svg";
			document.getElementById("Player1Name").style.opacity = '1';
			document.getElementById("Player1Rank").style.opacity = '0.6';
		});
	fetch('https://skillsaber.vercel.app/api/player?id=' + playerIDs[1])
		.then(response => response.json())
		.then(data => {
			let playerCountry = data.country;
			document.getElementById("Player1Image").src = data.profilePicture;
			document.getElementById("Player1Name").innerText = playerNames[1];
			document.getElementById("Player1Rank").innerText = '#' + data.rank + ' Global | #' + data.countryRank + ' ' + playerCountry;
			document.getElementById("Player1Flag").src = "https://flagicons.lipis.dev/flags/4x3/" + playerCountry.toLowerCase() + ".svg";
			document.getElementById("Player1Name").style.opacity = '1';
			document.getElementById("Player1Rank").style.opacity = '0.6';
		});

	setTimeout(function () {
		document.getElementById("PlayerBounds").style.opacity = '1';
		document.getElementById("PlayerContainers").style.opacity = '1';
		document.getElementById("leftPoints").style.opacity = '1';
		document.getElementById("rightPoints").style.opacity = '1';
		document.getElementById("roundTextP").style.opacity = '1';
	}, 1000);
}