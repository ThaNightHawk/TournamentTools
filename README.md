
![Logo](GitHubImage.png)

# TournamentTools #
This was originally made to be closed-sourced and only for use within the danish Beat Saber Discord, though someone asked me if I would open-source it, and I thought why not, more people would be able to collaborate on it and make it even better.

## Functions:
The 1V1 Tools:
```
- Allows for the coordinator to push, and lock, the 1V1 overlay to 2 specific users.
- Allows for easy management of score-count.
- Allows coordinators to do Picks & Bans, and update the overlay real-time.  
```

The Battle Royale Tools:
```
- Allows for mass-creation of users on overlay.
- Allows for managing scores/alive.
- Allows for changing the spectated playername + stream. (The auto-stream changing requires HTTPS)
- Automatically removes users from the panel when declared dead and grays them out on the overlay.
```

## TODO:
| Function | Where | Why |
| :----: | :----: | :----: |
| User IDs type change | Everywhere | A numeric user ID shouldn't be a string, that simple |
| BeatKhana-support | WebPanel | To allows the user to input a BeatKhana tournament ID, which in return fetches participants, map-pool + bracket, making it easier for the coordinator to pick the match, and eliminates the need for manually typing in username, ScoreSaber ID and Twitch-link |
| TypeScript-version | Everywhere | To enforce types and allow for developers to collaborate easier |

# How to use:
### 1V1 Tools:
- [How to Use](https://www.youtube.com/watch?v=_UYZaVLu1h0) - YouTube link.

### Battle Royale-tools:
- [How to Use](https://www.youtube.com/watch?v=FxN-R_RkI7s) - YouTube link.


# Want to rehost for yourself? 
- [README for Twitch functionality](SELFHOSTWT.md)
- [README without Twitch functionality](SELFHOST.md)

# For Developers
## Message Types
Those are used to communicate the data between the different components.  
- Type 0 is solely used for first connection-message and heartbeats on the  relay-server: 
```json
{"Type":"0","message":"You've connected to the Tournament relay server."}
- Confirms that you've connected to the tournament relay server.

{"Type":"0","message":"heartbeat"}
- Ensures connection is kept alive.
```
- Type 1 is solely used for the BR overlay to know the users+order of the users + remaining users.
```json
{"Type":"1","userid":"ScoreSaberID","order":0}
```
- Type 2 is solely used to delete matches on the relay-server and clearing BR overlay.
```json
{"Type":"2"}
```
- Type 3 variants are used for song-changes on all overlays:
```json
{"Type":"3","LevelId":"custom_level_43304202EC7681E52B4026313C7AB9099BE2890D","Diff":2}
```
- Type 4 variants are used for scoreupdates:
```json
{"Type":"4","playerId":"76561198086326146","score":"100","combo":"0","acc":"1.00"}
```

- Type 5 variants, used by the Webpanel for the 1V1 overlay:
```json
- This message tells the frontend to create the users from the array. This is used for the 1V1 frontend, to ensure correct player order, since TA doesn't knows the player-seeding.
- It also tells the frontend to set the twitch-ids, so the frontend can show the twitch-streams on the overlay.
{"Type":"5","command":"createUsers","PlayerNames":["Hawk","Bitz"],"PlayerIds":["76561198086326146","76561197992369547"],"TwitchIds":["ThaNightHawk","gBitz"],"Round":"Round 1"}

- This message tells the Frontend to update the score of the user with the given id(s).
{"Type":"5","command":"updateScore","PlayerId":["76561198086326146"],"score":["1"]}

- This message tells the Frontend to update the score of the user with the given id.
{"Type":"5","command":"setPool","PoolId":"1","poolData":[]}

- This message tells the Frontend to update the pick and ban overlay.
{"Type":"5","command":"PicksAndBans","Action":"Pick/Ban/Tiebreaker","map":"43304202EC7681E52B4026313C7AB9099BE2890D","PlayerId":"76561198086326146"}

- Resets the overlay.
{"Type":"5","command":"resetOverlay"}
```

- Type 6 variants, used by the Webpanel for the Battle-Royale overlay:
```json
{"Type":"6","command":"createUsers","PlayerNames":["NightHawk","Bitz"],"PlayerIds":["76561198086326146","76561197992369547"]}
- This message tells the BR Player page to create users mentioned in the array. - This is used for the streamhost.

{"Type":"6","command":"updateScore","PlayerId":"76561198086326146","score":"1", "alive":"true"}
- This message tells the BR Player page to update the score of the user with the given id.

{"Type": "6","command":"updateSpectator","Player":"username","Twitch": "twitchname"}
- This message tells the BR overlay to change the spectated username to the given input

{"Type": "6","command":"resetSpectator"}
- This message resets the spectator-screen back to default.

{"Type": "6","command": "resetUsers"}
- Clears users from player-overview

```
\
The types will be expanded upon later, allowing for simultaneous matches, to prevent them interfering with eachother

## Contributing

Do you want to contribute code? Fork this, create a PR with your change(s) + explanation behind it/them and we'll have a look at it.

If you don't want to contribute code, that's ok, if you see anything completely out of order, don't hesitate to question it.
