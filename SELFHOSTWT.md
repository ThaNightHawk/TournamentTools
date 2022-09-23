## Requirements:
| Program | Usecase  |
| :--- | :---: |
| [NodeJS](https://nodejs.org/en/download/) | Starting relay server |
| [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) | Installing dependencies for relay server |
| Webserver + Domain/IP with HTTPS **(Optional, though recommended)** | Hosting the overlay + Auto Twitch-functionality |

Why HTTPS? Because of Twitch-restricting embeds to HTTPS unless you're on localhost with a local webserver.

Selfhosting your webserver? Use [Certbot](https://certbot.eff.org/instructions) to obtain SSL certificate/private key for domain+WebSocket server

## Setup relay-server.
Install both NodeJS+NPM. (NodeJS should come with NPM default.)

- Copy `RelayServer/Secure WebSocket` to a folder on your PC. (Gonna be using `C:/Tournament/RelayServer/Secure WebSocket` as an example in this).
- Copy your `certificate.pem` and `privatkey.pem` to the `Keys`-folder. Rename to `cert.pem` and `privkey.pem` respectively. \
(I **highly** recommmend symlinking the files, to ensure Certbot automatically can renew them on expiration)
- Change the IP to the TournmantAssistant Server on line `18` in `C:/Tournament/RelayServer/Secure WebSocket/index.js`.
- Change the `wss://domain.com:2223` on line `44` to the domain associated with the SSL certificate.
- Open a CMD, do `cd "C:/Tournament/RelayServer/Secure WebSocket/"`.
- Run `npm install`.
- When it's finished installing, run `node index`.

You should now see "Connected to relay-server". If not, start from step 1 and try again. - If it keeps happening, contact [Hawk](https://discordapp.com/users/592779895084679188)
- To verify the websocket-server functions, head over to [WebSocketKing](https://websocketking.com/) and connect to `wss://domain.com:2223`.
If it works, and you see `{"Type": "0","message": "You've connected to the relay server."}` in the output, congratulations, you have a secured WebSocket server

If errors still keeps happening, contact [Hawk](https://discordapp.com/users/592779895084679188)

## Setup on Webserver:
- Copy the contents of `Frontend` to your folder of choice on your webserver.
- Change the IP in the following files:

| Filepath | Line  |
| :--- | :---: |
| `{YourFolder}/1V1/js/logic.js` | `3` |
| `{YourFolder}/1V1/twitchstream.html` | `40` |
| `{YourFolder}/PB/js/logic.js` | `3` |
| `{YourFolder}/BR/BROverlay/js/logic.js` | `3` |
| `{YourFolder}/BR/BROverlay/twitchstream.html` | `37` |
| `{YourFolder}/BR/BROverlay/overlay.html` | `275` |
| `{YourFolder}/BR/PlayerScreen/js/logic.js` | `3` |
| `{YourFolder}/1V1/WebPanel/assets/js/logic.js` | `7` |

- Change domain the following files:

| Filepath | Line  |
| :--- | :---: |
| `{YourFolder}/1V1/twitchstream.html` | `42` |
| `{YourFolder}/BR/BROverlay/twitchstream.html` | `39` |

- Add the following files to browser sources in OBS:

| URL | Scene  | Order | Resolution |
| :--- | :---: | :---: | :---: |
| `https://domain/{YourFolder}/1V1/` | `1V1` | `Top` | `1920x1080`|
| `https://domain/{YourFolder}/1V1/twitchstream.html?v=0` | `1V1` | `Bottom` | `1920x1080` |
| `https://domain/{YourFolder}/1V1/twitchstream.html?v=1` | `1V1` | `Bottom` | `1920x1080` |
| `https://domain/{YourFolder}/PB/` | `Picks and Bans` | `Top` | `1920x1080` |
| `https://domain/{YourFolder}/BR/BROverlay/overlay.html` | `Battle Royale` | `Top` | `2560x1140` |
| `https://domain/{YourFolder}/BR/BROverlay/` | `Battle Royale` | `Bottom` | `1920x1080` |
| `https://domain/{YourFolder}/BR/BROverlay/twitchstream.html` | `Battle Royale` | `Bottom` | `1920x1080` |
| `https://domain/{YourFolder}/BR/PlayerScreen/` | `Battle Royale Players` | `Top` | `1920x1080` |

- When everything is setup, you can head over to `https://domain/{YourFolder}/WebPanel/` in your browser and start hosting matches.


Things to note:
- `/1V1/twitchstream.html` allows for changing of the `v`-variable, `?v=0` = Player 1, `?v=1` = Player 2.
- `/BR/BROverlay/twitchstream.html` does **not** allow for this.
