import { Match, Coordinator, Player, Team, Score } from "./types";

export function HJS(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

export function getUsers(taWS, usersArray, coordinatorArray, matchArray) {
    taWS.Players.forEach((p: any) => {
        const player: Player = {
            name: p.name,
            type: p.client_type,
            user_id: p.user_id,
            guid: p.guid,
            team: p.team,
            stream_delay_ms: p.stream_delay_ms,
            stream_sync_start_ms: p.stream_sync_start_ms
        };
        usersArray.push(player);
    });

    taWS.Coordinators.forEach((c: any) => {
        const coordinator: Coordinator = {
            name: c.name,
            type: c.client_type,
            user_id: c.user_id,
            guid: c.guid
        };
        coordinatorArray.push(coordinator);
    });

    taWS.Matches.forEach((m: any) => {
        const users = m.associated_users.filter(guid => {
            const index = usersArray.findIndex(x => x.guid == guid);
            return index !== -1 && guid !== taWS.Self.guid;
        });

        const matchusers = users.map(guid => {
            const index = usersArray.findIndex(x => x.guid == guid);
            return usersArray[index];
        });

        const coordinatorID = m.leader;
        const coordinatorName = coordinatorArray.find(u => u.guid === coordinatorID)?.name || "Unknown";

        const matchData: Match = {
            matchId: m.guid,
            coordinator: { name: coordinatorName, type: 1, user_id: "0", guid: coordinatorID },
            players: matchusers
        }

        matchArray.push({matchData});
    });
}