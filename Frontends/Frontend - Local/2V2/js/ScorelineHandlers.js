function changeScoreline(team, score) {
    const teamLRs = ["l", "r"];
    for (let i = 0; i < teamIDs.length; i++) {
      const isTeam = teamIDs[i] === team[i];
      if (!isTeam) {
        continue;
      }
      const scoreDigits = score[i].split("");
      for (let j = 1; j <= 7; j++) {
        const selector = `#${teamLRs[i]}${j}`;
        const opacity = j <= scoreDigits ? 1 : 0;
        document.querySelector(selector).style.opacity = opacity;
      }
    }
  }
  