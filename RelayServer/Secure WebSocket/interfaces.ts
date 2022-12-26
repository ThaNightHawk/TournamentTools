export interface MatchArray {
    matchData: Array<any>;
    matchId: Array<any>;
    coordinator: Coordinator[];
}
export interface Coordinator {
    name: string;
    id: string;
}
export interface Player {
    name: string;
    type: number;
    user_id: string;
    guid: string;
    team?: Team[];
    stream_delay_ms: number;
    stream_sync_start_ms: number;
}
export interface Team {
    name: string;
    id: string;
}
export interface Score {
    user_id: string;
    team: Team[];
    score: number;
    accuracy: number;
    combo: number;
    notesMissed: number;
    badCuts: number;
    bombHits: number;
    wallHits: number;
    maxCombo: number;
    lhAvg: number[];
    lhBadCut: number;
    lhHits: number;
    lhMiss: number;
    rhAvg: number[];
    rhBadCut: number;
    rhHits: number;
    rhMiss: number;
    totalMisses: number;
}