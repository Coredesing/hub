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