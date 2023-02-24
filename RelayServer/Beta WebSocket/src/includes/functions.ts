import { Client, Models, Packets } from "tournament-assistant-client";
import { Match, Coordinator, Player, Team, Score } from "./types";

export function HJS(str: string) {
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

export function getUsers(taWS: Client, usersArray: any[], coordinatorArray: any[], matchArray: any[]) {
    taWS.Players.forEach((p: any) => {
        const player: Player = {
            name: p.name,
            type: p.client_type,
            user_id: p.user_id,
            guid: p.guid,
            team: [p.team?.name || "", p.team?.id || 0],
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
        const users = m.associated_users.filter((guid: string) => {
            const index = usersArray.findIndex(x => x.guid == guid);
            return index !== -1 && guid !== taWS.Self.guid;
        });

        const matchusers = users.map((guid: string) => {
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

        matchArray.push({ matchData });
    });
}

export function sendModal(taWS: Client, modal_id: string, modal_user: string, message_title: string, message_text: string, can_close: boolean, option_1?: string, option_1_value?: string, option_2?: string, option_2_value?: string) {
    if (!option_1 && !option_2) {
        const modalMessage = new Packets.Command.ShowModal({
            modal_id: modal_id + modal_user,
            message_title: message_title,
            message_text: message_text,
            can_close: can_close,
        });

        taWS.sendMessage([modal_user], modalMessage);
        return;
    }
    if ((option_1 || option_2) && !(option_1 && option_2)) {
        const modalMessage = new Packets.Command.ShowModal({
            modal_id: modal_id + modal_user,
            message_title: message_title,
            message_text: message_text,
            can_close: can_close,
            option_1: new Models.ModalOption({
                label: (option_1 !== undefined && option_1 !== null) ? option_1 : option_2,
                value: option_1_value ? option_1_value : option_2_value
            })
        });
        taWS.sendMessage([modal_user], modalMessage);
        return;
    }
    if (option_1 && option_2) {
        const modalMessage = new Packets.Command.ShowModal({
            modal_id: modal_id + modal_user,
            message_title: message_title,
            message_text: message_text,
            can_close: can_close,
            option_1: new Models.ModalOption({ label: option_1, value: option_1_value }),
            option_2: new Models.ModalOption({ label: option_2, value: option_2_value }),
        });
        taWS.sendMessage([modal_user], modalMessage);
        return;
    }
    console.log("Reached end of sendModal function, make sure you have the correct parameters");
    return;
}