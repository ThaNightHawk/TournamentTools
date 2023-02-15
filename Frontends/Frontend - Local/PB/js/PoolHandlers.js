async function setPool(hash, diff) {
    let SongBox = document.getElementById("SongBox").cloneNode(true);

    try {
        const response = await fetch(`https://api.beatsaver.com/maps/hash/${hash}`, {
            headers: {
                'Access-Control-Request-Headers': 'x-requested-with'
            }
        });
        const data = await response.json();

        SongBox.querySelector(".SongCover").style.background = `url('https://eu.cdn.beatsaver.com/${hash.toLowerCase()}.jpg') 0% 0% / cover`;
        SongBox.querySelector(".SongArtist").innerText = data.metadata.levelAuthorName;
        SongBox.querySelector(".SongTitle").innerText = data.metadata.songName;
        SongBox.querySelector(".SongMapper").innerText = data.metadata.songAuthorName;
        SongBox.querySelector(".SongKey").innerText = data.id;
        SongBox.querySelector(".SongLength").innerText = fancyTimeFormat(data.metadata.duration);
    } catch (error) {
        console.error(error);
    }

    SongBox.querySelector(".SongCard").classList.add(`SongCard${hash}`);
    SongBox.querySelector(".SongCover").classList.add(`SongCover${hash}`);
    SongBox.querySelector(".SongInfo").classList.add(`SongInfo${hash}`);
    SongBox.querySelector(".SongPick").classList.add(`SongPick${hash}`);

    let diffText, diffColor;
    switch (diff.toLowerCase()) {
        case "easy":
            diffText = "Easy";
            diffColor = "#008055";
            break;
        case "normal":
            diffText = "Normal";
            diffColor = "#1268A1";
            break;
        case "hard":
            diffText = "Hard";
            diffColor = "#BD5500";
            break;
        case "expert":
            diffText = "Expert";
            diffColor = "#B52A1C";
            break;
        case "expertplus":
        case "expert+":
            diffText = "Expert+";
            diffColor = "#454588";
            break;
    }

    SongBox.querySelector(".DiffTag").style.background = diffColor;
    SongBox.querySelector(".DiffText").innerText = diffText;
    document.getElementById("Songs").appendChild(SongBox);
}

function setPoolLoop(hash, diff) {
    for (let i = 0; i < hash.length; i++) {
        setTimeout(function () {
            setPool(hash[i], diff[i]);
        }, 100 * i);
    }
    setTimeout(function () {
        document.getElementById("Songs").style.opacity = "1";
    }, 1000);
}

function guidv4(data) {
    const isGUIDV4 = /^([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)$/i.test(data);
    return isGUIDV4;
}
function setMapState(hash, state, actor) {
    const SongCard = document.getElementsByClassName(`SongCard${hash}`)[0];
    const pick = SongCard.getElementsByClassName(`SongPick${hash}`)[0];
    const cover = SongCard.getElementsByClassName(`SongCover${hash}`)[0];
    const info = SongCard.getElementsByClassName(`SongInfo${hash}`)[0];
    let image;
    if (guidv4(actor)) {
        if (actor == TeamIDs[0]) {
            image = TeamImages[0];
        } else if (actor == TeamIDs[1]) {
            image = TeamImages[1];
        }
    } else {
        if (actor == PlayerIDs[0]) {
            image = PlayerImages[0];
        } else if (actor == PlayerIDs[1]) {
            image = PlayerImages[1];
        }
    }

    if (state === 'Pick') {
        pick.style.backgroundImage = `url('${image}')`;
        cover.style.borderColor = '#3eff68';
        cover.style.boxShadow = '2px 0px 8px #3eff68';
        info.style.borderColor = '#3eff68';
        info.style.boxShadow = '2px 0px 8px #3eff68';
        pick.style.borderColor = '#3eff68';
        pick.style.boxShadow = '2px 0px 8px #3eff68';
        pick.style.opacity = '1';
    } else if (state === 'Ban') {
        pick.style.backgroundImage = `url('${image}')`;
        pick.style.borderColor = '#ff1616';
        pick.style.boxShadow = '#ff1616 2px 0px 8px';
        cover.style.borderColor = '#ff1616';
        cover.style.boxShadow = '#ff1616 2px 0px 8px';
        info.style.borderColor = '#ff1616';
        info.style.boxShadow = '#ff1616 2px 0px 8px';
        pick.style.opacity = '1';
        SongCard.style.opacity = '0.6';
    } else if (state === 'Tiebreaker') {
        pick.style.backgroundImage = "url('./Images/Tiebreaker.png')";
        cover.style.borderColor = '#3eff68';
        cover.style.boxShadow = '2px 0px 8px #3eff68';
        info.style.borderColor = '#3eff68';
        info.style.boxShadow = '2px 0px 8px #3eff68';
        pick.style.borderColor = '#3eff68';
        pick.style.boxShadow = '2px 0px 8px #3eff68';
        pick.style.opacity = '1';
    }
}