export interface Match {
    matchId: string;
    coordinator: Coordinator;
    players: Player[];
}

export interface Coordinator {
    name: string;
    type: number;
    user_id: string;
    guid: string;
}
export interface Player {
    name: string;
    type: number;
    user_id: string;
    guid: string;
    team: Team[];
    stream_delay_ms: number | undefined;
    stream_sync_start_ms: number | undefined;
}
export interface Team {
    name: string;
    id: string;
}
export interface Score {
    user_id: any;
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

export interface ScoreTrackerHand {
    hit?: number;
    miss?: number;
    badCut?: number;
    avgCut?: number[];
}