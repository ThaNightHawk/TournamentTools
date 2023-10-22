async function getMap(LevelId, LevelDiff, Player) {
	let songHash = LevelId.replace("custom_level_", "");
	let songDiff = LevelDiff;

	switch (songDiff) {
		case 0:
			var diffText = "Easy";
			var diffColor = "#008055";
			break;
		case 1:
			var diffText = "Normal";
			var diffColor = "#1268A1";
			break;
		case 2:
			var diffText = "Hard";
			var diffColor = "#BD5500";
			break;
		case 3:
			var diffText = "Expert";
			var diffColor = "#B52A1C";
			break;
		case 4:
			var diffText = "Expert+";
			var diffColor = "#454088";
			break;
	}
	if (songData[0] != songHash) {
		songData[0] = songHash;
		songData[1] = songDiff;

		fetch('https://api.beatsaver.com/maps/hash/' + songData[0])
			.then(response => response.json())
			.then(data => {
				document.getElementById("SongBox").style.opacity = "0";
				setTimeout(function () {
					document.getElementById("SongCover").style.background = 'url(https://eu.cdn.beatsaver.com/' + songData[0].toLowerCase() + '.jpg)';
					document.getElementById("SongCover").style.backgroundSize = 'cover';
					document.getElementById("SongCover").style.borderColor = diffColor;
					document.getElementById("SongInfo").style.borderColor = diffColor;
					document.getElementById("DiffTag").style.background = diffColor;
					document.getElementById("DiffTag").innerHTML = diffText;
					document.getElementById("SongTitle").innerHTML = data.metadata.songName;
					document.getElementById("SongMapper").innerHTML = data.metadata.levelAuthorName;
					document.getElementById("SongArtist").innerHTML = data.metadata.songAuthorName;
					document.getElementById("SongKey").innerHTML = data.id;
					document.getElementById("SongLength").innerHTML = fancyTimeFormat(data.metadata.duration);
					if (Player == "Tiebreaker") {
						document.getElementById("SongPick").innerHTML = "Picked as tiebreaker";
					} else {
						document.getElementById("SongPick").innerHTML = "Picked by " + Player;
					}
					setTimeout(function () {
						document.getElementById("SongBox").style.opacity = "1";
					}, 1000);

				}, 1000);
			});
	} else if (songData[0] == songHash && songData[1] != songDiff) {
		songData[1] = songDiff;
		document.getElementById("DiffTag").style.background = diffColor;
		document.getElementById("SongCover").style.borderColor = diffColor;
		document.getElementById("SongInfo").style.borderColor = diffColor;

		setTimeout(function () {
			document.getElementById("DiffTag").style.opacity = "0";
			document.getElementById("DiffTag").innerHTML = diffText;
			document.getElementById("DiffTag").style.opacity = "1";
		}, 1000);
	}
}