function setOverlay(P1ID, P1Name, P2ID, P2Name) {

    fetch('https://new.scoresaber.com/api/player/' + P1ID + '/basic')
        .then(response => response.json())
        .then(data => {
            if (data.playerInfo.avatar == "/images/oculus.png") {
                PlayerImages[0] = "https://new.scoresaber.com/api/static/avatars/oculus.png";
            } else {
                PlayerImages[0] = "https://new.scoresaber.com/api/static/avatars/" + P1ID + ".jpg";
            }
            PlayerIDs[0] = P1ID;
            document.getElementById("Player1Image").src = PlayerImages[0];
            document.getElementById("Player1Name").innerText = P1Name;
            document.getElementById("Player1Rank").innerText = '#' + data.playerInfo.rank + ' Global | #' + data.playerInfo.countryRank + ' ' + data.playerInfo.country;
            document.getElementById("Player1Container").style.opacity = 1

        });
    fetch('https://new.scoresaber.com/api/player/' + P2ID + '/basic')
        .then(response => response.json())
        .then(data => {
            if (data.playerInfo.avatar == "/images/oculus.png") {
                PlayerImages[1] = "https://new.scoresaber.com/api/static/avatars/oculus.png";
            } else {
                PlayerImages[1] = "https://new.scoresaber.com/api/static/avatars/" + P2ID + ".jpg";
            }
            PlayerIDs[1] = P2ID;
            document.getElementById("Player2Image").src = PlayerImages[1];
            document.getElementById("Player2Name").innerText = P2Name;
            document.getElementById("Player2Rank").innerText = '#' + data.playerInfo.rank + ' Global | #' + data.playerInfo.countryRank + ' ' + data.playerInfo.country;
            document.getElementById("Player2Container").style.opacity = 1;
        });
}