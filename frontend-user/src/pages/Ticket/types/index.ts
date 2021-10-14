export type CountDownTimeType = {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}
export interface ResultStaked {
    staked?: number,
    lastTime?: number
}

export type TimelineType = {
    title: string;
    desc: string;
    current?: boolean;
}

export type TokenType = {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}