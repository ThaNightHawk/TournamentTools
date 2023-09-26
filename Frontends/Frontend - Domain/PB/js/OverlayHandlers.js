function setOverlay(type, id1, name1, image1, id2, name2, image2) {
    console.log(type)
    if (type == 1) {
        console.log("1v1");
        fetch(`https://skillsaber.vercel.app/api/player?id=${id1}`)
            .then(response => response.json())
            .then(data => {
                PlayerImages[0] = data.profilePicture;
                PlayerIDs[0] = id1;
                const player1Container = document.getElementById("Player1Container");
                player1Container.style.opacity = 1;
                player1Container.querySelector("#Player1Image").src = PlayerImages[0];
                player1Container.querySelector("#Player1Name").innerText = name1;
                player1Container.querySelector("#Player1Rank").innerText = `#${data.rank} Global | #${data.countryRank} ${data.country}`;
            });

        fetch(`https://skillsaber.vercel.app/api/player?id=${id2}`)
            .then(response => response.json())
            .then(data => {
                PlayerImages[1] = data.profilePicture;

                PlayerIDs[1] = id2;

                const player2Container = document.getElementById("Player2Container");
                player2Container.style.opacity = 1;
                player2Container.querySelector("#Player2Image").src = PlayerImages[1];
                player2Container.querySelector("#Player2Name").innerText = name2;
                player2Container.querySelector("#Player2Rank").innerText = `#${data.rank} Global | #${data.countryRank} ${data.country}`;
            });

    } else if (type == 2) {
        [TeamIDs[0], TeamIDs[1]] = [id1, id2];
        [TeamImages[0], TeamImages[1]] = [image1, image2];
        const player1Container = document.getElementById("Player1Container");
        player1Container.querySelector("#Player1Image").src = image1;
        player1Container.querySelector("#Player1Name").innerText = name1;

        const player2Container = document.getElementById("Player2Container");
        player2Container.querySelector("#Player2Image").src = image2;
        player2Container.querySelector("#Player2Name").innerText = name2;

        player1Container.style.opacity = 1;
        player2Container.style.opacity = 1;

    }
}
