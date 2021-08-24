export const getRemaining = (totalTicket: number, totalSold: number) => {
    return (+totalTicket - +totalSold) || 0;
}

export const calcProgress = (sold: number, total: number) => {
    return Math.ceil((sold * 100) / total) || 0;
}

export const getSeedRound = (key: 0 | 1 | 2 | number) => {
    if(key === 0) return 'Public';
    if(key === 1) return 'Private';
    if(key === 2) return 'Seed';
    return ''
}