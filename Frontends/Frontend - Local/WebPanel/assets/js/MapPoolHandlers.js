function appendSongs(hash, diff, songName, name) {
    const songs = document.getElementById("currentMap");
    const option = document.createElement("option");
    option.textContent = `${songName} | ${diff}`;
    option.value = hash;
    option.dataset.songName = songName;
    option.dataset.hash = diff;
    option.dataset.name = name;
    songs.appendChild(option);
}

function setPool(hashArray, diffArray, songNameArray) {
    const songDiv = document.getElementById("SongDivs");
    const songCircleTemplate = document.getElementById("SongCircle");

    hashArray.forEach((hash, index) => {
        const clone = songCircleTemplate.cloneNode(true);
        clone.classList.add(`SongCircle${hash}`);
        clone.setAttribute("onclick", `PB('${hash}_${diffArray[index]}')`);
        clone.setAttribute("data-hash", hash);
        clone.setAttribute("src", `https://eu.cdn.beatsaver.com/${hash.toLowerCase()}.jpg`);

        const diff = diffArray[index].toLowerCase();
        const title = `${songNameArray[index]} | ${diff}`;
        const diffColor = getDiffColor(diff);
        const diffLabel = getDiffLabel(diff);

        clone.setAttribute("title", title);
        clone.setAttribute("data-title", songNameArray[index]);
        clone.setAttribute("data-diff", diffLabel);

        clone.style.boxShadow = `0px 0px 10px 0px ${diffColor}`;
        clone.style.background = diffColor;

        clone.style.display = "block";

        songDiv.appendChild(clone);
    });
}

function localPools() {
    Swal.fire({
        title: 'Upload your local pools',
        html: `
            <p>Please click on "Upload", select your pools, and then confirm.</p>
            <input type="file" id="fileInput" multiple>
        `,
        heightAuto: true,
        confirmButtonText: 'Confirm',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: '<a href="./upload.php" target="_blank">Upload.</a>',
        preConfirm: () => {
            const files = document.getElementById('fileInput').files;
            if (!files.length) {
                Swal.showValidationMessage('Please select at least one file.');
                return false;
            }
            return files;
        }
    }).then(function (result) {
        if (result.isConfirmed) {
            const files = result.value;
            const songOptions = {};
            const fileContents = {};

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = file.name;

                if (fileName.match(/\.bplist$/) || fileName.match(/\.json$/)) {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        const fileContent = e.target.result;
                        songOptions[fileName] = decodeURI(fileName).replace(/\.[^/.]+$/, "");
                        fileContents[fileName] = fileContent;
                        
                        if (Object.keys(songOptions).length === files.length) {
                            selectLocalMapPool(songOptions, fileContents);
                        }
                    };

                    reader.readAsText(file);
                }
            }
        }
    });
}

function selectLocalMapPool(songOptions, fileContents) {
    Swal.fire({
        ...mapPoolNotifConf,
        inputOptions: songOptions,
        confirmButtonText: 'Select',
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedPool = result.value;
            const selectedFileContent = fileContents[selectedPool];

            Swal.fire({
                title: 'Map pool selected!',
                html: `You selected map pool <b>${decodeURI(selectedPool).replace(/\.[^/.]+$/, "")}</b>`,
            });
            
            setSongJSON(selectedFileContent);
            document.getElementById("MATCHDIV").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("VERSUSDIV").style.display = "inline-block";
                document.getElementById("MATCHDIV").style.display = "none";
                setTimeout(function () {
                    document.getElementById("VERSUSDIV").style.opacity = "1";
                }, 1);
            }, 1);
        }
    });
}

function setSongJSON(fileContent) {
    const data = JSON.parse(fileContent);
    const songList = data.songs;
    const songHashes = songList.map(song => song.hash);
    const diffNames = songList.map(song => song.difficulties[0].name);
    const songNames = songList.map(song => song.songName);

    ws.send(JSON.stringify({
        'Type': '5',
        'command': 'setPool',
        'songHash': songHashes,
        'songDiff': diffNames
    }));

    setPool(songHashes, diffNames, songNames);
}


function BeatKhana() {
    Swal.fire({
        title: 'BeatKhana ID',
        input: 'number',
        inputPlaceholder: '2147484260',
        heightAuto: true,
        confirmButtonText: 'Confirm',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: '<a  href="https://i.imgur.com/jDPd8WN.png" target="blank"_>How to find id?</a>',
        inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!'); } }) }
    }).then(function (result) {
        if (result.value) {
            checkForFiles(result.value);
        }
    });
}

function checkForFiles(id) {
    $.ajax({
        url: "https://beatkhana.com/api/tournament/" + id + "/map-pools",
        type: "GET",
        success: function (data) {
            var key = Object.keys(data);
            for (var i = 0; i < key.length; i++) {
                songOptions[data[key[i]].id] = data[key[i]].poolName;
                poolData.push(data[key[i]]);
                selectMapPool();
            }
        },
    });
}

function selectMapPool() {
    Swal.fire({
        ...mapPoolNotifConf
    }).then((result) => {
        if (result.value) {

            var pool = poolData.find(x => x.id == result.value);

            var songHashes = [];
            for (var i = 0; i < pool.songs.length; i++) {
                songHashes.push(pool.songs[i].hash);
            }
            var diffNames = [];
            for (var i = 0; i < pool.songs.length; i++) {
                diffNames.push(pool.songs[i].diff);
            }
            var songNames = [];
            for (var i = 0; i < pool.songs.length; i++) {
                songNames.push(pool.songs[i].name);
            }

            ws.send(JSON.stringify({
                'Type': '5',
                'command': 'setPool',
                'songHash': songHashes,
                'songDiff': diffNames
            }));
            setPool(songHashes, diffNames, songNames);
        }
        Swal.fire({
            title: 'Map pool selected!',
            html: 'You selected map pool<b>: ' + pool.poolName + '<br/>',
        });
        document.getElementById("MATCHDIV").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("VERSUSDIV").style.display = "inline-block";
            document.getElementById("MATCHDIV").style.display = "none";
            setTimeout(function () {
                document.getElementById("VERSUSDIV").style.opacity = "1";
            }, 1);
        }, 1);
    });
};
