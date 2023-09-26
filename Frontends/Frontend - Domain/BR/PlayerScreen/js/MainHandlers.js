const relayIp = "wss://domain.com:2223";

function createUsers(names, scoresaberIDs) {
  scoresaberIDs.forEach((scoresaberID, index) => {
    const playerDiv = document.getElementById("playerDivTemplate").cloneNode(true);

    fetch(`https://skillsaber.vercel.app/api/player?id=${scoresaberID}`)
      .then((response) => response.json())
      .then((data) => {
        const newPlayerPfp = playerDiv.getElementsByClassName("playerImage")[0];
        newPlayerPfp.src = data.profilePicture;
      });

    const newPlayerText = playerDiv.getElementsByClassName("playerText")[0];
    newPlayerText.classList.add(`playerText${scoresaberID}`);

    const newPlayerImage = playerDiv.getElementsByClassName("playerImage")[0];
    newPlayerImage.classList.add(`playerImage${scoresaberID}`);

    const newPlayerName = playerDiv.getElementsByClassName("playerName")[0];
    newPlayerName.classList.add(`playerName${scoresaberID}`);
    newPlayerName.innerHTML = names[index];

    const newPlayerScore = playerDiv.getElementsByClassName("playerScore")[0];
    newPlayerScore.classList.add(`playerScore${scoresaberID}`);
    newPlayerScore.style.transition = "opacity 0.5s";

    playerDiv.id = `playerDiv${scoresaberID}`;
    playerDiv.style.transition = "opacity 0.5s";
    playerDiv.style.display = "block";
    playerDiv.style.marginRight = "50px";
    playerDiv.style.marginTop = "5px";
    playerDiv.style.marginBottom = "25px";

    document.getElementById("Players").appendChild(playerDiv);
    document.getElementById("Players").style.opacity = "1";
  });
}

function updateUsers(id, score, alive) {
    if (alive === "true") {
      const playerScore = document.querySelector(`.playerScore${id}`);
      playerScore.style.opacity = "0";
  
      setTimeout(() => {
        playerScore.innerHTML = score;
        playerScore.style.opacity = "1";
      }, 1000);
    } else {
      const playerDiv = document.getElementById(`playerDiv${id}`);
      playerDiv.style.opacity = "0.7";
    }
  }

const ws = new WebSocket(relayIp);
ws.onopen = function() {
    console.log("Connected to Relay-server: " + relayIp);
};

ws.onmessage = async function(event) {
    jsonObj = JSON.parse(event.data);

    if (jsonObj.Type == 6) {
        if (jsonObj.command == "createUsers") {
            createUsers(jsonObj.PlayerNames, jsonObj.PlayerIds, jsonObj.order);
        } else if (jsonObj.command == "updateScore") {
            updateUsers(jsonObj.PlayerId, jsonObj.score, jsonObj.alive);
        } else if (jsonObj.command == "resetUsers") {
            document.getElementById("Players").style.opacity = "0";

            setTimeout(function() {
                $('#Players').empty();
            }, 1000);
        }
    }
};