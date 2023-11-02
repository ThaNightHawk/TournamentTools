//Sets the overlay data for Player 1, Player 2 and the round.
async function setOverlay(playerIDs, playerNames, Round) {
	document.getElementById("roundTextP").innerText = Round;
	await fetch('https://spi.danesaber.cf/api/bs/ss/' + playerIDs[0])
		.then(response => response.json())
		.then(data => {
			document.getElementById("Player1Name").innerText = playerNames[0];
			document.getElementById("Player1Rank").innerText = '#'+data.countryRank;
			document.getElementById("Player1Name").style.opacity = '1';
			document.getElementById("Player1Rank").style.opacity = '0.9';
		});
	await fetch('https://spi.danesaber.cf/api/bs/ss/' + playerIDs[1])
		.then(response => response.json())
		.then(data => {
			document.getElementById("Player2Name").innerText = playerNames[1];
			document.getElementById("Player2Rank").innerText = '#'+data.countryRank;
			document.getElementById("Player2Name").style.opacity = '1';
			document.getElementById("Player2Rank").style.opacity = '0.9';
		});

	setTimeout(function () {
		document.getElementById("PlayerBounds").style.opacity = '1';
		document.getElementById("PlayerContainers").style.opacity = '1';
		document.getElementById("roundTextP").style.opacity = '1';
	}, 1000);
}