/* Notification Helpers */

/* Used for when you're requesting a match */
const matchNotifConf = {
    plainText: false,
    clickToClose: true,
    timeout: 5000,
    position: 'right-bottom'
}

/* Used for when you're selecting a map-pool, both BeatKhana and local */
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

/* Used for Picks and Bans */
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

/* Used for when you're setting up a match */
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