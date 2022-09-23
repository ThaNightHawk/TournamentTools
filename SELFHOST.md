## Requirements:
| Program | Usecase  |
| :--- | :---: |
| [NodeJS](https://nodejs.org/en/download/) | Starting relay server |
| [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) | Installing dependencies for relay server |
| [XAMPP](https://www.apachefriends.org/download.html) | Hosting the overlay + the map-pool/playlist files for local upload |

If you plan on deploying as production, do **not** use XAMPP as it requires configuration to be safe. 

Since you're not using auto-twitchstreams, you don't need https, but still need a webserver to use the local map-pools/playlists.
- Why? Because of restrictions with code-languages and browser-security in modern browsers.

## Setup relay-server.
Install both NodeJS+NPM. (NodeJS should come with NPM default.)

- Copy `RelayServer/Standard WebSocket` to a folder on your PC. (Gonna be using `C:/Tournament/RelayServer/Standard WebSocket` as an example in this).
- Change the IP to the TournmantAssistant Server on line `22` in `C:/Tournament/RelayServer/Standard WebSocket/index.js`.
- Open a CMD, do `cd "C:/Tournament/RelayServer/Standard WebSocket/"`.
- Run `npm install`.
- When it's finished installing, run `node index`.

You should now see "Connected to relay-server". If not, start from step 1 and try again. - If it keeps happening, contact [Hawk](https://discordapp.com/users/592779895084679188)
- To verify the websocket-server functions, head over to [WebSocketKing](https://websocketking.com/) and connect to `ws://localhost:2223`.
If it works, you should see `{"Type": "0","message": "You've connected to the relay server."}` in the output.

If errors still keeps happening, contact [Hawk](https://discordapp.com/users/592779895084679188)

## Setup overlay files:
- Copy the contents of `Frontend` to a folder on your PC. (Since I use a webserver, I'm gonna use `C:/xampp/htdocs/Tournament/`.)
- Change the IP in the following files to `ws://localhost:2223`:

| Filepath | Line  |
| :--- | :---: |
| `C:/xampp/htdocs/Tournament/1V1/js/logic.js` | `3` |
| `C:/xampp/htdocs/Tournament/PB/js/logic.js` | `3` |
| `C:/xampp/htdocs/Tournament/BR/BROverlay/js/logic.js` | `3` |
| `C:/xampp/htdocs/Tournament/BR/BROverlay/overlay.html` | `275` |
| `C:/xampp/htdocs/Tournament/BR/PlayerScreen/js/logic.js` | `3` |
| `C:/xampp/htdocs/Tournament/1V1/WebPanel/assets/js/logic.js` | `7` |

- Add the following files to browser sources in OBS as `Local File`, and the Twitch-streams as normal URLs:

| URL | Scene  | Order | Resolution |
| :--- | :---: | :---: | :---: |
| `C:/xampp/htdocs/Tournament/1V1/` | `1V1` | `Top` | `1920x1080`|
| [https://player.twitch.tv/?channel=**PLAYER1**&parent=localhost](https://player.twitch.tv/?channel=PLAYER1&parent=localhost) | `1V1` | `Bottom` | `1920x1080`|
| [https://player.twitch.tv/?channel=**PLAYER2**&parent=localhost](https://player.twitch.tv/?channel=PLAYER2&parent=localhost) | `1V1` | `Bottom` | `1920x1080`|
| `C:/xampp/htdocs/Tournament/PB/` | `Picks and Bans` | `Top` | `1920x1080` |
| `C:/xampp/htdocs/Tournament/BR/BROverlay/overlay.html` | `Battle Royale` | `Top` | `2560x1140` |
| `C:/xampp/htdocs/Tournament/BR/BROverlay/` | `Battle Royale` | `Bottom` | `1920x1080` |
| `C:/xampp/htdocs/Tournament/BR/PlayerScreen/` | `Battle Royale Players` | `Top` | `1920x1080` |

- Remember to enable "Control audio via OBS" on both Player-stream sources. 
- Remember to change `PLAYER1` & `PLAYER2` in the Twitch-URLs to the respective player twitch-streams. 
- Remember to scale and "cut" the borders of both player-streams to fit the overlay.

When everything is setup, you can head over to `{DOMAIN/IP}/WebPanel/` in your browser and start hosting matches.
