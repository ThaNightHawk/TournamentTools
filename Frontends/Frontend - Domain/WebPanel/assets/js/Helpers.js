/* Notification Helpers */

const createSwal = ({
    title,
    input,
    inputPlaceholder,
    heightAuto = true,
    showCancelButton = false,
    allowOutsideClick = false,
    allowEscapeKey = false,
    confirmButtonText,
    footer,
    inputValidator,
}) => {
    return Swal.fire({
        title,
        input,
        inputPlaceholder,
        heightAuto,
        showCancelButton,
        allowOutsideClick,
        allowEscapeKey,
        confirmButtonText,
        footer,
        inputValidator,
    });
};

const matchNotifConf = {
    plainText: false,
    clickToClose: true,
    timeout: 5000,
    position: 'right-bottom'
}

const mapPoolNotifConf = {
    title: 'Select a map pool',
    input: 'select',
    inputOptions: songOptions,
    inputPlaceholder: 'Select a map pool',
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
        return new Promise((resolve) => {
            if (value) {
                resolve();
            } else {
                resolve('You need to select something!');
            }
        })
    }
}

const swalPBConfig = {
    title: 'Pick or Ban?',
    showDenyButton: true,
    showDenyButton: true,
    confirmButtonText: `Pick`,
    denyButtonText: `Ban`,
    cancelButtonText: `Back`,
    confirmButtonColor: '#439555',
    denyButtonColor: '#eb6868',
    cancelButtonColor: '#464646',
    showCancelButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
};

const swalConfig = {
    heightAuto: true,
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Confirm',
    inputValidator: (value) => {
        return new Promise((resolve) => {
            if (value) {
                resolve();
            } else {
                resolve('You need to input something!');
            }
        });
    },
};

/* Diff-color and Diff-Label Helpers */
function getDiffColor(diff) {
    switch (diff) {
        case "easy":
            return "#008055";
        case "normal":
            return "#1268A1";
        case "hard":
            return "#BD5500";
        case "expert":
            return "#B52A1C";
        case "expertplus":
        case "expert+":
            return "#454588";
        default:
            return "#000000";
    }
}

function getDiffLabel(diff) {
    switch (diff) {
        case "easy":
            return "Easy";
        case "normal":
            return "Normal";
        case "hard":
            return "Hard";
        case "expert":
            return "Expert";
        case "expertplus":
        case "expert+":
            return "Expert+";
        default:
            return "";
    }
}

/* VERSUS Helpers */
const dropdown = document.querySelector('#currentMatch');
let selectedMatch = dropdown.options[dropdown.selectedIndex];

dropdown.addEventListener('change', function () {
    selectedMatch = dropdown.options[dropdown.selectedIndex];
});

function groupPlayersByTeam(players) {
    const teams = {};
    players.forEach(player => {
        const teamId = player.team[1];
        if (!teams[teamId]) {
            teams[teamId] = [player];
        } else {
            teams[teamId].push(player);
        }
    });
    return teams;
}

function sortTeamsByName(teams) {
    return teams.map(team => team.sort((a, b) => a.name.localeCompare(b.name)));
}

function getPlayerNames(team1, team2, players) {
    const defaultPlayer = { name: "Placeholder", user_id: "76561198086326146", team: [null, null], guid: "00000000-0000-0000-0000-000000000000" };
    let [player1, player2, player3, player4] = [defaultPlayer, defaultPlayer, defaultPlayer, defaultPlayer];

    if (players.length === 2) {
        [player1, player2] = [team1[0] || defaultPlayer, team1[1] || defaultPlayer];
    } else if (players.length > 2) {
        [player1, player2, player3, player4] = [team1[0] || defaultPlayer, team1[1] || defaultPlayer, team2[0] || defaultPlayer, team2[1] || defaultPlayer];
    }

    return [player1, player2, player3, player4];
}

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
