function changeScoreline(player, score) {
    let ids = playerIDs[0] == player[0] ? ["l1", "l2", "l3", "l4", "l5", "l6", "l7"] : ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];
    let scoreIndex = parseInt(score[0] == player[0] ? score[0] : score[1]);

    for (let i = 0; i < 7; i++) {
        document.getElementById(ids[i]).style.opacity = i <= scoreIndex ? 1 : 0;
    }
}