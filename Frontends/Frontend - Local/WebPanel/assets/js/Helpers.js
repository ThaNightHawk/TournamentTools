function getOptionHtml(matchId, coordinator, player1, player2, player3, player4, players) {
    let optionHtml;
    if (players.length < 3) {
        optionHtml = `<option 
            data-match-id="${matchId}"
            data-coordinator-name="${coordinator.name}"
            data-coordinator-id="${coordinator.id}"
            data-player1-name="${player1.name}"
            data-player1-id="${player1.user_id}"
            data-player1-guid="${player1.guid}"
            data-player1-teamname="${player1.team[0]}"
            data-player1-teamguid="${player1.team[1]}"
            data-player2-name="${player2.name}"
            data-player2-id="${player2.user_id}"
            data-player2-guid="${player2.guid}"
            data-player2-teamname="${player2.team[0]}"
            data-player2-teamguid="${player2.team[1]}"
            >1V1 | ${player1.name} vs ${player2.name}</option>`;
    } else {
        optionHtml = `<option 
            data-match-id="${matchId}"
            data-coordinator-name="${coordinator.name}"
            data-coordinator-id="${coordinator.id}"
            data-player1-name="${player1.name}"
            data-player1-id="${player1.user_id}"
            data-player1-guid="${player1.guid}"
            data-player1-teamname="${player1.team[0]}"
            data-player1-teamguid="${player1.team[1]}"
            data-player2-name="${player2.name}"
            data-player2-id="${player2.user_id}"
            data-player2-guid="${player2.guid}"
            data-player2-teamname="${player2.team[0]}"
            data-player2-teamguid="${player2.team[1]}"
            data-player3-name="${player3.name}"
            data-player3-id="${player3.user_id}"
            data-player3-guid="${player3.guid}"
            data-player3-teamname="${player3.team[0]}"
            data-player3-teamguid="${player3.team[1]}"
            data-player4-name="${player4.name}"
            data-player4-id="${player4.user_id}"
            data-player4-guid="${player4.guid}"
            data-player4-teamname="${player4.team[0]}"
            data-player4-teamguid="${player4.team[1]}"
            >2V2 | ${player1.team[0]} vs ${player3.team[0]}</option>`;
            
        TeamNamesIDs = [player1.team[0], player1.team[1], player3.team[0], player3.team[1]];
    }
    return optionHtml;
}
