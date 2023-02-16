function BRHandler() {
    Swal.fire({
        title: 'Complete list of usernames',
        input: 'textarea',
        inputPlaceholder: 'Username1\nUsername2\nUsername3',
        footer: '<a href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
        ...swalConfig,
    }).then((result) => {
        if (result.value) {
            usernames = result.value.split("\n");

            Swal.fire({
                title: 'Complete list of userids',
                input: 'textarea',
                inputPlaceholder: 'ScoreSaberID1\nScoreSaberID2\nScoreSaberID3',
                footer: '<a href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
                ...swalConfig,
            }).then((result) => {
                if (result.value) {
                    userids = result.value.split("\n");

                    Swal.fire({
                        title: 'Complete list of Twitchnames',
                        input: 'textarea',
                        inputPlaceholder: 'TwitchName1\nTwitchName2\nTwitchName3',
                        footer: '<a href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
                        ...swalConfig,
                    }).then((result) => {
                        if (result.value) {
                            twitchnames = result.value.split("\n");

                            addUsernames(usernames, userids, twitchnames);

                            document.getElementById("playerScreenNames").removeAttribute("disabled");
                            document.getElementById("playerSpectatingNames").removeAttribute("disabled");
                            document.getElementById("score").removeAttribute("disabled");
                            document.getElementById("alive").removeAttribute("disabled");
                            document.getElementById("playerScreen").removeAttribute("disabled");
                            document.getElementById("playerSpec").removeAttribute("disabled");
                            document.getElementById("playerResetSpec").removeAttribute("disabled");
                            document.getElementById("BRDIV").style.display = "inline-block";

                            setTimeout(function () {
                                document.getElementById("BRDIV").style.opacity = "1";
                            }, 1000);
                            inMatch = true;
                            ws.send(JSON.stringify({
                                'Type': '6',
                                'command': 'createUsers',
                                'PlayerNames': usernames,
                                'PlayerIds': userids,
                                'order': usernames.length
                            }));
                        }
                    });
                }
            });
        }
    })
}