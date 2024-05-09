"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendModal = exports.getUsers = exports.HJS = void 0;
var tournament_assistant_client_1 = require("tournament-assistant-client");
function HJS(str) {
    if (typeof str !== 'string')
        return false;
    try {
        var result = JSON.parse(str);
        var type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    }
    catch (err) {
        return false;
    }
}
exports.HJS = HJS;
function getUsers(taWS, usersArray, coordinatorArray, matchArray) {
    taWS.Players.forEach(function (p) {
        var player = {
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
    taWS.Coordinators.forEach(function (c) {
        var coordinator = {
            name: c.name,
            type: c.client_type,
            user_id: c.user_id,
            guid: c.guid
        };
        coordinatorArray.push(coordinator);
    });
    taWS.Matches.forEach(function (m) {
        var _a;
        var users = m.associated_users.filter(function (guid) {
            var index = usersArray.findIndex(function (x) { return x.guid == guid; });
            return index !== -1 && guid !== taWS.Self.guid;
        });
        var matchusers = users.map(function (guid) {
            var index = usersArray.findIndex(function (x) { return x.guid == guid; });
            return usersArray[index];
        });
        var coordinatorID = m.leader;
        var coordinatorName = ((_a = coordinatorArray.find(function (u) { return u.guid === coordinatorID; })) === null || _a === void 0 ? void 0 : _a.name) || "Unknown";
        var matchData = {
            matchId: m.guid,
            coordinator: { name: coordinatorName, type: 1, user_id: "0", guid: coordinatorID },
            players: matchusers
        };
        matchArray.push({ matchData: matchData });
    });
}
exports.getUsers = getUsers;
function sendModal(taWS, modal_id, modal_user, message_title, message_text, can_close, option_1, option_1_value, option_2, option_2_value) {
    if (!option_1 && !option_2) {
        var modalMessage = new tournament_assistant_client_1.Packets.Command.ShowModal({
            modal_id: modal_id + modal_user,
            message_title: message_title,
            message_text: message_text,
            can_close: can_close,
        });
        taWS.sendMessage([modal_user], modalMessage);
        return;
    }
    if ((option_1 || option_2) && !(option_1 && option_2)) {
        var modalMessage = new tournament_assistant_client_1.Packets.Command.ShowModal({
            modal_id: modal_id + modal_user,
            message_title: message_title,
            message_text: message_text,
            can_close: can_close,
            option_1: new tournament_assistant_client_1.Models.ModalOption({
                label: (option_1 !== undefined && option_1 !== null) ? option_1 : option_2,
                value: option_1_value ? option_1_value : option_2_value
            })
        });
        taWS.sendMessage([modal_user], modalMessage);
        return;
    }
    if (option_1 && option_2) {
        var modalMessage = new tournament_assistant_client_1.Packets.Command.ShowModal({
            modal_id: modal_id + modal_user,
            message_title: message_title,
            message_text: message_text,
            can_close: can_close,
            option_1: new tournament_assistant_client_1.Models.ModalOption({ label: option_1, value: option_1_value }),
            option_2: new tournament_assistant_client_1.Models.ModalOption({ label: option_2, value: option_2_value }),
        });
        taWS.sendMessage([modal_user], modalMessage);
        return;
    }
    console.log("Reached end of sendModal function, make sure you have the correct parameters");
    return;
}
exports.sendModal = sendModal;
