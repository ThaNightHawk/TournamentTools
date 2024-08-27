function addUsernames(usernames, userids, twitchnames) {
    const select1 = document.getElementById("playerScreenNames");
    const select2 = document.getElementById("playerSpectatingNames");

    for (let i = 0; i < usernames.length; i++) {
        const opt = usernames[i];
        const userid = userids[i];
        const twitchname = twitchnames[i];

        const option1 = document.createElement("option");
        option1.textContent = opt;
        option1.value = userid;
        select1.appendChild(option1);

        const option2 = document.createElement("option");
        option2.textContent = opt;
        option2.value = twitchname;
        select2.appendChild(option2);
    }
};

function configure() {
    if (!inMatch) {
        if (tmconfig === 0) {
            createSwal({
                title: 'No tournament style selected!',
                html: 'Please select a tournament style, before configuring the overlay.',
                confirmButtonText: 'Setup',
            }).then((result) => {
                if (result.isConfirmed) {
                    configPop();
                }
            });
        }
        if (tmconfig == 1) {
            if (PlayerIDs[3]) {
                TwoVTwoHandler();
                return;
            }
            OneVOneHandler();
        }
        if (tmconfig == 3) {
            BRHandler();
        }
    }
}