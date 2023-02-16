"use strict";
exports.__esModule = true;
exports.getUsers = exports.HJS = void 0;
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
        var _a, _b;
        var player = {
            name: p.name,
            type: p.client_type,
            user_id: p.user_id,
            guid: p.guid,
            team: [((_a = p.team) === null || _a === void 0 ? void 0 : _a.name) || "", ((_b = p.team) === null || _b === void 0 ? void 0 : _b.id) || 0],
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
