function changeScoreline(player, score) {
    const teamIds = ["l", "r"];
    for (let i = 0; i < playerIDs.length; i++) {
      const isPlayerInTeam = playerIDs[i] === player[i];
      if (!isPlayerInTeam) {
        continue;
      }
      const scoreDigits = score[i].split("");
      for (let j = 1; j <= 7; j++) {
        const selector = `#${teamIds[i]}${j}`;
        const opacity = j <= scoreDigits ? 1 : 0;
        document.querySelector(selector).style.opacity = opacity;
      }
    }
  }
  